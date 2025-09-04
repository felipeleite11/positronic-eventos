import { Request, Response } from 'express'
import { Op, WhereOptions } from 'sequelize'
import { addHours } from 'date-fns'
import { resolve, ResultNodeNumber } from "equation-resolver"
import { parse } from "equation-parser"

import connection from '../models/_connection'
import { Contract } from '../models/Contract'
import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { dateFrom, roundDuration } from '../utils/date'
import { unmaskCurrency } from '../utils/string'
import { readSheet } from '../utils/sheet'
import { hasSameValues } from '../utils/array'
import { ServiceCategory } from '../models/ServiceCategory'
import { Service } from '../models/Service'
import { Log, logTypes } from '../models/Log'
import { ContractServiceLoad } from '../models/ContractServiceLoad'
import { WorkerLot } from '../models/WorkerLot'
import { ProfilesIds } from '../models/Profile'
import { timeUnitRepresentations } from './LotController'

interface ServicesSheetData {
	'ITEM': string
	'DESCRIÇÃO': string
	'UNIDADE': string
	'QUANTIDADE': string
	'PREÇO UNITÁRIO': string
	'PREÇO TOTAL': string
}

function getSegmentsOfServiceCode(code: string | number) {
	return !!code ? String(code).split('.') : []
}

class ContractController {
	async index(req: Request, res: Response) {
		try {
			const { scope, situation = 'all' } = req.query

			let where: WhereOptions = {}

			switch (situation) {
				case 'finished':
					where = {
						end: {
							[Op.lt]: new Date()
						}
					}
					break

				case 'in_progress':
					where = {
						end: {
							[Op.gte]: new Date()
						}
					}
					break

				case 'not_started':
					where = {
						start: {
							[Op.gt]: new Date()
						}
					}
					break
			}

			if (req.profile_id === ProfilesIds.ASSIGNER) {
				const availableLots = await WorkerLot.findAll({
					where: {
						worker_id: req.person_id
					}
				})

				const availableLotsIds = availableLots.map(lot => lot.lot_id)

				where['$lots.id$'] = availableLotsIds
			}

			const response = await Contract.scope(scope as string || 'full').findAll({
				where
			})

			for (const contract of response) {
				// @ts-ignore
				contract.dataValues.lots_length = contract.lots?.length
			}

			return res.json(response)
		} catch (e) {
			console.log(e)

			return prepareErrorResponse(e as Error, res)
		}
	}

	async show(req: Request, res: Response) {
		try {
			const { scope } = req.query

			const response = await Contract.scope(scope as string || 'full').findByPk(req.params.id)

			if (!response) {
				throw new errors.NOT_FOUND
			}

			let totalValueOfContract = 0

			for (const lot of response.lots) {
				// @ts-ignore
				lot.dataValues.last_log = await Log.scope('full').findOne({
					where: {
						type_id: logTypes.SERVICES_LOAD,
						details: {
							[Op.like]: `%"lot_id":${lot.id}}%`
						}
					},
					order: [['updated_at', 'DESC']]
				})

				if (['/contracts.[details].contract', '/contracts.[update].contract'].includes(scope as string)) {
					const totalOfLot = lot.quotes?.reduce((result, quote) => {
						if (quote.formula) {
							const variables = {
								'$quantidade contratada$': quote.amount.toNumber(),
								'$valor unitario$': quote.price_by_unit,
								'$duracao do contrato em meses$': roundDuration({ days: response.duration_in_days }).months
							}

							let formula = quote.formula

							for (const variable of Object.keys(variables)) {
								if (formula.includes(variable)) {
									formula = formula.replaceAll(variable, (variables as any)[variable])
								}
							}

							const calculated = resolve(parse(formula))

							if ((calculated as ResultNodeNumber).value !== undefined) {
								return result + (calculated as ResultNodeNumber).value
							} else {
								throw new errors.INVALID_DATA('A fórmula utilizada é inválida.')
							}
						}

						return result + (quote as any).dataValues.total || 0
					}, 0) || 0

					// @ts-ignore
					lot.dataValues.total = totalOfLot

					// @ts-ignore
					lot.dataValues.quotes_length = lot.quotes.length

					// @ts-ignore
					lot.dataValues.quotes = []

					totalValueOfContract += totalOfLot
				}
			}

			response.dataValues.total_value = Number(response.dataValues.total_value)
			response.dataValues.total_lots_sum = totalValueOfContract

			return res.json(response)
		} catch (e) {
			console.log(e)
			return prepareErrorResponse(e as Error, res)
		}
	}

