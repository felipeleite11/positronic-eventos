import { Request, Response } from 'express'

import connection from '../models/_connection'

import { Service } from '../models/Service'
import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { ServiceCategory } from '../models/ServiceCategory'

class ServiceController {
	async index(req: Request, res: Response) {
		const { scope } = req.query

		const response = await Service.scope(scope as string || 'full').findAll({
			include: [
				{
					model: ServiceCategory,
					as: 'category',
					attributes: ['id', 'description']
				}
			]
		})

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await Service.scope(scope as string || 'full').findByPk(req.params.id, {
				include: [
					{
						model: ServiceCategory,
						as: 'category',
						attributes: ['id', 'description']
					}
				]
			})

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
			await Service.create({
				...req.body,
				font_id: req.body.font
			})

			return res.sendStatus(HTTPStatusCodes.CREATED)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params

			await connection.transaction(async transaction => {
				const item = await Service.scope('full').findByPk(id, { transaction })

				if (!item) {
					throw new errors.NOT_FOUND
				}

				await Service.update({
					...req.body,
					font_id: req.body.font
				}, {
					where: { id },
					transaction
				})
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const item = await Service.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await Service.destroy({
				where: {
					id: Number(req.params.id)
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const serviceController = new ServiceController()