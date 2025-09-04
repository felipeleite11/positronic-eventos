import { Request, Response } from 'express'
import * as Yup from 'yup'
import { resolve } from 'path'
import { Op } from 'sequelize'

import connection from '../models/_connection'

import { Person, PersonType } from '../models/Person'

import { errors } from '../utils/errors'

import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { generateSearchInString } from '../utils/sequelize'
import { Address } from '../models/Address'
import { Contact } from '../models/Contact'
import { Document } from '../models/Document'
import { applyCPFMask, identifyDataType } from '../utils/mask'
import { File } from '../models/File'
import { DocumentTypes } from '../models/DocumentType'
import { User } from '../models/User'
import { sendEmail } from '../services/mensageria'
import { ContactTypes } from '../models/ContactType'
import { WorkerLot } from '../models/WorkerLot'

const createValidator = Yup.object({
	name: Yup.string().required('O nome é obrigatório.'),
	type: Yup.string().required('O tipo de pessoa é obrigatório.'),
	address: Yup.object({
		zipcode: Yup.string().required('O CEP é obrigatório.'),
		state: Yup.string().required('O estado é obrigatório.'),
		city: Yup.string().required('O cidade é obrigatória.'),
		district: Yup.string().required('O bairro é obrigatório.'),
		street: Yup.string().required('A rua é obrigatória.'),
		number: Yup.string()
	}),
	contacts: Yup.array().of(Yup.string()),
	documents: Yup.array().of(
		Yup.object({
			identifier: Yup.string(),
			type: Yup.number()
		})
	),
	rule: Yup.number(),
	profile: Yup.number()
})

