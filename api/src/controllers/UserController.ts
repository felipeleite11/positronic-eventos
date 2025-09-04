import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { resolve } from 'path'

import connection from '../models/_connection'
import { User } from '../models/User'
import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { mensageria, sendEmail } from '../services/mensageria'
import { Contact } from '../models/Contact'
import { DocumentTypes } from '../models/DocumentType'
import { Log } from '../models/Log'
import { Person } from '../models/Person'
import { ContactTypes } from '../models/ContactType'

class UserController {
	async index(req: Request, res: Response) {
		const { scope, all = false } = req.query

		const response = await User.scope(scope as string || 'full').findAll({
			paranoid: !all
		})

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await User.scope(scope as string || 'full').findByPk(req.params.id)

			if (!response) {
				throw new errors.NOT_FOUND
			}

			return res.json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async create(req: Request, res: Response) {
		try {
			const response = await User.create(req.body)

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const item = await User.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await User.update(req.body, {
				where: {
					id: Number(req.params.id)
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const item = await User.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await User.destroy({
				where: {
					id: Number(req.params.id)
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async changePassword(req: Request, res: Response) {
		try {
			const { old_password, password } = req.body

			const user = await User.scope('full').findOne({
				where: { id: req.user_id }
			})

			if (!user) {
				throw new errors.NOT_FOUND('Usuário não encontrado')
			}

			const authenticated = await bcrypt.compare(String(old_password), user.password)

			if (!authenticated) {
				throw new errors.NOT_ALLOWED('A senha atual não está correta.')
			}

			const encryptedPassword = await bcrypt.hash(password, 8)

			await User.update({
				password: encryptedPassword,
				password_changed_at: new Date()
			}, {
				where: {
					id: req.user_id
				}
			})

			return res.sendStatus(HTTPStatusCodes.OK)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async sendRecoverPasswordEmail(req: Request, res: Response) {
		try {
			const { email } = req.body

			const contact = await Contact.findOne({
				where: {
					contact: email
				}
			})

			if (!contact) {
				throw new errors.NOT_FOUND('E-mail não associado a nenhum usuário.')
			}

			const user = await User.findOne({
				where: {
					person_id: contact.person_id
				}
			})

			if (!user) {
				throw new errors.NOT_FOUND('Usuário não encontrdado.')
			}

			const token = jwt.sign({
				user_id: user.id
			}, String(process.env.JWT_SECRET), {
				expiresIn: '1d'
			})

			await User.update({
				recover_token: token
			}, {
				where: {
					id: user.id
				}
			})

			await mensageria.post('send_detached', {
				dynamic_template_data: {
					title: 'Recuperação de senha',
					content: 'Para recuperar seu acesso basta clicar no link a seguir e seguir os passos seguintes.',
					action: 'Recuperar acesso',
					link: `${process.env.WEB_URL}/password_recover/update?token=${token}`,
					extra_content: 'Caso não tenha solicitar a recuperação da seua senha, basta ignorar esta mensagem.'
				},
				to: email,
				channel: 'email',
				from: 'no-reply@robot.rio.br',
				sendgrid_template_id: process.env.MENSAGERIA_TEMPLATE_ID
			})

			return res.sendStatus(HTTPStatusCodes.OK)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async recoverPassword(req: Request, res: Response) {
		try {
			const { password, token } = req.body

			const decoded = jwt.decode(token) as { user_id: number }

			const encryptedPassword = await bcrypt.hash(password, 8)

			await User.update({
				password: encryptedPassword,
				recover_token: null
			}, {
				where: {
					id: decoded.user_id
				}
			})

			return res.sendStatus(HTTPStatusCodes.OK)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async resetPassword(req: Request, res: Response) {
		try {
			await connection.transaction(async transaction => {
				const user = await User.scope('profile').findByPk(req.params.id, { transaction })

				if(!user) {
					throw new errors.INSUFICIENT_DATA('Usuário não encontrado.')
				}

				const person = await Person.scope('full').findByPk(user.person.id, { transaction })

				let cpf = person?.documents.find(document => document.type?.id === DocumentTypes.CPF)?.identifier
				const email = person?.contacts.find(contact => contact.type.id === ContactTypes.EMAIL)?.contact

				if(!cpf) {
					throw new errors.INSUFICIENT_DATA('Este usuário deve ter um CPF cadastrado.')
				}

				cpf = cpf.removeSpecialChars()

				await User.update({
					password: await bcrypt.hash(cpf, 8)
				}, {
					where: {
						id: req.params.id
					},
					transaction
				})

				if(email) {
					interface EmailProps {
						name: string
						login: string
						password: string
					}
	
					await sendEmail<EmailProps>({
						recipient: email,
						data: {
							title: 'Senha redefinida',
							action: 'Acessar agora',
							link: String(process.env.WEB_URL),
							template: {
								path: resolve(__dirname, '..', 'template-email', 'password_recover.handlebars'),
								data: {
									name: person.name,
									login: String(user.login),
									password: cpf
								}
							}
						}
					})
				}
			})

			return res.sendStatus(HTTPStatusCodes.OK)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async toggleDisable(req: Request, res: Response) {
		try {
			await connection.transaction(async transaction => {
				const user = await User.findOne({
					where: {
						id: req.params.id
					},
					paranoid: false,
					transaction
				})
	
				if(!user) {
					throw new errors.NOT_FOUND('Usuário não encontrado.')
				}
	
				if(user?.deleted_at) {
					await user.restore({ transaction })
				} else {
					await user.destroy({ transaction })
				}
	
				await Log.create({
					type_id: user?.deleted_at ? 4 : 5,
					person_id: Number(req.person_id),
					details: JSON.stringify({
						usuario: user.id
					})
				}, { transaction })
			})

			return res.sendStatus(HTTPStatusCodes.OK)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const userController = new UserController()