import { Request, Response } from 'express'

import { Notification } from '../models/Notification'

import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { WhereOptions } from 'sequelize'

class NotificationController {
	async index(req: Request, res: Response) {
		const { scope, not_read_only = false } = req.query

		const where: WhereOptions = {
			user_id: req.user_id
		}

		if(not_read_only) {
			where.is_read = false
		}

		const response = await Notification.scope(scope as string || 'basic').findAll({
			where,
			order: [['created_at', 'desc']]
		})

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await Notification.scope(scope as string || 'basic').findByPk(req.params.id)

			if(!response) {
				throw new errors.NOT_FOUND
			}

			return res.json(response)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async create(req: Request, res: Response) {
		try {
			const response = await Notification.create(req.body)

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async read(req: Request, res: Response) {
		try {
			const item = await Notification.scope('basic').findByPk(req.params.id)

			if(!item) {
				throw new errors.NOT_FOUND
			}

			await Notification.update({
				is_read: true
			}, {
				where: {
					id: Number(req.params.id)
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const notificationController = new NotificationController()