	async create(req: Request, res: Response) {
		try {
			const { start, end, contractor, target, sign_date, invoicing_day, measurement_start, object, total_value, state, city, number, term_number } = req.body

			const response = await connection.transaction(async transaction => {
				const contract = await Contract.create({
					company_contractor_id: contractor,
					company_target_id: target,
					start: addHours(dateFrom(start) as Date, 3),
					end: addHours(dateFrom(end, { forceEndOfDay: true }) as Date, 3),
					measurement_start: addHours(dateFrom(measurement_start) as Date, 3),
					sign_date: addHours(dateFrom(sign_date) as Date, 3),
					invoicing_day,
					total_value: unmaskCurrency(total_value),
					object,
					state,
					city,
					number,
					term_number: term_number || null,

					// TODO: Valor amarrado!
					measurement_day: 30
				}, { transaction })

				await Log.create({
					type_id: 3,
					person_id: Number(req.person_id),
					details: JSON.stringify({
						contract_id: contract.id
					})
				}, { transaction })

				return contract
			})

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)
			const { start, end, sign_date, invoicing_day, measurement_start, object, total_value, state, city, number, term_number } = req.body

			await connection.transaction(async transaction => {
				const contract = await Contract.scope('edit').findByPk(id, { transaction })

				if (!contract) {
					throw new errors.NOT_FOUND
				}

				await Contract.update({
					start: addHours(dateFrom(start) as Date, 3),
					end: addHours(dateFrom(end, { forceEndOfDay: true }) as Date, 3),
					measurement_start: addHours(dateFrom(measurement_start) as Date, 3),
					sign_date: addHours(dateFrom(sign_date) as Date, 3),
					invoicing_day,
					total_value: unmaskCurrency(total_value),
					object,
					state,
					city,
					number,
					term_number: term_number || null,

					// TODO: Valor amarrado!
					measurement_day: 30
				}, {
					where: { id },
					transaction
				})

				await Log.create({
					type_id: 2,
					person_id: Number(req.person_id),
					details: JSON.stringify({
						contract_id: id
					})
				}, { transaction })
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const item = await Contract.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await Contract.destroy({
				where: {
					id: Number(req.params.id)
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async loadServicesSheet(req: Request, res: Response) {
		const serviceColumns = [
			'ITEM',
			'DESCRIÇÃO',
			'UNIDADE',
			'QUANTIDADE',
			'PREÇO UNITÁRIO',
			'PREÇO TOTAL'
		]
		let loadSheetTitles: any
		const { contract, lot } = req.body

		try {
			if (!req.file?.fieldname) {
				throw new errors.NOT_FOUND('Arquivo não enviado.')
			}

			const response: any[] = []

			const url = `${process.env.FILE_STORAGE_BASE_URL}/${(req.file as any).key}`

			const data = await readSheet<ServicesSheetData>(url, {})

			const { logId, contractServiceLoadId } = await connection.transaction(async transaction => {
				loadSheetTitles = data.map(Object.values).find(item => hasSameValues(serviceColumns, item, {
					ignoreAccentuation: true,
					ignoreCase: true,
					strictOrder: true
				}))

				const headerPosition = data.map(Object.values).findIndex(item => hasSameValues(serviceColumns, item, {
					ignoreAccentuation: true,
					ignoreCase: true,
					strictOrder: true
				}))

				if (headerPosition < 0) {
					throw new Error('Planilha em formato incompatível. A ordem dos títulos está incorreta ou algum título está incorreto.')
				}

				const normalized = data.map(Object.values).slice(headerPosition)

				const sheetColumns = normalized[0]

				if (!hasSameValues(sheetColumns, serviceColumns, { ignoreAccentuation: true, ignoreCase: true, strictOrder: true })) {
					throw new Error('Planilha em formato incompatível.')
				}

				let currentCategory: ServiceCategory | undefined
				let categorySegments: string[] = []
				let segments: string[] = []

				for (let i = 0; i < normalized.slice(1).length; i++) {
					let item = normalized[i]
					const nextItem = normalized[i + 1]

					const isToIgnore = String(item[0]).startsWith('ITEM')
					const isTotal = String(item[0]).startsWith('TOTAL') || String(item[0]).startsWith('CUSTO')
					const isServiceWithNoQuantity = item.length === 5

					if (isToIgnore) {
						continue
					}

					if (isTotal) {
						if (getSegmentsOfServiceCode(nextItem[0]).length === categorySegments.length) {
							currentCategory = currentCategory?.parent
						}

						continue
					}

					segments = getSegmentsOfServiceCode(item[0])

					if (isServiceWithNoQuantity) {
						item = [
							item[0],
							item[1],
							item[2],
							0,
							item[3],
							item[4]
						]
					}

					const isCategory = item.length < 5

					if (isCategory) {
						if (!segments.length) {
							continue
						}

						const previousCategory = await ServiceCategory.findByPk(currentCategory?.id, { transaction })

						if (segments.length > 1 && !previousCategory) {
							throw new Error('Erro na criação das categorias de serviço.')
						}

						const existingCategory = await ServiceCategory.scope('full').findOne({
							where: {
								description: item[1],
								code: item[0]
							},
							transaction
						})

						if (!existingCategory) {
							const { id } = await ServiceCategory.create({
								description: item[1],
								parent_id: segments.length === 1 ? null : previousCategory?.id,
								code: item[0]
							}, { transaction })

							currentCategory = await ServiceCategory.scope('full').findByPk(id, { transaction }) as ServiceCategory
						} else {
							currentCategory = existingCategory
						}

						categorySegments = getSegmentsOfServiceCode(item[0])
					} else { // TRATA-SE DE UM SERVIÇO
						if (!currentCategory) {
							throw new Error('A categoria do serviço não foi encontrada.')
						}

						if(timeUnitRepresentations.includes(item[2].toLowerCase())) {
							item[2] = 'h'
						}

						const existingService = await Service.findOne({
							where: {
								description: item[1],
								category_id: Number(currentCategory?.id),
								code: item[0]
							},
							transaction
						})

						if (!existingService) {
							const { id } = await Service.create({
								code: item[0],
								description: String(item[1]),
								category_id: Number(currentCategory?.id),
								font_id: 1
							}, { transaction })

							response.push([
								id,
								...item,
								currentCategory
							])
						} else {
							response.push([
								existingService.id,
								...item,
								currentCategory
							])
						}
					}
				}

				const { id: contractServiceLoadId } = await ContractServiceLoad.create({
					link: url,
					user_id: req.user_id as number,
					contract_id: contract,
					lot_id: lot
				}, { transaction })

				const { id: logId } = await Log.create({
					type_id: 1,
					person_id: Number(req.person_id)
				}, { transaction })

				return { logId, contractServiceLoadId }
			})

			return res.json({
				data: response,
				log_id: logId,
				contract_service_load_id: contractServiceLoadId
			})
		} catch (e) {
			console.log(e)

			if ((e as any).code === new errors.ARRAY().code) {
				return prepareErrorResponse(new Error(`
					Os títulos das colunas na planilha devem estar na seguinte sequência: <b>${serviceColumns.join(', ')}</b>.<br/><br/>
					${loadSheetTitles ? `Sua planilha apresenta a seguinte ordem: <b>${loadSheetTitles.join(', ')}</b>.<br/><br/>` : ''}
				`), res)
			}

			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const contractController = new ContractController()