import { Request, Response } from 'express'

import { ResourceCategory } from '../models/ResourceCategory'

import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { Resource } from '../models/Resource'

class ResourceCategoryController {
	async index(req: Request, res: Response) {
		const { scope } = req.query

		const response = await ResourceCategory.scope(scope as string || 'full').findAll()

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await ResourceCategory.scope(scope as string || 'full').findByPk(req.params.id)

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
			const response = await ResourceCategory.create(req.body)

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const item = await ResourceCategory.scope('full').findByPk(req.params.id)

			if(!item) {
				throw new errors.NOT_FOUND
			}

			await ResourceCategory.update(req.body, {
				where: {
					id: Number(req.params.id)
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const item = await ResourceCategory.scope('full').findByPk(req.params.id)

			if(!item) {
				throw new errors.NOT_FOUND
			}

			const hasResources = await Resource.count({
				where: {
					category_id: req.params.id
				}
			})

			if(hasResources) {
				throw new errors.NOT_ALLOWED('Não é possível remover esta categoria, pois existem recursos que a utilizam.')
			}

			await ResourceCategory.destroy({
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

export const resourceCategoryController = new ResourceCategoryController()