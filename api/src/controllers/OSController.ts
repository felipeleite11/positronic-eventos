import { Request, Response } from 'express'
import { Op, WhereOptions } from 'sequelize'
import { addDays, endOfDay, isSameDay, startOfDay, subDays } from 'date-fns'

import { OS } from '../models/OS'
import connection from '../models/_connection'
import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'
import { Address } from '../models/Address'
import { Contract } from '../models/Contract'
import { OSService } from '../models/OSService'
import { File } from '../models/File'
import { OSFile } from '../models/OSFile'
import { ProfilesIds } from '../models/Profile'
import { ServiceQuote } from '../models/ServiceQuote'
import { OSUsedResource } from '../models/OSUsedResource'
import { OSExecutionTempData } from '../models/OSExecutionTempData'
import { OSStatusIds } from '../models/OSStatus'
import { OSExtraService } from '../models/OSExtraService'
import { OSAttributeValue } from '../models/OSAttributeValue'
import { OSAttribute } from '../models/OSAttribute'
import '../utils/number'
import { PreferenceIds, UserPreference } from '../models/UserPreference'
import { UsedResourceValue } from '../models/UsedResourceValue'
import { User } from '../models/User'
import { dateFrom, getDurationBetweenTimes } from '../utils/date'
import { WorkerLot } from '../models/WorkerLot'
import { Unit } from '../models/Unit'

interface FinishProps {
	services: {
		id: number
		os_service: {
			id: number
			requested_quantity: number
			executed_quantity: string
			start: string
			end: string
		}
	}[]
	used_resources: {
		id: number
		resource: string
		quantity: string
		unit: number
	}[]
	extra_services: {
		id: number
		executed_quantity: string
	}[]
	report: string
	final_opinion: string
	observation_no_execution: string
	attributes: {
		attribute: {
			id: number
		}
		value: string | number
	}[]
}

type OSDateFields = 'created_at' | 'execution_start' | 'execution_end' | 'finished_at'

