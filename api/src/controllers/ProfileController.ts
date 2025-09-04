import { Request, Response } from 'express'

import { Profile } from '../models/Profile'

import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'

class ProfileController {
	async index(req: Request, res: Response) {

		const response = await Profile.scope('full').findAll()

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const response = await Profile.scope('full').findByPk(req.params.id)

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
			const response = await Profile.create(req.body)

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const item = await Profile.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await Profile.update(req.body, {
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
			const item = await Profile.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await Profile.destroy({
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

export const profileController = new ProfileController()