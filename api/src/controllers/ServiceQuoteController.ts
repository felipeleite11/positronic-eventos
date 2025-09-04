import { Request, Response } from 'express'

import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { ServiceQuote } from '../models/ServiceQuote'
import { WhereOptions } from 'sequelize'

class ServiceQuoteController {
	async index(req: Request, res: Response) {
		const { scope, lots } = req.query

		const where: WhereOptions = {}

		if (lots) {
			where.lot_id = lots
		}

		const response = await ServiceQuote.scope(scope as string || 'full').findAll({
			where
		})

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await ServiceQuote.scope(scope as string || 'full').findByPk(req.params.id)

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
			const response = await ServiceQuote.create(req.body)

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const item = await ServiceQuote.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			const oldQuote = await ServiceQuote.findByPk(req.params.id)

			const body = req.body

			if(body.formula && oldQuote?.formula !== body.formula) {
				body.formula_creator_id = req.person_id
			}

			await ServiceQuote.update(body, {
				where: {
					id: Number(req.params.id)
				}
			})

			const response = await ServiceQuote.scope('full').findByPk(req.params.id)

			return res.json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const item = await ServiceQuote.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await ServiceQuote.destroy({
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

export const serviceQuoteController = new ServiceQuoteController()