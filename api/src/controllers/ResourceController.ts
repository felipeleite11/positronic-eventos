import { Request, Response } from 'express'

import connection from '../models/_connection'

import { Resource } from '../models/Resource'
import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { ResourceDimension } from '../models/ResourceDimension'
import { ResourceDimensionResource } from '../models/ResourceDimensionResource'

class ResourceController {
	async index(req: Request, res: Response) {
		const { scope } = req.query

		const response = await Resource.scope(scope as string || 'full').findAll()

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await Resource.scope(scope as string || 'full').findByPk(req.params.id)

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
			const { dimensions, ...props } = req.body

			const response = await connection.transaction(async transaction => {
				const resource = await Resource.create(props, { transaction })

				await ResourceDimensionResource.bulkCreate(dimensions.map((dimension: ResourceDimension) => ({
					resource_dimension_id: Number(dimension),
					resource_id: resource.id
				})), { transaction })

				return resource
			})

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { dimensions, ...props } = req.body

			await connection.transaction(async transaction => {
				const item = await Resource.scope('full').findByPk(req.params.id, { transaction })

				if(!item) {
					throw new errors.NOT_FOUND
				}

				const newDimensions = dimensions.filter((dim: string) => !item.dimensions.map(d => d.id).includes(Number(dim)))
				const toRemove = item.dimensions.filter(dim => !dimensions.includes(String(dim.id))).map(d => d.id)

				await Resource.update(props, {
					where: {
						id: req.params.id
					},
					transaction
				})

				await ResourceDimensionResource.bulkCreate(newDimensions.map((dim: string) => ({
					resource_dimension_id: Number(dim),
					resource_id: req.params.id
				})), { transaction })

				await ResourceDimensionResource.destroy({
					where: {
						resource_dimension_id: toRemove,
						resource_id: req.params.id
					},
					force: true,
					transaction
				})
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const item = await Resource.scope('full').findByPk(req.params.id)

			if(!item) {
				throw new errors.NOT_FOUND
			}

			await Resource.destroy({
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

export const resourceController = new ResourceController()