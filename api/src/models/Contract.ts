import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { Person } from './Person'
import { Service } from './Service'
import { currency } from '../utils/mask'
import { ContractLot } from './ContractLot'
import { Document } from './Document'
import { DocumentType, DocumentTypes } from './DocumentType'
import { ServiceQuote } from './ServiceQuote'
import { File } from './File'
import { ServiceCategory } from './ServiceCategory'
import { OS } from './OS'
import { Log } from './Log'
import { ContractServiceLoad } from './ContractServiceLoad'
import { User } from './User'
import { OSStatus } from './OSStatus'
import { OSAttributeValue } from './OSAttributeValue'
import { differenceInDays } from 'date-fns'
import { OSExtraService } from './OSExtraService'

class Contract extends Model<InferAttributes<Contract>, InferCreationAttributes<Contract>> {
	declare id: CreationOptional<number>
	declare company_contractor_id: number
	declare company_target_id: number
	declare start: Date
	declare end: Date
	declare sign_date: Date
	declare measurement_start: Date
	declare measurement_day?: number
	declare measurement_days?: number
	declare invoicing_day: number
	declare total_value: number
	declare object: string
	declare state: string
	declare city: string
	declare number: string
	declare term_number: number
	declare total_lots_sum?: number

	declare lots_length?: NonAttribute<number>
	declare contractor: NonAttribute<Person>
	declare target: NonAttribute<Person>
	declare lots: NonAttribute<ContractLot[]>
	declare oss: NonAttribute<OS[]>
	declare logs: NonAttribute<Log[]>

	get formatted_total_value(): NonAttribute<string> {
		return currency(this.total_value)
	}

	get duration_in_days(): NonAttribute<number> {
		return differenceInDays(this.end, this.start)
	}
}