class PersonController {
	async index(req: Request, res: Response) {
		try {
			const { scope = 'full', name, type, cpf, profile } = req.query

			if (name) {
				const where = generateSearchInString(name as string, {
					ignoreEmptySearch: true
				})

				const people = await Person.scope(String(scope)).findAll({
					where,
					order: [['name', 'ASC']]
				})

				return res.json(people)
			}

			if (type) {
				const people = await Person.scope(String(scope)).findAll({
					where: {
						type: type as PersonType
					},
					order: [['name', 'ASC']]
				})

				const users = await User.scope('profile').findAll({
					where: {
						person_id: people.map(person => person.id)
					}
				})

				for (const person of people) {
					(person.dataValues as any).user = users.find(user => user.person_id === person.id) as User
				}

				return res.json(people)
			}

			if (cpf) {
				const document = await Document.findOne({
					where: {
						identifier: applyCPFMask(cpf as string)
					}
				})

				if (!document) {
					return res.json(null)
				}

				const person = await Person.scope(String(scope)).findByPk(document.person_id)

				return res.json([person])
			}

			if (profile) {
				const users = await User.scope('full').findAll({
					where: {
						profile_id: Number(profile)
					},
					order: [
						[{ model: Person, as: 'person' }, 'name', 'ASC']
					]
				})

				return res.json(users.map(user => user.person))
			}

			const people = await Person.scope(String(scope)).findAll({
				order: [['name', 'ASC']]
			})

			return res.json(people)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async show(req: Request, res: Response) {
		try {
			const person = await Person.scope('full').findByPk(req.params.id)

			if (!person) {
				throw new errors.NOT_FOUND('Pessoa não encontrada.')
			}

			return res.json(person)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async create(req: Request, res: Response) {
		try {
			if ([typeof req.body.documents, typeof req.body.contacts, typeof req.body.address].every(type => type === 'string')) {
				req.body = {
					...req.body,
					documents: JSON.parse(req.body.documents),
					contacts: JSON.parse(req.body.contacts),
					address: JSON.parse(req.body.address)
				}
			}

			await createValidator.validate(req.body)

			const { name, nick, type, address: addressData, contacts, documents, rule, profile, lots } = req.body

			const response = await connection.transaction(async transaction => {
				const address = await Address.create(addressData as Address, { transaction })

				const person = await Person.create({
					name,
					nick,
					type,
					address_id: address.id,
					rule_id: rule
				}, { transaction })

				await Contact.bulkCreate(contacts
					.filter((contact: string) => !!identifyDataType(contact))
					.map((contact: string) => {
						const typeId = identifyDataType(contact)

						if (!typeId) {
							throw new errors.INVALID_DATA('Existem contatos inválidos.')
						}

						return {
							contact,
							type_id: typeId,
							person_id: person.id
						}
					}), { transaction })

				await Document.bulkCreate(documents.map((document: any) => {
					const typeId = document.type || identifyDataType(document.identifier)

					if (!typeId) {
						throw new errors.INVALID_DATA('Existem números de documentos.')
					}

					return {
						identifier: document.identifier,
						type_id: typeId,
						person_id: person.id
					}
				}), { transaction })

				if (req.file?.fieldname) {
					const logo = await File.create({
						link: `${process.env.FILE_STORAGE_BASE_URL}/${(req.file as any).key}`
					}, { transaction })

					await Document.create({
						type_id: DocumentTypes.Logo,
						person_id: person.id,
						file_id: logo.id
					}, { transaction })
				}

				const createdPerson = await Person.scope('full').findByPk(person.id, { transaction })

				if (type === 'worker') {
					let cpf = documents.find((doc: any) => identifyDataType(doc.identifier) === DocumentTypes.CPF)?.identifier

					if (!cpf) {
						throw new errors.INSUFICIENT_DATA('CPF não informado.')
					}

					cpf = cpf.removeSpecialChars()

					const user = await User.create({
						login: cpf,
						password: cpf,
						person_id: person.id,
						profile_id: profile
					}, { transaction })

					await WorkerLot.bulkCreate(lots.map((lotId: number) => ({
						lot_id: lotId,
						worker_id: person.id
					})), { transaction })

					const email = contacts.find((contact: any) => identifyDataType(contact) === ContactTypes.EMAIL)

					if (email) {
						interface EmailProps {
							name: string
							login: string
							password: string
						}

						await sendEmail<EmailProps>({
							recipient: email,
							data: {
								title: 'Seja bem-vindo!',
								action: 'Acessar agora',
								link: String(process.env.WEB_URL),
								template: {
									path: resolve(__dirname, '..', 'template-email', 'welcome.handlebars'),
									data: {
										name: person.name,
										login: String(user.login),
										password: cpf
									}
								}
							}
						})
					}
				}

				return createdPerson
			})

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch (e) {
			console.log(e)
			
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			if ([typeof req.body.documents, typeof req.body.contacts, typeof req.body.address].every(type => type === 'string')) {
				req.body = {
					...req.body,
					documents: JSON.parse(req.body.documents),
					contacts: JSON.parse(req.body.contacts),
					address: JSON.parse(req.body.address)
				}
			}

			await createValidator.validate(req.body)

			const person = await Person.scope('full').findByPk(req.params.id)

			if (!person) {
				throw new errors.NOT_FOUND('Pessoa não encontrada.')
			}

			const { name, nick, type, address: addressData, contacts, documents, rule, profile, lots } = req.body

			const response = await connection.transaction(async transaction => {
				let address: Address

				if (person.address) {
					await Address.update(addressData as Address, {
						where: {
							id: person.address.id
						},
						transaction
					})

					address = await Address.findByPk(person.address.id, { transaction }) as Address
				} else {
					const { id } = await Address.create(addressData as Address, { transaction })

					address = await Address.findByPk(id, { transaction }) as Address
				}

				await Person.update({
					name,
					nick,
					type,
					rule_id: rule,
					address_id: address.id
				}, {
					where: {
						id: req.params.id
					},
					transaction
				})

				if (req.file?.fieldname) {
					const newLogo = await File.create({
						link: `${process.env.FILE_STORAGE_BASE_URL}/${(req.file as any).key}`
					}, { transaction })

					const prevLogos = await Document.scope('full').findAll({
						where: {
							person_id: person.id,
							type_id: DocumentTypes.Logo
						},
						transaction
					})

					if (prevLogos?.length) {
						await File.destroy({
							where: {
								id: prevLogos.map(logo => logo.file?.id) as number[]
							},
							transaction,
							force: true
						})
					}

					await Document.create({
						file_id: newLogo.id,
						person_id: person.id,
						type_id: DocumentTypes.Logo
					}, { transaction })
				}

				await Document.destroy({
					where: {
						person_id: person.id,
						type_id: {
							[Op.not]: DocumentTypes.Logo
						}
					},
					transaction,
					force: true
				})

				await Document.bulkCreate(documents.map((document: any) => {
					const typeId = document.type || identifyDataType(document.identifier)

					return {
						identifier: document.identifier,
						type_id: typeId,
						person_id: person.id
					}
				}), { transaction })

				await Contact.destroy({
					where: {
						person_id: person.id
					},
					transaction,
					force: true
				})

				await Contact.bulkCreate(contacts.map((contact: string) => {
					const typeId = identifyDataType(contact)

					return {
						contact,
						type_id: typeId,
						person_id: person.id
					}
				}), { transaction })

				const updatedPerson = await Person.scope('full').findByPk(person.id, { transaction })

				await User.update({
					profile_id: profile
				}, {
					where: {
						person_id: person.id
					},
					transaction
				})

				await WorkerLot.destroy({
					where: {
						worker_id: person.id
					},
					force: true,
					transaction
				})

				await WorkerLot.bulkCreate(lots.map((lotId: number) => ({
					lot_id: lotId,
					worker_id: person.id
				})), { transaction })

				return updatedPerson
			})

			return res.status(HTTPStatusCodes.OK).json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const person = await Person.scope('basic').findByPk(req.params.id)

			if (!person) {
				throw new errors.NOT_FOUND('Pessoa não encontrada.')
			}

			await User.destroy({
				where: {
					person_id: req.params.id
				}
			})

			await Person.destroy({
				where: {
					id: req.params.id
				},
				individualHooks: true
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const personController = new PersonController()