import { Request, Response } from 'express'

import connection from '../models/_connection'

import { prepareErrorResponse } from '../utils/express-response-prepare'
import { ContractLot } from '../models/ContractLot'
import { errors } from '../utils/errors'
import { OS } from '../models/OS'
import { WhereOptions } from 'sequelize'
import { Contract } from '../models/Contract'
import { ContractServiceLoad } from '../models/ContractServiceLoad'
import { ServiceQuote } from '../models/ServiceQuote'
import { Log } from '../models/Log'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { WorkerLot } from '../models/WorkerLot'

export const timeUnitRepresentations = ['h', 'hr']

class LotController {
	async index(req: Request, res: Response) {
		try {
			const { scope = 'full', contract_id, worker } = req.query

			const where: WhereOptions = {}

			if(contract_id) {
				where.contract_id = contract_id
			}

			if(worker) {
				const workerLots = await WorkerLot.findAll({
					where: {
						worker_id: Number(worker)
					}
				})

				where.id = workerLots.map(item => item.lot_id)
			}

			const lots = await ContractLot.scope(scope as string).findAll({
				where
			})

			const contracts = await Contract.findAll({
				where: {
					id: lots.map(lot => lot.contract_id)
				}
			})

			for(const lot of lots) {
				const { id, number } = contracts.find(contract => contract.id === lot.contract_id) as Contract

				(lot.dataValues as any).contract = {
					id, 
					number
				}
			}

			return res.json(lots)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async create(req: Request, res: Response) {
		try {
			const { contract_id, description, sequential, year } = req.body

			const alreadyStored = await ContractLot.findOne({
				where: {
					contract_id,
					sequential,
					year
				}
			})

			const sameNameLot = await ContractLot.findOne({
				where: {
					description
				}
			})

			if(alreadyStored?.description === description) {
				return res.json(alreadyStored)
			}

			if(sameNameLot) {
				throw new errors.CONFLICT('Já existe um lote com este nome.')
			}

			if(alreadyStored) {
				await ContractLot.update({
					description
				}, {
					where: {
						id: alreadyStored.id
					}
				})

				return res.json(alreadyStored)
			}

			const response = await ContractLot.create({
				contract_id,
				description,
				sequential,
				year
			})

			return res.json(response)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async checkDelete(req: Request, res: Response) {
		try {
			const { lot_id } = req.params

			const count = await OS.count({
				where: {
					lot_id
				}
			})

			if(count) {
				throw new errors.NOT_ALLOWED(`Não é possível remover este lote, pois ele está vinculado a ${count} OSs.`)
			}

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params
			const { quotes, contract_id, load_id, log_id } = req.body

			await connection.transaction(async transaction => {
				const lot = await ContractLot.scope('full').findByPk(id, { transaction })
				
				if(!lot) {
					throw new errors.NOT_FOUND('Lote não encontrado.')
				}

				if(quotes.length) {
					await ContractServiceLoad.update({
						user_id: req.user_id
					}, {
						where: {
							id: load_id
						},
						transaction
					})
				}

				const ossWithServices = await OS.scope('with_services').findAll({
					where: {
						lot_id: id
					},
					transaction
				})

				const currentQuotes = lot.quotes as ServiceQuote[]
				const newQuotes = quotes.filter((quote: any) => currentQuotes.every(q => q.id !== quote.id))
				const quotesToRemove = currentQuotes.filter(quote => 
					!quotes.some((qt: any) => qt.id === quote.id) &&
					!ossWithServices.some(os => {
						return os.services.some(service => service.id === Number(quote.service.id)) ||
							os.extra_services.some(service => service.id === Number(quote.service.id))
					}))
				const neverUsed = currentQuotes.filter(quote => Number(quote.consumed) === 0)
				const used = currentQuotes.filter(quote => quote.consumed > 0)
				const usedToRemove = currentQuotes.filter(quote => quote.consumed > 0 && lot.quotes.every((q: any) => q.id !== quote.id))

				if (usedToRemove.length) {
					throw new errors.RESTRICTION('Não é possível excluir serviços já utilizados.')
				}

				for (const quote of [...neverUsed, ...used]) {
					const qt = quotes.find((q: any) => q.id === quote.id)

					if (qt) {
						let { id, amount, price_by_unit, warn_value, unit } = qt

						if(timeUnitRepresentations.includes(unit.toLowerCase())) {
							unit = 'horas'
						}

						if(unit.toLowerCase() === 'h2') {
							unit = 'horas de serviço'
						}

						await ServiceQuote.update({
							amount,
							price_by_unit: String(String(price_by_unit).toNumber()),
							unit,
							warn_value: warn_value ? Number(String(warn_value).replace('%', '')) : undefined
						}, {
							where: { id },
							transaction
						})
					} else {
						await ServiceQuote.destroy({
							where: { id: quote.id },
							transaction
						})
					}
				}

				await ServiceQuote.destroy({
					where: {
						id: quotesToRemove.map(i => i.id)
					},
					transaction
				})

				await ServiceQuote.bulkCreate((newQuotes as any[]).map(quote => {
					quote.warn_value = quote.warn_value.replace(',', '.').replace('%', '')

					if(timeUnitRepresentations.includes(quote.unit.toLowerCase())) {
						quote.unit = 'horas'
					}

					if(quote.unit.toLowerCase() === 'h2') {
						quote.unit = 'horas de serviço'
					}

					return {
						consumed: 0,
						amount: quote.amount,
						contract_id,
						unit: quote.unit,
						price_by_unit: quote.price_by_unit.toNumber(),
						service_id: quote.service,
						warn_value: quote.warn_value ? Number(quote.warn_value.replace('%', '')) : undefined,
						lot_id: Number(id)
					}
				}), { transaction })

				await Log.update({
					details: JSON.stringify({
						contract_id,
						lot_id: Number(id)
					})
				}, {
					where: {
						id: log_id
					},
					transaction
				})

				await Log.create({
					type_id: 2,
					person_id: Number(req.person_id),
					details: JSON.stringify({
						contract_id,
						lot_id: Number(id)
					})
				}, { transaction })
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			console.log(e)
			
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params

			await connection.transaction(async transaction => {
				await ServiceQuote.destroy({
					where: {
						lot_id: id
					},
					transaction
				})
	
				await ContractLot.destroy({
					where: { id },
					transaction
				})
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const lotController = new LotController()