class OSController {
	async index(req: Request, res: Response) {
		try {
			const { scope: scopeQuery, order, limit, offset, contract, lot, os_number } = req.query
			const scope = scopeQuery ? String(scopeQuery) : 'full'
			const isArchived = scope === 'archived'
			const isMaster = [ProfilesIds.ADMIN, ProfilesIds.MASTER].includes(req.profile_id as ProfilesIds)

			let oss: OS[]
			let totalItems: number

			const where: WhereOptions = {}

			if (os_number) {
				where.contractor_os_number = os_number

				if(!isMaster) {
					const workerLots = await WorkerLot.findAll({
						where: {
							worker_id: req.person_id
						}
					})
	
					where.lot_id = workerLots.map(item => item.lot_id)
				}
			} else if (lot) {
				where.lot_id = Number(lot)
			}

			if (contract) {
				where.contract_id = Number(contract)
			}

			if (isArchived) {
				where.deleted_at = {
					[Op.not]: null
				}
			}
			
			if ([ProfilesIds.MASTER, ProfilesIds.ASSIGNER].includes(req.profile_id as ProfilesIds)) {
				oss = await OS.scope(scope).findAll({
					order: order ? [order as string[2]] : [['id', 'desc']],
					paranoid: !isArchived,
					where,
					limit: limit ? Number(limit) : undefined,
					offset: offset ? Number(offset) : undefined
				})

				totalItems = await OS.count({
					paranoid: !isArchived,
					where
				})
			} else {
				oss = await OS.scope(scope).findAll({
					order: order ? [order as string[2]] : [['id', 'desc']],
					where: {
						[Op.and]: {
							[Op.or]: {
								supervisor_id: Number(req.person_id),
								creator_id: Number(req.person_id)
							},
							...where
						}
					},
					paranoid: !isArchived,
					limit: limit ? Number(limit) : undefined,
					offset: offset ? Number(offset) : undefined
				})

				totalItems = await OS.count({
					where: {
						[Op.and]: {
							[Op.or]: {
								supervisor_id: Number(req.person_id),
								creator_id: Number(req.person_id)
							},
							...where
						}
					},
					paranoid: !isArchived
				})
			}

			if (['full', 'archived'].includes(scope)) {
				for (const os of oss) {
					// @ts-ignore
					os.dataValues.contract = await Contract.scope('basic').findByPk(os.contract_id)
				}
			}

			return res.json({
				data: oss,
				total_items: totalItems
			})
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async show(req: Request, res: Response) {
		try {
			const { scope = '' } = req.query

			const os = await OS.findByPk(req.params.id)

			if(!os) {
				throw new errors.NOT_FOUND('OS não encontrada.')
			}

			let response = await OS.scope(String(scope) || { method: ['byIdAndLot', req.params.id, os.lot_id] }).findByPk(req.params.id, {
				paranoid: scope !== 'archived'
			})

			// @ts-ignore
			response.dataValues.contract = await Contract.scope('basic2').findByPk(response.contract_id)

			return res.json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async create(req: Request, res: Response) {
		try {
			const {
				address,
				requester,
				services,
				contract:
				contractId,
				observation,
				turn,
				start,
				end,
				lot,
				contractor_os_number,
				linked_os,
				requester_registration
			} = req.body

			if (!services.length) {
				throw new errors.INSUFICIENT_DATA('Inclua pelo menos um serviço na OS.')
			}

			const response = await connection.transaction(async transaction => {
				const osSameNumber = await OS.findOne({
					where: {
						contractor_os_number
					},
					transaction
				})

				if (osSameNumber) {
					throw new errors.CONFLICT('Já existe uma OS cadastrada com este número.')
				}

				const contract = await Contract.scope('create_os').findByPk(contractId, { transaction })

				const { id: address_id } = await Address.create(address, { transaction })

				const os = await OS.create({
					requester_id: requester,
					company_requester_id: contract?.contractor.id as number,
					company_executor_id: contract?.target.id,
					contract_id: contractId,
					address_id: address_id,
					creator_id: req.person_id as number,
					priority_id: 1,
					observation,
					turn,
					start,
					end,
					lot_id: lot,
					contractor_os_number,
					linked_os_id: linked_os,
					requester_registration,
					status_id: 1
				}, { transaction })

				await OSService.bulkCreate(services.map((service: any) => ({
					service_id: service.id,
					os_id: os.id,
					requested_quantity: Number(String(service.quantity).replace(",", "."))
				})), { transaction })

				return os
			})

			return res.status(HTTPStatusCodes.CREATED).json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { address, services, ...osData } = req.body
			const { contractor_os_number } = osData

			await connection.transaction(async transaction => {
				const os = await OS.scope('full').findByPk(req.params.id, { transaction })

				if (!os) {
					throw new errors.NOT_FOUND('OS não encontrada.')
				}

				if (!!contractor_os_number && os.contractor_os_number !== contractor_os_number) {
					const osSameNumber = await OS.findOne({
						where: {
							contractor_os_number
						},
						transaction
					})

					if (osSameNumber) {
						throw new errors.CONFLICT('Já existe uma OS cadastrada com este número.')
					}
				}

				if (address) {
					await Address.destroy({
						where: {
							id: os.address.id
						},
						force: true,
						transaction
					})

					const { id: address_id } = await Address.create(address, { transaction })

					osData.address_id = address_id
				}

				if (services) {
					await OSService.destroy({
						where: {
							os_id: Number(req.params.id)
						},
						force: true,
						transaction
					})

					await OSService.bulkCreate(services.map((service: any) => ({
						service_id: service.id,
						os_id: os.id,
						requested_quantity: Number(String(service.quantity).replace(",", "."))
					})), { transaction })
				}

				await OS.update(osData, {
					where: {
						id: Number(req.params.id)
					},
					transaction
				})

			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const item = await OS.scope('full').findByPk(req.params.id)

			if (!item) {
				throw new errors.NOT_FOUND
			}

			await OS.destroy({
				where: {
					id: Number(req.params.id)
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async uploadFile(req: Request, res: Response) {
		try {
			const { os_id, at_moment } = req.body

			await connection.transaction(async transaction => {
				if (!req.file?.fieldname) {
					return res.status(HTTPStatusCodes.BAD_REQUEST).json({ msg: 'Arquivo não enviado.' })
				}

				const file = await File.create({
					link: `${process.env.FILE_STORAGE_BASE_URL}/${(req.file as any).key}`
				}, { transaction })

				await OSFile.create({
					file_id: file.id,
					os_id,
					at_moment
				}, { transaction })
			})

			return res.sendStatus(HTTPStatusCodes.CREATED)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async removeFile(req: Request, res: Response) {
		try {
			const { id } = req.params

			await File.destroy({
				where: { id }
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async start(req: Request, res: Response) {
		try {
			const { id } = req.params

			await OS.update({
				execution_start: new Date(),
				status_id: 2
			}, {
				where: { id }
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async execute(req: Request, res: Response) {
		try {
			const { id } = req.params

			await connection.transaction(async transaction => {
				const os = await OS.scope('full').findByPk(id, { transaction })

				const tempData = await OSExecutionTempData.findOne({
					where: {
						os_id: id
					},
					transaction
				})

				if (!tempData || !os) {
					throw new errors.NOT_FOUND('OS não encontrada.')
				}

				const { finalOpinion, observationNoExecution, report, resources, services, aditional_info } = tempData.data_obj
				let { extra_services = [] } = tempData.data_obj

				extra_services = extra_services.filter(serv => serv.service)

				for (const service of services) {
					await OSService.update({
						executed_quantity: Number(String(service.consumed)?.replace(",", ".")) || 0,
						start: service.start,
						end: service.end
					}, {
						where: {
							service_id: service.id,
							os_id: id
						},
						transaction
					})
				}

				if (extra_services.length) {
					await OSExtraService.bulkCreate(extra_services.map(extra => {
						const { start, end } = extra
						const isPeriod = !!start && !!end

						return {
							executed_quantity: !isPeriod ? 
								Number(String(extra.consumed)?.replace(',', '.')) || 0 :
								Number((extra.consumed as any)?.minutes),
							os_id: Number(id),
							service_id: extra.service,
							start: extra.start,
							end: extra.end
						}
					}), { transaction })
				}

				await OS.update({
					execution_end: new Date(),
					report,
					observation_no_execution: observationNoExecution,
					final_opinion: finalOpinion,
					status_id: 3,
					executor_id: req.person_id
				}, {
					where: { id },
					transaction
				})

				for (const resource of resources) {
					const createdResource = await OSUsedResource.create({
						resource: resource.resource,
						quantity: Number(String(resource.quantity).replace(",", ".")),
						os_id: Number(id),
						unit_id: Number(resource.unit)
					}, { transaction })

					const unitFields = Object.entries(resource).filter(([key]) => key.startsWith('field_'))

					if (unitFields.length) {
						await UsedResourceValue.bulkCreate(unitFields.map(([key, value]) => {
							const id = Number(key.replace('field_', ''))
							const resourceId = createdResource.id

							return {
								value: String(value),
								unit_field_id: id,
								os_used_resource_id: resourceId
							}
						}), { transaction })
					}
				}

				const attributes = await OSAttribute.scope('full').findAll()
				const selectAttributes = attributes.filter(attr => attr.type === 'select')

				if (aditional_info) {
					await OSAttributeValue.bulkCreate(Object.entries(aditional_info)
						.filter(([_, info]) => !!info)
						.map(([key, info]) => {
							const [attrId, fieldId] = String(key).split('_').map(Number)
							const hasFields = attributes.some(attr => attr.id === attrId && attr.fields)
							const isSelectAttr = selectAttributes.some(attr => attr.id === attrId)

							return {
								os_id: Number(id),
								attribute_id: attrId,
								attribute_option_id: isSelectAttr ? Number(info) : undefined,
								attribute_field_id: hasFields ? fieldId : undefined,
								value: !isSelectAttr ? String(info) : undefined
							}
						}), { transaction })
				}

				await OSExecutionTempData.destroy({
					where: {
						os_id: id
					},
					transaction,
					force: true
				})
			})

			return res.sendStatus(HTTPStatusCodes.CREATED)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async finish(req: Request, res: Response) {
		try {
			const osId = Number(req.params.id)

			const { services, extra_services, used_resources, report, final_opinion, observation_no_execution, attributes } = req.body as FinishProps

			await connection.transaction(async transaction => {
				const os = await OS.scope('for_finish').findByPk(osId, { transaction })

				if (!os) {
					throw new errors.NOT_FOUND('O.S. não encontrada.')
				}

				if (os.status_id !== OSStatusIds.EXECUTED) {
					throw new errors.NOT_FOUND('A O.S. deve estar executada para poder efetuar a baixa.')
				}

				await OS.update({
					finished_at: new Date(),
					status_id: 4,
					finisher_id: req.person_id,
					report,
					final_opinion,
					observation_no_execution
				}, {
					where: { id: osId },
					transaction
				})

				// Tratando services

				for (const service of services) {
					const executedQuantity = service.os_service.start && service.os_service.end ? 
						getDurationBetweenTimes(service.os_service.start, service.os_service.end).minutes : 
						service.os_service.executed_quantity.toNumber()

					await OSService.update({
						executed_quantity: executedQuantity,
						start: service.os_service.start,
						end: service.os_service.end
					}, {
						where: {
							id: service.os_service.id
						},
						transaction
					})

					const qt = await ServiceQuote.findOne({
						where: {
							contract_id: os?.contract_id,
							lot_id: os?.lot_id,
							service_id: service.id
						},
						transaction
					})

					await ServiceQuote.update({
						consumed: (qt?.consumed || 0) + service.os_service.executed_quantity.toNumber()
					}, {
						where: {
							contract_id: os?.contract_id,
							lot_id: os?.lot_id,
							service_id: service.id
						},
						transaction
					})
				}

				// Tratando extra services
				
				await OSExtraService.destroy({
					where: {
						os_id: osId
					},
					transaction,
					force: true
				})

				await OSExtraService.bulkCreate(extra_services.map((serv: any) => {
					let quantity

					if(serv.start && serv.end) {
						quantity = getDurationBetweenTimes(serv.start, serv.end).minutes
					} else {
						quantity = serv.executed_quantity.toNumber()
					}

					return {
						os_id: osId,
						service_id: serv.id,
						executed_quantity: quantity,
						start: serv.start,
						end: serv.end
					}
				}), { transaction })

				for (const extraService of extra_services) {
					const qt = await ServiceQuote.findOne({
						where: {
							contract_id: os?.contract_id,
							lot_id: os?.lot_id,
							service_id: extraService.id
						},
						transaction
					})

					await ServiceQuote.update({
						consumed: (qt?.consumed || 0) + (Number(extraService.executed_quantity) || 0)
					}, {
						where: {
							contract_id: os?.contract_id,
							lot_id: os?.lot_id,
							service_id: extraService.id
						},
						transaction
					})
				}

				// Tratando used resources

				const newUsedResources = used_resources.filter(res => !res.id)

				const usedResourcesAddedInExecution = await OSUsedResource.findAll({
					where: {
						os_id: osId
					},
					transaction
				})

				const usedResourcesToRemove = usedResourcesAddedInExecution.filter(res => !used_resources.some(r => r.id === res.id))

				for (const newUsedResource of newUsedResources) {
					let quantity: number

					const unit = await Unit.findByPk(newUsedResource.unit)

					if(unit?.description === 'horas') {
						const timeKeys = Object.keys(newUsedResource).filter(key => key.startsWith('field_'))

						const start = (newUsedResource as any)[timeKeys[0]]
						const end = (newUsedResource as any)[timeKeys[1]]
	
						quantity = getDurationBetweenTimes(start, end).minutes || 0
					} else {
						quantity = newUsedResource.quantity.toNumber()
					}

					const { id } = await OSUsedResource.create({
						resource: newUsedResource.resource,
						quantity,
						unit_id: newUsedResource.unit,
						os_id: osId
					}, { transaction })

					const unitFields = Object.entries(newUsedResource).filter(([key]) => key.startsWith('field_'))

					if (unitFields.length) {
						await UsedResourceValue.bulkCreate(unitFields.map(([key, value]) => {
							const fieldId = Number(key.replace('field_', ''))

							return {
								value: String(value),
								unit_field_id: fieldId,
								os_used_resource_id: id
							}
						}), { transaction })
					}
				}

				await OSUsedResource.destroy({
					where: {
						id: usedResourcesToRemove.map(res => res.id)
					},
					transaction
				})

				// Tratando attributes (aditional info)

				interface AttributeProps {
					attribute: {
						id: number | string
						field_id: number
						is_select?: boolean
					},
					value: string | number
				}

				const osAttributes = await OSAttribute.findAll()

				const newAttributes: AttributeProps[] = attributes.filter(attr =>
					!Number.isNaN(Number(attr.attribute.id)) &&
					!os.attributes.map(a => a.attribute?.id).includes(Number(attr.attribute.id))
				) as AttributeProps[]

				const oldAttributes: AttributeProps[] = attributes.filter(attr =>
					!Number.isNaN(Number(attr.attribute.id)) &&
					os.attributes.map(a => a.attribute?.id).includes(Number(attr.attribute.id))
				) as AttributeProps[]

				let compositeAttrs = attributes.filter(attr => Number.isNaN(Number(attr.attribute.id))) as AttributeProps[]

				compositeAttrs = compositeAttrs.map(attr => {
					const [attrId, fieldId] = String(attr.attribute.id).split('_').map(Number)

					return {
						attribute: {
							id: attrId,
							field_id: fieldId
						},
						value: attr.value
					}
				})

				const oldCompositeAttrs = compositeAttrs.filter(attr => os.attributes.some(a => {
					return a.attribute?.id === attr.attribute.id && a.attribute_field_id === attr.attribute.field_id
				}))

				const newCompositeAttrs = compositeAttrs.filter(attr => !os.attributes.some(a => {
					return a.attribute?.id === attr.attribute.id && a.attribute_field_id === attr.attribute.field_id
				}))

				newAttributes.push(...newCompositeAttrs)
				oldAttributes.push(...oldCompositeAttrs)

				await OSAttributeValue.bulkCreate(newAttributes.map(attr => {
					const isSelect = osAttributes.some(a => a.type === 'select' && a.id === Number(attr.attribute.id))

					return {
						os_id: osId,
						attribute_id: Number(attr.attribute.id),
						attribute_option_id: isSelect ? Number(attr.value) : undefined,
						attribute_field_id: attr.attribute.field_id,
						value: isSelect ? '' : String(attr.value)
					}
				}), { transaction })

				for (const attribute of oldAttributes) {
					const isSelect = osAttributes.some(a => a.type === 'select' && a.id === Number(attribute.attribute.id))

					const where: WhereOptions = {
						attribute_id: attribute.attribute?.id,
						os_id: osId
					}

					if (attribute.attribute.field_id) {
						where.attribute_field_id = attribute.attribute.field_id
					}

					await OSAttributeValue.update({
						value: isSelect ? undefined : String(attribute.value),
						attribute_option_id: isSelect ? Number(attribute.value) : undefined
					}, {
						where,
						transaction
					})
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			console.log(`Erro na baixa da OS ${req.params.id}`, e)

			return prepareErrorResponse(e as Error, res)
		}
	}

	async revert(req: Request, res: Response) {
		try {
			const osId = Number(req.params.id)

			await connection.transaction(async transaction => {
				const os = await OS.scope('full').findByPk(osId, { transaction })

				if (!os) {
					throw new errors.NOT_FOUND('O.S. não encontrada.')
				}

				if (os.status.id !== OSStatusIds.FINISHED) {
					throw new errors.NOT_FOUND('A O.S. edeve estar finalizada (baixada) para poder revertê-la.')
				}

				await OS.update({
					status_id: 3,
					finished_at: null,
					finisher_id: undefined,
				}, {
					where: { id: osId },
					transaction
				})

				for (const service of os.services) {
					const qt = await ServiceQuote.findOne({
						where: {
							contract_id: os?.contract_id,
							lot_id: os?.lot.id,
							service_id: service.id
						},
						transaction
					})

					await ServiceQuote.update({
						consumed: (qt?.consumed || 0) - Number(service.os_service.dataValues.executed_quantity || 0)
					}, {
						where: {
							contract_id: os?.contract_id,
							lot_id: os?.lot.id,
							service_id: service.id
						},
						transaction
					})
				}

				for (const extraService of os.extra_services) {
					const qt = await ServiceQuote.findOne({
						where: {
							contract_id: os?.contract_id,
							lot_id: os?.lot.id,
							service_id: extraService.id
						},
						transaction
					})

					await ServiceQuote.update({
						consumed: (qt?.consumed || 0) - Number(extraService.os_extra_service.executed_quantity || 0)
					}, {
						where: {
							contract_id: os?.contract_id,
							lot_id: os?.lot.id,
							service_id: extraService.id
						},
						transaction
					})
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async recover(req: Request, res: Response) {
		try {
			const { id } = req.params

			await OS.restore({
				where: { id }
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async checkNumberAvailability(req: Request, res: Response) {
		try {
			const { number } = req.params

			const os = await OS.findOne({
				where: { contractor_os_number: number }
			})

			return res.json({ found: !!os })
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async loadOSFiles(req: Request, res: Response) {
		try {
			const { id } = req.params

			const os = await OS.findByPk(id, {
				attributes: ['id'],
				include: [
					{
						model: File,
						as: 'files',
						through: { attributes: ['at_moment'] },
						attributes: ['id', 'link']
					}
				]
			})

			if (!os) {
				throw new errors.NOT_FOUND('OS não encontrada.')
			}

			return res.json(os.files)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async filter(req: Request, res: Response) {
		try {
			const { filters, items_by_page, page } = req.query as any

			const pageStartIndex = page * Number(items_by_page)
			const pageEndIndex = Number(items_by_page)

			let where: any = {}

			for (const filter of filters) {
				if (filter.attribute === 'os') {
					where.contractor_os_number = {
						[Op.like]: `${filter.value}%`
					}
				}

				if (filter.attribute === 'status') {
					where.status_id = filter.value
				}

				if(filter.attribute === 'open_at') {
					try {
						const startDate = dateFrom(filter.value)

						if(startDate) {
							const endDate = dateFrom(filter.value, { forceEndOfDay: true })

							where.created_at = {
								[Op.between]: [
									startDate, 
									endDate
								]
							}
						}
					} catch(e) {}
				}

				if (filter.attribute === 'place') {
					where[Op.or] = [
						{
							['$address.city$']: {
								[Op.like]: `%${filter.value}%`
							}
						},
						{
							['$address.state$']: {
								[Op.like]: `%${filter.value}%`
							}
						},
						{
							['$address.district$']: {
								[Op.like]: `%${filter.value}%`
							}
						},
						{
							['$address.street$']: {
								[Op.like]: `%${filter.value}%`
							}
						},
						{
							['$address.number$']: {
								[Op.like]: `%${filter.value}%`
							}
						},
						{
							['$address.zipcode$']: {
								[Op.like]: `%${filter.value}%`
							}
						}
					]
				}

				if (filter.attribute === 'supervisor') {
					if ('não atribuído'.contains(filter.value)) {
						where.supervisor_id = null
					} else {
						const supervisors = await User.scope('profile').findAll({
							where: {
								profile_id: ProfilesIds.EXECUTOR,
								'$person.name$': {
									[Op.like]: `%${filter.value}%`
								}
							}
						})

						where.supervisor_id = supervisors.map(user => user.person.id)
					}
				}

				if (filter.attribute === 'lot' && filter.value?.length) {
					where.lot_id = filter.value
				}
			}

			let response: OS[]

			let restrictions: any = {
				where: {
					[Op.and]: where
				},
				order: [['id', 'desc']]
			}

			if (![ProfilesIds.MASTER, ProfilesIds.ASSIGNER].includes(req.profile_id as ProfilesIds)) {
				restrictions.where[Op.and][Op.or] = {
					supervisor_id: Number(req.person_id),
					creator_id: Number(req.person_id)
				}
			}

			const allOSs = await OS.scope('for_list').findAll(restrictions)

			response = allOSs.slice(pageStartIndex, pageStartIndex + pageEndIndex)

			const contractFilter = filters.find((filter: any) => filter.attribute === 'contract')

			if (contractFilter) {
				const contracts = await Contract.findAll({
					where: {
						number: {
							[Op.like]: `${contractFilter.value}%`
						}
					}
				})

				if (!contracts.length) {
					return res.json({
						data: [],
						total_items: 0
					})
				}

				const contractsIds = contracts.map(c => c.id)

				response = response.filter(os => contractsIds.includes(os.contract_id))
			}

			return res.json({
				data: response,
				total_items: allOSs.length
			})
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async countByStatus(req: Request, res: Response) {
		try {
			const response = {
				'1': 0,
				'2': 0,
				'3': 0,
				'4': 0
			}

			type StatusIds = keyof typeof response

			let restrictions: any = {
				where: {
					[Op.and]: []
				}
			}

			if (![ProfilesIds.MASTER, ProfilesIds.ASSIGNER].includes(req.profile_id as ProfilesIds)) {
				restrictions.where[Op.and].push({
					[Op.or]: {
						supervisor_id: Number(req.person_id),
						creator_id: Number(req.person_id)
					}
				})
			}

			const filterByLotPreference = await UserPreference.findOne({
				where: {
					preference_id: PreferenceIds.FILTER_BY_LOT_IN_OS_LIST,
					user_id: req.user_id
				}
			})

			if (filterByLotPreference) {
				const lotsIds = JSON.parse(filterByLotPreference.value)

				if (lotsIds.length) {
					restrictions.where[Op.and].push({
						lot_id: lotsIds
					})
				} else {
					const workerLots = await WorkerLot.findAll({
						where: {
							worker_id: req.person_id
						}
					})

					const lotsIds = workerLots.map(item => item.lot_id)

					if(lotsIds.length) {
						restrictions.where[Op.and].push({
							lot_id: lotsIds
						})
					}
				}
			}

			const count = await OS.count({
				...restrictions,
				group: ['status_id']
			})

			for (const status of Object.keys(response) as StatusIds[]) {
				response[status] = count.find(item => item.status_id === Number(status))?.count || 0
			}

			return res.json(response)
		} catch (e) {
			console.log(e)
			
			return prepareErrorResponse(e as Error, res)
		}
	}

	async countByDate(req: Request, res: Response) {
		try {
			const { status } = req.query

			if(!status) {
				throw new errors.INSUFICIENT_DATA('O status é obrigatório.')
			}

			const endPeriod = endOfDay(new Date())
			const startPeriod = startOfDay(subDays(endPeriod, 6))
			let dateReference: OSDateFields

			switch(status) {
				case '1': 
					dateReference = 'created_at'
					break
				case '2': 
					dateReference = 'execution_start'
					break
				case '3': 
					dateReference = 'execution_end'
					break
				case '4': 
					dateReference = 'finished_at'
					break
				default: throw new errors.INVALID_DATA('Status inválido.')
			}

			const where: WhereOptions = {
				[dateReference]: {
					[Op.between]: [
						startPeriod,
						endPeriod
					]
				}
			}

			if(status) {
				where.status_id = status
			}

			const ossLastWeek = await OS.findAll({
				where
			})

			const response: any[] = []

			for(let date = startPeriod; date <= endPeriod; date = addDays(date, 1)) {
				const osOfDay = ossLastWeek.filter(os => isSameDay(os[dateReference] as Date, date))

				response.push({
					quantity: osOfDay.length,
					date
				})
			}

			return res.json(response)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async countByCity(req: Request, res: Response) {
		try {
			const oss = await OS.findAll({
				attributes: [
					'address.city',
					[connection.literal('address.city'), 'city'],
					[connection.fn('COUNT', connection.col('OS.id')), 'quantity']
				],
				include: [
					{
						model: Address,
						as: 'address',
						attributes: {
							exclude: ['created_at', 'updated_at', 'deleted_at']
						}
					}
				],
				group: ['address.city']
			})

			return res.json((oss as any[]).map(os => ({
				city: os.dataValues.city,
				quantity: os.dataValues.quantity
			})))
		} catch(e) {
			console.log(e)

			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const osController = new OSController()