import { Request, Response } from 'express'

import connection from '../models/_connection'
import { Team } from '../models/Team'
import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { TeamPerson } from '../models/TeamPerson'
import { Person } from '../models/Person'
import { Rule } from '../models/Rule'

interface Worker {
	worker_id: number
	is_master: boolean
}

interface CreateUpdateItemProps {
	workers: Worker[]
	supervisor: number
}

class TeamController {
	async index(req: Request, res: Response) {
		const { scope } = req.query

		const response = await Team.scope(scope as string || 'full').findAll({
			include: [
				{
					model: Person,
					as: 'people',
					through: { attributes: [] },
					attributes: ['id', 'name'],
					include: [
						{
							model: Rule,
							as: 'rule',
							attributes: ['id', 'description']
						}
					]
				},
				{
					model: Person,
					as: 'master',
					attributes: ['id', 'name']	
				},
				{
					model: Person,
					as: 'supervisor',
					attributes: ['id', 'name']	
				}
			]
		})

		return res.json(response)
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await Team.scope(scope as string || 'full').findByPk(req.params.id)

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
			const { workers, supervisor } = req.body as CreateUpdateItemProps

			await connection.transaction(async transaction => {
				const { id: teamId } = await Team.create({ 
					supervisor_id: supervisor
				}, { transaction })

				await TeamPerson.bulkCreate(workers.map(item => ({
					person_id: item.worker_id,
					team_id: teamId
				})), { transaction })
			})

			return res.sendStatus(HTTPStatusCodes.CREATED)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { workers, supervisor } = req.body as CreateUpdateItemProps

			const people = workers

			await connection.transaction(async transaction => {
				const team = await Team.scope('full').findByPk(req.params.id, { transaction })

				if(!team) {
					throw new errors.NOT_FOUND
				}

				await TeamPerson.destroy({
					where: {
						team_id: team.id
					},
					transaction
				})

				await TeamPerson.bulkCreate(people.map(item => ({
					person_id: item.worker_id,
					team_id: team.id
				})), { transaction })

				await Team.update({
					supervisor_id: supervisor
				}, {
					where: {
						id: team.id
					},
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
			const item = await Team.scope('full').findByPk(req.params.id)

			if(!item) {
				throw new errors.NOT_FOUND
			}

			await Team.destroy({
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

export const teamController = new TeamController()