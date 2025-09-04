import { Request, Response } from 'express'

import { prepareErrorResponse } from '../utils/express-response-prepare'
import { Report } from '../models/Report'
import { errors } from '../utils/errors'
import { MessageChannel } from '../config/queue'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { DocumentGenerators, generators } from '../document-generators/_generators'

class DocumentGenerateController {
	async generate(req: Request, res: Response) {
		try {
			const { identifier, params } = req.body

			const report = await Report.findOne({
				where: {
					identifier
				}
			})

			if (!report) {
				throw new errors.NOT_FOUND('Gerador não cadastrado.')
			}

			params.person_id = req.person_id

			if (report.type === 'pdf') {
				const docDefinitions = await generators[report.generator as DocumentGenerators](params)

				return res.json(docDefinitions)
			}

			if (report.type === 'xlsx') {
				const workbook = await generators[report.generator as DocumentGenerators](params)

				const buffer = await (workbook as any).outputAsync()

				return res.send(buffer)
			}
		} catch (e) {
			console.log(e)
			
			if ((e as Error).message.includes('audio_too_short')) {
				return prepareErrorResponse(new Error('O comando é curto demais. Forneça maiores detalhes.'), res)
			}

			return prepareErrorResponse(e as Error, res)
		}
	}

	// Gerando queued reports (Rabbit MQ)
	async generate2(req: Request, res: Response) {
		try {
			if(!process.env.AMQP_SERVER) {
				return res.sendStatus(HTTPStatusCodes.OK)
			}

			const { identifier, params } = req.body

			const report = await Report.findOne({
				where: {
					identifier
				}
			})

			if (!report) {
				throw new errors.NOT_FOUND('Gerador não cadastrado.')
			}

			params.person_id = req.person_id

			console.log('\n\nEnviando para RabbitMQ...\n')

			MessageChannel.getInstance().sendToQueue({
				service: 'report',
				identifier: report.generator,
				extension: report.type,
				data: {
					person_id: req.user_id
				}
			})

			return res.sendStatus(HTTPStatusCodes.OK)
		} catch (e) {
			if ((e as Error).message.includes('audio_too_short')) {
				return prepareErrorResponse(new Error('O comando é curto demais. Forneça maiores detalhes.'), res)
			}

			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const documentGenerateController = new DocumentGenerateController()