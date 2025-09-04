import { Request, Response } from 'express'

import { OSResource } from '../models/OSResource'

import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'

class OSResourceController {
	async index(req: Request, res: Response) {
		const { scope } = req.query

		const response = await OSResource.scope(scope as string || 'full').findAll()

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await OSResource.scope(scope as string || 'full').findByPk(req.params.id)

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
			const response = await OSResource.create(req.body)

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const item = await OSResource.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await OSResource.update(req.body, {
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
			const item = await OSResource.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await OSResource.destroy({
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

export const osResourceController = new OSResourceController()