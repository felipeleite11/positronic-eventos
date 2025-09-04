import { Request, Response } from 'express'

import { ServiceCategory } from '../models/ServiceCategory'

import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { Service } from '../models/Service'

class ServiceCategoryController {
	async index(req: Request, res: Response) {
		const { scope } = req.query

		const response = await ServiceCategory.scope(scope as string || 'full').findAll()

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await ServiceCategory.scope(scope as string || 'full').findByPk(req.params.id)

			if(!response) {
				throw new errors.NOT_FOUND('Categoria não encontrada.')
			}

			return res.json(response)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async create(req: Request, res: Response) {
		try {
			const response = await ServiceCategory.create(req.body)

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const item = await ServiceCategory.scope('full').findByPk(req.params.id)

			if(!item) {
				throw new errors.NOT_FOUND
			}

			await ServiceCategory.update(req.body, {
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
			const item = await ServiceCategory.scope('full').findByPk(req.params.id)

			if(!item) {
				throw new errors.NOT_FOUND
			}

			const hasServices = await Service.count({
				where: {
					category_id: req.params.id
				}
			})

			if(hasServices) {
				throw new errors.NOT_ALLOWED('Não é possível remover esta categoria, pois existem serviços que a utilizam.')
			}

			await ServiceCategory.destroy({
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

export const serviceCategoryController = new ServiceCategoryController()