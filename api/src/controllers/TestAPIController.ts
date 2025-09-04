import { Request, Response } from 'express'
import { resolve } from 'path'

import { sendEmail } from '../services/mensageria'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { io } from '../app'
import { Notification } from '../models/Notification'

class TestAPIController {
	async index(req: Request, res: Response) {
		if(!req.body.cpf) {
			return res.status(400).json({
				error: true,
				reason: 'data_not_found',
				cpf: 'not found'
			})
		}

		const { cpf } = req.body

		let data

		if(cpf.length !== 11) {
			return res.status(400).json({
				error: true,
				reason: 'invalid_data',
				cpf
			})
		}

		switch(cpf) {
			case '11111111111':
				data = {
					status: 'paid',
					last_payment: '2023-12-01 14:22:15',
					cpf: '111.111.111-11'
				}
				break

			case '22222222222':
				data = {
					status: 'pending',
					last_payment: '2023-12-01 14:22:15',
					cpf: '222.222.222-22'
				}
				break

			default:
				data = {
					error: true,
					reason: 'not_found',
					cpf
				}
				break
		}

		return res.json(data)
	}

	async testEmail(req: Request, res: Response) {
		interface EmailProps {
			name: string
			login: string
			password: string
		}

		await sendEmail<EmailProps>({
			recipient: 'felipe@robot.rio.br',
			data: {
				title: 'Teste e-mail',
				action: 'CLIQUE AQUI',
				link: 'http://localhost:3000',
				template: {
					path: resolve(__dirname, '..', 'template-email', 'welcome.handlebars'),
					data: {
						name: 'Felipe Leite',
						login: 'felipe',
						password: '24567656'
					}
				}
			}
		})

		// await sendEmail<EmailProps>({
		// 	recipient: 'felipe@robot.rio.br',
		// 	data: {
		// 		title: 'Teste e-mail',
		// 		action: 'CLIQUE AQUI',
		// 		link: 'http://localhost:3000',
		// 		content: 'Meu texto de e-mail...'
		// 	}
		// })

		return res.sendStatus(HTTPStatusCodes.OK)
	}

	async testUploadMinIO(req: Request, res: Response) {
		try {
			return res.json({
				link: (req.file as any).location
			})
		} catch(e) {
			console.log(e)

			return prepareErrorResponse(e as Error, res)
		}
	}

	async testSocket(req: Request, res: Response) {
		try {
			const { socket, relatorio, params } = req.headers

			console.log('Enviado:', socket)

			new Promise(r => setTimeout(r, 5000)).then(async () => {
				const link = 'teste.pdf'

				await Notification.create({
					content: link,
					title: 'Link teste',
					user_id: 2
				})

				io.to(socket as string).emit('reload_notifications')
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			console.log(e)

			return prepareErrorResponse(e as Error, res) 
		}
	}
}

export const testApiController = new TestAPIController()