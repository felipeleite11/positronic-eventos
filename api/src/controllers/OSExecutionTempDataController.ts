import { Request, Response } from 'express'

import connection from '../models/_connection'

import { OSExecutionTempData } from '../models/OSExecutionTempData'

import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { OS } from '../models/OS'
import { errors } from '../utils/errors'

class OSExecutionTempDataController {
	async update(req: Request, res: Response) {
		try {
			const { id } = req.params

			await connection.transaction(async transaction => {
				await OSExecutionTempData.update({
					data: JSON.stringify(req.body)
				}, {
					where: {
						os_id: Number(id)
					},
					transaction
				})
			})

			return res.sendStatus(HTTPStatusCodes.CREATED)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async initialize(req: Request, res: Response) {
		try {
			const { id } = req.params

			const response = await connection.transaction(async transaction => {
				const existingOS = await OSExecutionTempData.findOne({
					where: {
						os_id: Number(id)
					},
					transaction
				})

				if (existingOS) {
					return existingOS.data_obj
				}

				const os = await OS.scope('full').findByPk(id, { transaction })

				if (!os) {
					throw new errors.NOT_FOUND('OS não encontrada.')
				}

				const body = {
					finalOpinion: '',
					observationNoExecution: '',
					report: '',
					services: os.services.map(serv => ({
						id: serv.id
					})),
					extra_services: [],
					resources: []
				}

				const tempDataExisting = await OSExecutionTempData.findOne({
					where: {
						os_id: id
					}
				})

				if(!tempDataExisting) {
					await OSExecutionTempData.create({
						data: JSON.stringify(body),
						os_id: Number(id)
					}, { transaction })
				} else {
					await OSExecutionTempData.update({
						data: JSON.stringify(body)
					}, {
						where: {
							os_id: id
						},
						transaction
					})
				}

				return body
			})

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const osExecutionTempDataController = new OSExecutionTempDataController()