Contract.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	company_contractor_id: DataTypes.INTEGER,
	company_target_id: DataTypes.INTEGER,
	start: DataTypes.DATE,
	end: DataTypes.DATE,
	sign_date: DataTypes.DATE,
	measurement_start: DataTypes.DATE,
	measurement_day: DataTypes.INTEGER,
	measurement_days: DataTypes.INTEGER,
	invoicing_day: DataTypes.INTEGER,
	total_value: DataTypes.DECIMAL(10, 2),
	object: DataTypes.STRING,
	state: DataTypes.STRING,
	city: DataTypes.STRING,
	number: DataTypes.STRING,
	term_number: DataTypes.INTEGER
}, {
	sequelize,

	tableName: 'contract',

	paranoid: true,

	hooks: {
		afterFind(data: any) {
			if (!data) {
				return
			}

			if (Array.isArray(data)) {
				for (const contract of data) {
					contract.dataValues.formatted_total_value = contract.formatted_total_value
					contract.dataValues.duration_in_days = contract.duration_in_days

					if (contract.lots) {
						for (const lot of contract.lots) {
							if (lot.quotes) {
								for (const quote of lot.quotes) {
									quote.dataValues.amount = quote.dataValues.amount
									quote.dataValues.consumed = Number(quote.dataValues.consumed)
									quote.dataValues.consumed_percent = quote.consumed_percent
								}
							}
						}
					}
				}
			} else {
				data.dataValues.formatted_total_value = data.formatted_total_value
				data.dataValues.duration_in_days = data.duration_in_days

				if (data.lots) {
					for (const lot of data.lots) {
						if (lot.quotes) {
							for (const quote of lot.quotes) {
								quote.dataValues.amount = quote.dataValues.amount
								quote.dataValues.consumed = Number(quote.dataValues.consumed)
								quote.dataValues.consumed_percent = quote.consumed_percent
							}
						}
					}
				}
			}
		}
	},

	scopes: {
		basic: {
			attributes: ['id', 'number', 'start', 'end', 'total_value', 'term_number'],
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name']
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'sequential', 'year', 'description']
				}
			]
		},

		basic2: {
			attributes: ['id', 'number', 'start', 'end', 'total_value', 'term_number'],
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name'],
				}
			]
		},

		create_os: {
			attributes: ['id'],
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id'],
				},
				{
					model: Person,
					as: 'target',
					attributes: ['id', 'name']
				},
			]
		},

		report_os_by_contract: {
			attributes: ['id', 'number', 'start', 'end', 'term_number'],
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name']
				},
				{
					model: OS,
					as: 'oss',
					attributes: ['id', 'lot_id', 'contract_id', 'contractor_os_number', 'requester_registration', 'observation', 'execution_start', 'execution_end', 'finished_at', 'created_at'],
					include: [
						{
							model: Service,
							as: 'services',
							through: {
								where: { deleted_at: null }, attributes: ['id', 'requested_quantity', 'executed_quantity', 'start', 'end']
							},
							attributes: ['id', 'description', 'code'],
							include: [
								{
									model: ServiceQuote,
									as: 'quotes',
									attributes: ['id', 'contract_id', 'unit', 'lot_id', 'price_by_unit', 'formula']
								}
							]
						},
						{
							model: OSStatus,
							as: 'status',
							attributes: ['id', 'description']
						},
						{
							model: OSExtraService,
							as: 'os_extra_services',
							attributes: ['id', 'service_id', 'executed_quantity', 'start', 'end'],
							include: [
								{
									model: Service,
									as: 'service',
									attributes: ['id', 'description', 'code'],
									include: [
										{
											model: ServiceCategory,
											as: 'category',
											attributes: ['id', 'description', 'code']
										},
										{
											model: ServiceQuote,
											as: 'quotes',
											attributes: ['id', 'contract_id', 'lot_id', 'unit', 'price_by_unit', 'formula'],
											include: [
												{
													model: ContractLot,
													as: 'lot',
													attributes: ['id', 'sequential', 'description', 'year']
												}
											]
										}
									]
								},
							]
						},
						{
							model: Service,
							as: 'extra_services',
							through: {
								where: { deleted_at: null }, attributes: ['id', 'executed_quantity']
							},
							attributes: ['id', 'description', 'code'],
							include: [
								{
									model: ServiceQuote,
									as: 'quotes',
									attributes: ['id', 'contract_id', 'lot_id', 'price_by_unit']
								}
							]
						},
						{
							model: OSAttributeValue,
							as: 'attributes',
							attributes: ['id', 'attribute_option_id', 'value', 'attribute_id']
						},
					]
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'sequential', 'year', 'description']
				}
			],
			order: [
				[{ model: ContractLot, as: 'lots' }, 'sequential', 'asc']
			]
		},

		report_measurement: {
			attributes: ['id', 'number', 'start', 'end', 'state', 'city', 'object', 'total_value', 'sign_date', 'term_number'],
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id', 'identifier'],
							include: [
								{
									model: DocumentType,
									as: 'type',
									attributes: ['id', 'description']
								},
								{
									model: File,
									as: 'file',
									attributes: ['id', 'link'],
									required: false
								}
							]
						}
					]
				},
				{
					model: Person,
					as: 'target',
					attributes: ['id', 'name']
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'sequential', 'description'],
					include: [
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['id', 'amount', 'price_by_unit', 'unit', 'lot_id', 'formula'],
							include: [
								{
									model: Service,
									as: 'service',
									attributes: ['id', 'description', 'code'],
									include: [
										{
											model: ServiceCategory,
											as: 'category',
											attributes: ['id', 'description', 'code']
										}
									]
								}
							]
						}
					]
				},
			],
			order: [
				[{ model: ContractLot, as: 'lots' }, 'sequential', 'asc']
			]
		},

		full: {
			attributes: {
				exclude: ['company_contractor_id', 'company_target_id', 'created_at', 'updated_at', 'deleted_at']
			},
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id', 'identifier'],
							include: [
								{
									model: DocumentType,
									as: 'type',
									attributes: ['id', 'description']
								},
								{
									model: File,
									as: 'file',
									attributes: ['id', 'link'],
									required: false
								}
							]
						}
					]
				},
				{
					model: Person,
					as: 'target',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id', 'identifier'],
							include: [
								{
									model: DocumentType,
									as: 'type',
									attributes: ['id', 'description']
								},
								{
									model: File,
									as: 'file',
									attributes: ['id', 'link'],
									required: false
								}
							]
						}
					]
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'sequential', 'year', 'description']
				},
				{
					model: OS,
					as: 'oss',
					attributes: ['id', 'lot_id', 'contract_id', 'contractor_os_number', 'requester_registration', 'observation', 'execution_start', 'execution_end', 'finished_at', 'created_at'],
					include: [
						{
							model: Service,
							as: 'services',
							through: {
								where: { deleted_at: null }, attributes: ['id', 'requested_quantity', 'executed_quantity']
							},
							attributes: ['id', 'description', 'code']
						},
						{
							model: OSStatus,
							as: 'status',
							attributes: ['id', 'description']
						},
						{
							model: Service,
							as: 'extra_services',
							through: {
								where: { deleted_at: null }, attributes: ['id', 'executed_quantity']
							},
							attributes: ['id', 'description', 'code'],
							include: [
								{
									model: ServiceQuote,
									as: 'quotes',
									attributes: ['id', 'contract_id', 'lot_id', 'price_by_unit']
								}
							]
						},
					]
				}
			],
			order: [
				[{ model: ContractLot, as: 'lots' }, 'sequential', 'asc']
			]
		},

		edit: {
			attributes: {
				exclude: ['company_contractor_id', 'company_target_id', 'created_at', 'updated_at', 'deleted_at', 'term_number']
			},
			include: [
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'sequential', 'year', 'description'],
					include: [
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['id', 'amount', 'price_by_unit', 'warn_value', 'consumed', 'unit'],
							include: [
								{
									model: Service,
									as: 'service',
									attributes: ['id', 'description', 'code'],
									include: [
										{
											model: ServiceCategory,
											as: 'category',
											attributes: ['id', 'description', 'code']
										}
									]
								}
							]
						}
					]
				},
			],
			order: [
				[{ model: ContractLot, as: 'lots' }, 'sequential', 'asc']
			]
		},

		'/contracts.[details].loads': {
			attributes: ['id'],
			include: [
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'description'],
					include: [
						{
							model: ContractServiceLoad,
							as: 'service_loads',
							attributes: ['id', 'link', 'lot_id', 'created_at'],
							include: [
								{
									model: User,
									as: 'user',
									attributes: ['id'],
									include: [
										{
											model: Person,
											as: 'person',
											attributes: ['id', 'name']
										}
									]
								}
							],
							required: false
						}
					],
					required: false
				}
			]
		},

		services_and_quotes_and_os: {
			attributes: {
				exclude: ['updated_at', 'deleted_at']
			},
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name'],
				},
				{
					model: Person,
					as: 'target',
					attributes: ['id', 'name'],
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'sequential', 'year', 'description'],
					include: [
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['id', 'amount', 'price_by_unit', 'consumed', 'unit'],
							include: [
								{
									model: Service,
									as: 'service',
									attributes: ['id', 'description', 'code'],
									include: [
										{
											model: ServiceCategory,
											as: 'category',
											attributes: ['id', 'description', 'code']
										}
									]
								}
							]
						},
						{
							model: OS,
							as: 'oss',
							attributes: ['id', 'finished_at'],
							include: [
								{
									model: Service,
									as: 'services',
									attributes: ['id'],
									through: {
										where: { deleted_at: null },
										attributes: ['executed_quantity']
									}
								},
								{
									model: Service,
									as: 'extra_services',
									attributes: ['id'],
									through: {
										where: { deleted_at: null },
										attributes: ['executed_quantity']
									}
								}
							]
						}
					]
				}
			]
		},

		services_and_quotes: {
			attributes: {
				exclude: ['updated_at', 'deleted_at']
			},
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name'],
				},
				{
					model: Person,
					as: 'target',
					attributes: ['id', 'name'],
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'sequential', 'year', 'description'],
					include: [
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['id', 'amount', 'price_by_unit', 'consumed', 'unit'],
							include: [
								{
									model: Service,
									as: 'service',
									attributes: ['id', 'description', 'code'],
									include: [
										{
											model: ServiceCategory,
											as: 'category',
											attributes: ['id', 'description', 'code']
										}
									]
								}
							]
						}
					]
				}
			]
		},

		'/contracts.[update].contract': {
			attributes: {
				exclude: ['company_contractor_id', 'company_target_id', 'created_at', 'updated_at', 'deleted_at']
			},
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id', 'identifier'],
							include: [
								{
									model: DocumentType,
									as: 'type',
									attributes: ['id', 'description']
								},
								{
									model: File,
									as: 'file',
									attributes: ['id', 'link'],
									required: false
								}
							]
						}
					]
				},
				{
					model: Person,
					as: 'target',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id', 'identifier'],
							include: [
								{
									model: DocumentType,
									as: 'type',
									attributes: ['id', 'description']
								},
								{
									model: File,
									as: 'file',
									attributes: ['id', 'link'],
									required: false
								}
							]
						}
					]
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'sequential', 'year', 'description'],
					include: [
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['formula', 'amount', 'price_by_unit', [sequelize.literal(`price_by_unit * replace(amount, ',', '.')`), 'total']],
							include: [
								{
									model: Person,
									as: 'formula_creator',
									attributes: ['id', 'name'],
									required: false
								}
							]
						}
					]
				}
			],
			order: [
				[{ model: ContractLot, as: 'lots' }, 'sequential', 'asc']
			]
		},

		'/contracts': {
			attributes: ['id', 'number', 'start', 'end', 'total_value'],
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['name']
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id']
				}
			],
			order: [
				['number', 'desc']
			]
		},

		'/contracts.[details]': {
			attributes: {
				exclude: ['company_contractor_id', 'company_target_id', 'created_at', 'updated_at', 'deleted_at']
			},
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id', 'identifier'],
							include: [
								{
									model: DocumentType,
									as: 'type',
									attributes: ['id', 'description']
								},
								{
									model: File,
									as: 'file',
									attributes: ['id', 'link'],
									required: false
								}
							]
						}
					]
				},
				{
					model: Person,
					as: 'target',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id', 'identifier'],
							include: [
								{
									model: DocumentType,
									as: 'type',
									attributes: ['id', 'description']
								},
								{
									model: File,
									as: 'file',
									attributes: ['id', 'link'],
									required: false
								}
							]
						}
					]
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'sequential', 'year', 'description']
				}
			],
			order: [
				[{ model: ContractLot, as: 'lots' }, 'sequential', 'asc']
			]
		},

		'/contracts.[details].contract': {
			attributes: ['id', 'number', 'start', 'end', 'object', 'sign_date', 'total_value', 'measurement_start', 'invoicing_day', 'state', 'city', 'term_number'],
			include: [
				{
					model: Person,
					as: 'contractor',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id'],
							include: [
								{
									model: File,
									as: 'file',
									attributes: ['link']
								}
							],
							where: {
								type_id: DocumentTypes.Logo
							},
							required: false
						}
					]
				},
				{
					model: Person,
					as: 'target',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id'],
							include: [
								{
									model: File,
									as: 'file',
									attributes: ['link']
								}
							],
							where: {
								type_id: DocumentTypes.Logo
							},
							required: false
						}
					]
				},
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'description'],
					include: [
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['formula', 'amount', 'price_by_unit', [sequelize.literal(`price_by_unit * replace(amount, ',', '.')`), 'total']],
							include: [
								{
									model: Person,
									as: 'formula_creator',
									attributes: ['id', 'name'],
									required: false
								}
							]
						}
					]
				}
			],
			order: [
				[{ model: ContractLot, as: 'lots' }, 'sequential', 'asc']
			]
		}
	}
})

export { Contract }

