import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Op } from 'sequelize'

import sequelize from './_connection'

import { Person } from './Person'
import { Address } from './Address'
import { Contract } from './Contract'
import { Document } from './Document'
import { Resource } from './Resource'
import { ResourceCategory } from './ResourceCategory'
import { OSPriority } from './OSPriority'
import { Service } from './Service'
import { ResourceDimension } from './ResourceDimension'
import { Team } from './Team'
import { File } from './File'
import { ServiceQuote } from './ServiceQuote'
import { ContractLot } from './ContractLot'
import { Font } from './Font'
import { ServiceCategory } from './ServiceCategory'
import { OSUsedResource } from './OSUsedResource'
import { OSStatus } from './OSStatus'
import { OSAttributeValue } from './OSAttributeValue'
import { OSAttributeOption } from './OSAttributeOption'
import { OSAttribute } from './OSAttribute'
import { DocumentType, DocumentTypes } from './DocumentType'
import { Unit } from './Unit'
import { OSAttributeField } from './OSAttributeField'
import { UsedResourceValue } from './UsedResourceValue'
import { UnitField } from './UnitField'
import { OSExtraService } from './OSExtraService'

class OS extends Model<InferAttributes<OS>, InferCreationAttributes<OS>> {
	declare id: CreationOptional<number>
	declare creator_id: number
	declare turn: string
	declare start: string
	declare end: string
	declare execution_team_id?: number
	declare company_executor_id?: number
	declare address_id: number
	declare supervisor_id?: number
	declare contract_id: number
	declare finisher_id?: number
	declare lot_id: number
	declare status_id: number
	declare requester_id: number
	declare priority_id: number
	declare company_requester_id: number
	declare created_at?: Date
	declare execution_start: Date | null
	declare execution_end: Date | null
	declare finished_at: Date | null
	declare execution_assignment_date?: Date
	declare observation?: string
	declare observation_no_execution?: string
	declare final_opinion?: string
	declare report: string | null
	declare deleted_at: Date | null
	declare linked_os_id: number | null
	declare contractor_os_number: string
	declare requester_registration: string | null
	declare executor_id?: number

	declare requester: NonAttribute<Person>
	declare contract: NonAttribute<Contract>
	declare supervisor: NonAttribute<Person>
	declare company_requester: NonAttribute<Person>
	declare finisher: NonAttribute<Person>
	declare creator: NonAttribute<Person>
	declare company_executor: NonAttribute<Person>
	declare team_executor: NonAttribute<Team>
	declare address: NonAttribute<Address>
	declare services: NonAttribute<Service[]>
	declare extra_services: NonAttribute<Service[]>
	declare os_extra_services: NonAttribute<OSExtraService[]>
	declare files: NonAttribute<File[]>
	declare linked_od: NonAttribute<OS>
	declare lot: NonAttribute<ContractLot>
	declare used_resources: NonAttribute<OSUsedResource[]>
	declare status: NonAttribute<OSStatus>
	declare attributes: NonAttribute<OSAttributeValue[]>
}

OS.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	creator_id: {
		type: DataTypes.INTEGER
	},
	company_executor_id: {
		type: DataTypes.INTEGER
	},
	execution_team_id: {
		type: DataTypes.INTEGER
	},
	address_id: {
		type: DataTypes.INTEGER
	},
	contract_id: {
		type: DataTypes.INTEGER
	},
	created_at: {
		type: DataTypes.DATE
	},
	execution_start: {
		type: DataTypes.DATE
	},
	execution_end: {
		type: DataTypes.DATE
	},
	finished_at: {
		type: DataTypes.DATE
	},
	requester_id: {
		type: DataTypes.INTEGER
	},
	priority_id: {
		type: DataTypes.INTEGER
	},
	company_requester_id: {
		type: DataTypes.INTEGER
	},
	supervisor_id: {
		type: DataTypes.INTEGER
	},
	observation: {
		type: DataTypes.TEXT
	},
	turn: {
		type: DataTypes.STRING
	},
	start: {
		type: DataTypes.STRING
	},
	end: {
		type: DataTypes.STRING
	},
	report: {
		type: DataTypes.TEXT
	},
	observation_no_execution: {
		type: DataTypes.TEXT
	},
	final_opinion: {
		type: DataTypes.TEXT
	},
	deleted_at: {
		type: DataTypes.DATE
	},
	linked_os_id: {
		type: DataTypes.INTEGER
	},
	lot_id: {
		type: DataTypes.INTEGER
	},
	finisher_id: {
		type: DataTypes.INTEGER
	},
	status_id: {
		type: DataTypes.INTEGER
	},
	contractor_os_number: {
		type: DataTypes.STRING,
		allowNull: false
	},
	requester_registration: {
		type: DataTypes.STRING
	},
	executor_id: {
		type: DataTypes.INTEGER
	}
}, {
	sequelize,

	tableName: 'os',

	paranoid: true,

	hooks: {
		afterFind(data: any) {
			if (!data) {
				return data
			}

			if (Array.isArray(data)) {
				for (const item of data) {
					if (item.address) {
						item.address.dataValues.full_address = item.address.fullAddress
					}

					if (item.requester?.address) {
						item.requester.address.dataValues.full_address = item.requester.fullAddress
					}

					if (item.services) {
						for (const service of item.services) {
							service.os_service.dataValues.requested_quantity = Number(service.os_service.dataValues.requested_quantity)

							if (service.os_service.dataValues.executed_quantity) {
								service.os_service.dataValues.executed_quantity = Number(service.os_service.dataValues.executed_quantity)
							}
						}
					}
				}
			} else {
				if (data.address) {
					data.address.dataValues.full_address = data.address.fullAddress
				}

				if (data.requester?.address) {
					data.requester.address.dataValues.full_address = data.address.fullAddress
				}

				if (data.services) {
					for (const service of data.services) {
						service.os_service.dataValues.requested_quantity = Number(service.os_service.dataValues.requested_quantity)

						if (service.os_service.dataValues.executed_quantity) {
							service.os_service.dataValues.executed_quantity = Number(service.os_service.dataValues.executed_quantity)
						}
					}
				}
			}
		},

		beforeCreate(data) {
			data.contractor_os_number = data.contractor_os_number.trim()
		},

		beforeUpdate(data) {
			data.report = data.report.trim()
			data.observation_no_execution = data.observation_no_execution.trim()
			data.final_opinion = data.final_opinion.trim()
		}
	},

	scopes: {
		basic: {
			attributes: ['id', 'execution_start', 'execution_end', 'finished_at', 'execution_assignment_date', 'observation', 'observation_no_execution', 'final_opinion', 'turn', 'start', 'end', 'created_at', 'contract_id', 'lot_id', 'report', 'linked_os_id', 'requester_registration', 'contractor_os_number', 'executor_id']
		},

		for_list: {
			attributes: ['id', 'execution_start', 'execution_end', 'finished_at', 'execution_assignment_date', 'observation', 'observation_no_execution', 'final_opinion', 'turn', 'start', 'end', 'created_at', 'contract_id', 'lot_id', 'report', 'linked_os_id', 'requester_registration', 'contractor_os_number'],
			include: [
				{
					model: Person,
					as: 'supervisor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Person,
					as: 'finisher',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Person,
					as: 'executor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: OSStatus,
					as: 'status',
					attributes: ['id', 'description']
				},
				{
					model: OSPriority,
					as: 'priority',
					attributes: ['id', 'description']
				},
				{
					model: Person,
					as: 'company_requester',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id'],
							include: [
								{
									model: DocumentType,
									as: 'type',
									attributes: ['id', 'description']
								},
								{
									model: File,
									as: 'file',
									attributes: ['id', 'link']
								}
							],
							where: {
								type_id: DocumentTypes.Logo
							}
						}
					]
				},
				{
					model: Address,
					as: 'address',
					attributes: {
						exclude: ['created_at', 'updated_at', 'deleted_at']
					}
				},
				{
					model: Service,
					as: 'services',
					through: { attributes: ['id', 'requested_quantity', 'executed_quantity', 'start', 'end'] },
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

		for_finish: {
			attributes: ['id', 'lot_id', 'contract_id', 'status_id'],
			include: [
				{
					model: OSAttributeValue,
					as: 'attributes',
					attributes: ['id', 'attribute_option_id', 'attribute_field_id', 'value'],
					include: [
						{
							model: OSAttribute,
							as: 'attribute',
							attributes: ['id', 'description']
						}
					]
				}
			]
		},

		full: {
			attributes: ['id', 'status_id', 'execution_start', 'execution_end', 'finished_at', 'execution_assignment_date', 'observation', 'observation_no_execution', 'final_opinion', 'turn', 'start', 'end', 'created_at', 'contract_id', 'report', 'linked_os_id', 'requester_registration', 'contractor_os_number', 'supervisor_id', 'lot_id'],
			include: [
				{
					model: OSStatus,
					as: 'status',
					attributes: ['id', 'description']
				},
				{
					model: File,
					as: 'files',
					through: {
						where: { deleted_at: null },
						attributes: ['at_moment']
					},
					attributes: ['id', 'link']
				},
				{
					model: OSAttributeValue,
					as: 'attributes',
					attributes: ['id', 'attribute_option_id', 'attribute_field_id', 'value'],
					include: [
						{
							model: OSAttributeField,
							as: 'field',
							attributes: ['id', 'description']
						},
						{
							model: OSAttribute,
							as: 'attribute',
							attributes: ['id', 'description'],
							include: [
								{
									model: OSAttributeField,
									as: 'fields',
									attributes: ['id', 'description']
								}
							]
						},
						{
							model: OSAttributeOption,
							as: 'option',
							attributes: ['id', 'description'],
							required: false
						}
					]
				},
				{
					model: Person,
					as: 'finisher',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Person,
					as: 'executor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: OSUsedResource,
					as: 'used_resources',
					attributes: ['id', 'resource', 'quantity'],
					include: [
						{
							model: Unit,
							as: 'unit',
							attributes: ['id', 'description']
						},
						{
							model: UsedResourceValue,
							as: 'values',
							attributes: ['id', 'value', 'unit_field_id'],
							required: false,
							include: [
								{
									model: UnitField,
									as: 'field',
									attributes: ['id', 'description']
								}
							]
						}
					]
				},
				{
					model: Resource,
					as: 'resources',
					through: {
						where: { deleted_at: null },
						attributes: []
					},
					attributes: ['id', 'description'],
					include: [
						{
							model: ResourceCategory,
							as: 'category',
							attributes: ['id', 'description']
						}
					]
				},
				{
					model: Person,
					as: 'supervisor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: OS,
					as: 'linked_os',
					attributes: ['id', 'execution_start', 'execution_end', 'execution_assignment_date', 'observation', 'turn', 'start', 'end', 'created_at', 'contract_id', 'report', 'final_opinion', 'linked_os_id', 'requester_registration', 'contractor_os_number'],
					required: false
				},
				{
					model: ContractLot,
					as: 'lot',
					attributes: ['id', 'sequential', 'year', 'description', 'contract_id']
				},
				{
					model: Service,
					as: 'services',
					through: {
						where: { deleted_at: null },
						attributes: ['id', 'requested_quantity', 'executed_quantity', 'start', 'end']
					},
					attributes: ['id', 'description', 'code'],
					include: [
						{
							model: ServiceCategory,
							as: 'category',
							attributes: ['id', 'description', 'code']
						},
						{
							model: Font,
							as: 'font',
							attributes: ['id', 'description']
						},
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['id', 'contract_id', 'lot_id', 'unit', 'amount', 'price_by_unit'],
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
									attributes: ['id', 'contract_id', 'lot_id', 'unit', 'amount', 'price_by_unit'],
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
						where: { deleted_at: null },
						attributes: ['id', 'executed_quantity', 'start', 'end']
					},
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
							attributes: ['id', 'contract_id', 'lot_id', 'unit', 'amount', 'price_by_unit'],
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
				{
					model: OSPriority,
					as: 'priority',
					attributes: ['id', 'description']
				},
				{
					model: Person,
					as: 'requester',
					attributes: ['id', 'name'],
					include: [
						{
							model: Address,
							as: 'address',
							attributes: ['id', 'state', 'city', 'district', 'street', 'number', 'complement', 'zipcode']
						}
					]
				},
				{
					model: Person,
					as: 'company_requester',
					attributes: ['id', 'name'],
					include: [
						{
							model: Document,
							as: 'documents',
							attributes: ['id'],
							include: [
								{
									model: DocumentType,
									as: 'type',
									attributes: ['id', 'description']
								},
								{
									model: File,
									as: 'file',
									attributes: ['id', 'link']
								}
							],
							where: {
								type_id: DocumentTypes.Logo
							}
						}
					]
				},
				{
					model: Person,
					as: 'creator',
					attributes: ['id', 'name']
				},
				{
					model: Team,
					as: 'execution_team',
					attributes: ['id'],
					required: false,
					include: [
						{
							model: Person,
							as: 'people',
							attributes: ['id', 'name'],
							through: {
								where: { deleted_at: null },
								attributes: []
							}
						},
						{
							model: Person,
							as: 'master',
							attributes: ['id', 'name']
						}
					]
				},
				{
					model: Person,
					as: 'company_executor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Address,
					as: 'address',
					attributes: {
						exclude: ['created_at', 'updated_at', 'deleted_at']
					}
				}
			]
		},

		archived: {
			attributes: ['id', 'execution_start', 'execution_end', 'finished_at', 'deleted_at', 'execution_assignment_date', 'observation', 'observation_no_execution', 'final_opinion', 'turn', 'start', 'end', 'created_at', 'contract_id', 'report', 'linked_os_id', 'requester_registration', 'contractor_os_number'],
			include: [
				{
					model: OSStatus,
					as: 'status',
					attributes: ['id', 'description']
				},
				{
					model: OSAttributeValue,
					as: 'attributes',
					attributes: ['id', 'attribute_option_id', 'attribute_field_id', 'value'],
					include: [
						{
							model: OSAttribute,
							as: 'attribute',
							attributes: ['id', 'description'],
							include: [
								{
									model: OSAttributeField,
									as: 'fields',
									attributes: ['id', 'description']
								}
							]
						},
						{
							model: OSAttributeOption,
							as: 'option',
							attributes: ['id', 'description']
						}
					]
				},
				{
					model: Person,
					as: 'finisher',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Person,
					as: 'executor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: OSUsedResource,
					as: 'used_resources',
					attributes: ['id', 'resource', 'quantity'],
					include: [
						{
							model: Unit,
							as: 'unit',
							attributes: ['id', 'description']
						}
					]
				},
				{
					model: Resource,
					as: 'resources',
					through: {
						where: { deleted_at: null }, attributes: []
					},
					attributes: ['id', 'description'],
					include: [
						{
							model: ResourceCategory,
							as: 'category',
							attributes: ['id', 'description']
						}
					]
				},
				{
					model: Person,
					as: 'supervisor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: OS,
					as: 'linked_os',
					attributes: ['id', 'execution_start', 'execution_end', 'execution_assignment_date', 'observation', 'turn', 'start', 'end', 'created_at', 'contract_id', 'report', 'final_opinion', 'linked_os_id', 'requester_registration', 'contractor_os_number'],
					required: false
				},
				{
					model: ContractLot,
					as: 'lot',
					attributes: ['id', 'sequential', 'year', 'description', 'contract_id']
				},
				{
					model: Service,
					as: 'services',
					through: {
						where: { deleted_at: null }, attributes: ['id', 'requested_quantity', 'executed_quantity', 'start', 'end']
					},
					attributes: ['id', 'description', 'code'],
					include: [
						{
							model: ServiceCategory,
							as: 'category',
							attributes: ['id', 'description', 'code']
						},
						{
							model: Font,
							as: 'font',
							attributes: ['id', 'description']
						},
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['id', 'contract_id', 'unit'],
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
				{
					model: Service,
					as: 'extra_services',
					through: {
						where: { deleted_at: null },
						attributes: ['id', 'executed_quantity', 'start', 'end']
					},
					attributes: ['id', 'description', 'code'],
					include: [
						{
							model: ServiceCategory,
							as: 'category',
							attributes: ['id', 'description', 'code']
						}
					]
				},
				{
					model: OSPriority,
					as: 'priority',
					attributes: ['id', 'description']
				},
				{
					model: Person,
					as: 'requester',
					attributes: ['id', 'name'],
					include: [
						{
							model: Address,
							as: 'address',
							attributes: ['id', 'state', 'city', 'district', 'street', 'number', 'complement', 'zipcode']
						}
					]
				},
				{
					model: Person,
					as: 'company_requester',
					attributes: ['id', 'name']
				},
				{
					model: Person,
					as: 'creator',
					attributes: ['id', 'name']
				},
				{
					model: Team,
					as: 'execution_team',
					attributes: ['id'],
					required: false,
					include: [
						{
							model: Person,
							as: 'people',
							attributes: ['id', 'name'],
							through: {
								where: { deleted_at: null },
								attributes: []
							}
						},
						{
							model: Person,
							as: 'master',
							attributes: ['id', 'name']
						}
					]
				},
				{
					model: Person,
					as: 'company_executor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Address,
					as: 'address',
					attributes: {
						exclude: ['created_at', 'updated_at', 'deleted_at']
					}
				},
				{
					model: File,
					as: 'files',
					through: {
						where: { deleted_at: null },
						attributes: ['at_moment']
					},
					attributes: ['id', 'link']
				}
			],
			where: {
				deleted_at: {
					[Op.not]: null
				}
			}
		},

		finished: {
			attributes: ['id', 'execution_start', 'execution_end', 'finished_at', 'execution_assignment_date', 'observation', 'observation_no_execution', 'final_opinion', 'turn', 'start', 'end', 'created_at', 'contract_id', 'deleted_at', 'report', 'linked_os_id', 'requester_registration', 'contractor_os_number'],
			include: [
				{
					model: OSStatus,
					as: 'status',
					attributes: ['id', 'description']
				},
				{
					model: Person,
					as: 'finisher',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Person,
					as: 'executor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Resource,
					as: 'resources',
					through: {
						where: { deleted_at: null }, attributes: []
					},
					attributes: ['id', 'description'],
					include: [
						{
							model: ResourceCategory,
							as: 'category',
							attributes: ['id', 'description']
						}
					]
				},
				{
					model: OS,
					as: 'linked_os',
					attributes: ['id', 'execution_start', 'execution_end', 'execution_assignment_date', 'observation', 'turn', 'start', 'end', 'created_at', 'contract_id', 'report', 'final_opinion', 'linked_os_id', 'requester_registration', 'contractor_os_number'],
					required: false
				},
				{
					model: ContractLot,
					as: 'lot',
					attributes: ['id', 'sequential', 'year', 'description', 'contract_id']
				},
				{
					model: Person,
					as: 'supervisor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Service,
					as: 'services',
					through: {
						where: { deleted_at: null }, attributes: ['id', 'requested_quantity', 'executed_quantity', 'start', 'end']
					},
					attributes: ['id', 'description', 'code'],
					include: [
						{
							model: Font,
							as: 'font',
							attributes: ['id', 'description']
						},
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['id', 'contract_id', 'unit'],
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
				{
					model: OSPriority,
					as: 'priority',
					attributes: ['id', 'description']
				},
				{
					model: Person,
					as: 'requester',
					attributes: ['id', 'name'],
					include: [
						{
							model: Address,
							as: 'address',
							attributes: ['id', 'state', 'city', 'district', 'street', 'number', 'complement', 'zipcode']
						}
					]
				},
				{
					model: Person,
					as: 'company_requester',
					attributes: ['id', 'name']
				},
				{
					model: Person,
					as: 'creator',
					attributes: ['id', 'name']
				},
				{
					model: Team,
					as: 'execution_team',
					attributes: ['id'],
					required: false,
					include: [
						{
							model: Person,
							as: 'people',
							attributes: ['id', 'name'],
							through: {
								where: { deleted_at: null }, attributes: []
							}
						},
						{
							model: Person,
							as: 'master',
							attributes: ['id', 'name']
						}
					]
				},
				{
					model: Person,
					as: 'company_executor',
					attributes: ['id', 'name'],
					required: false
				},
				{
					model: Address,
					as: 'address',
					attributes: {
						exclude: ['created_at', 'updated_at', 'deleted_at']
					}
				},
				{
					model: File,
					as: 'files',
					through: {
						where: { deleted_at: null },
						attributes: ['at_moment']
					},
					attributes: ['id', 'link']
				}
			],
			where: {
				execution_end: {
					[Op.not]: null
				}
			}
		},

		with_services: {
			attributes: ['id', 'execution_start', 'execution_end', 'finished_at', 'execution_assignment_date', 'observation', 'observation_no_execution', 'final_opinion', 'turn', 'start', 'end', 'created_at', 'contract_id', 'lot_id', 'report', 'linked_os_id', 'requester_registration', 'contractor_os_number'],
			include: [
				{
					model: Service,
					as: 'services',
					through: {
						where: { deleted_at: null },
						attributes: ['id', 'requested_quantity', 'executed_quantity', 'start', 'end']
					},
					attributes: ['id', 'description', 'code'],
					include: [
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['id', 'contract_id', 'lot_id', 'unit', 'amount', 'price_by_unit'],
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
				{
					model: Service,
					as: 'extra_services',
					through: {
						where: { deleted_at: null },
						attributes: ['id', 'executed_quantity', 'start', 'end']
					},
					attributes: ['id', 'description', 'code'],
					include: [
						{
							model: ServiceQuote,
							as: 'quotes',
							attributes: ['id', 'contract_id', 'lot_id', 'unit', 'amount', 'price_by_unit'],
							include: [
								{
									model: ContractLot,
									as: 'lot',
									attributes: ['id', 'sequential', 'description', 'year']
								}
							]
						}
					]
				}
			]
		},

		byIdAndLot(id: number, lot_id: number) {
			return {
				attributes: ['id', 'status_id', 'execution_start', 'execution_end', 'finished_at', 'execution_assignment_date', 'observation', 'observation_no_execution', 'final_opinion', 'turn', 'start', 'end', 'created_at', 'contract_id', 'report', 'linked_os_id', 'requester_registration', 'contractor_os_number', 'supervisor_id', 'lot_id'],
				include: [
					{
						model: OSStatus,
						as: 'status',
						attributes: ['id', 'description']
					},
					{
						model: File,
						as: 'files',
						through: {
							where: { deleted_at: null },
							attributes: ['at_moment']
						},
						attributes: ['id', 'link']
					},
					{
						model: OSAttributeValue,
						as: 'attributes',
						attributes: ['id', 'attribute_option_id', 'attribute_field_id', 'value'],
						include: [
							{
								model: OSAttributeField,
								as: 'field',
								attributes: ['id', 'description']
							},
							{
								model: OSAttribute,
								as: 'attribute',
								attributes: ['id', 'description'],
								include: [
									{
										model: OSAttributeField,
										as: 'fields',
										attributes: ['id', 'description']
									}
								]
							},
							{
								model: OSAttributeOption,
								as: 'option',
								attributes: ['id', 'description'],
								required: false
							}
						]
					},
					{
						model: Person,
						as: 'finisher',
						attributes: ['id', 'name'],
						required: false
					},
					{
						model: Person,
						as: 'executor',
						attributes: ['id', 'name'],
						required: false
					},
					{
						model: OSUsedResource,
						as: 'used_resources',
						attributes: ['id', 'resource', 'quantity'],
						include: [
							{
								model: Unit,
								as: 'unit',
								attributes: ['id', 'description']
							},
							{
								model: UsedResourceValue,
								as: 'values',
								attributes: ['id', 'value', 'unit_field_id'],
								required: false,
								include: [
									{
										model: UnitField,
										as: 'field',
										attributes: ['id', 'description']
									}
								]
							}
						]
					},
					{
						model: Resource,
						as: 'resources',
						through: {
							where: { deleted_at: null },
							attributes: []
						},
						attributes: ['id', 'description'],
						include: [
							{
								model: ResourceCategory,
								as: 'category',
								attributes: ['id', 'description']
							}
						]
					},
					{
						model: Person,
						as: 'supervisor',
						attributes: ['id', 'name'],
						required: false
					},
					{
						model: OS,
						as: 'linked_os',
						attributes: ['id', 'execution_start', 'execution_end', 'execution_assignment_date', 'observation', 'turn', 'start', 'end', 'created_at', 'contract_id', 'report', 'final_opinion', 'linked_os_id', 'requester_registration', 'contractor_os_number'],
						required: false
					},
					{
						model: ContractLot,
						as: 'lot',
						attributes: ['id', 'sequential', 'year', 'description', 'contract_id']
					},
					{
						model: Service,
						as: 'services',
						through: {
							where: { deleted_at: null },
							attributes: ['id', 'requested_quantity', 'executed_quantity', 'start', 'end']
						},
						attributes: ['id', 'description', 'code'],
						include: [
							{
								model: ServiceCategory,
								as: 'category',
								attributes: ['id', 'description', 'code']
							},
							{
								model: Font,
								as: 'font',
								attributes: ['id', 'description']
							},
							{
								model: ServiceQuote,
								as: 'quotes',
								attributes: ['id', 'contract_id', 'lot_id', 'unit', 'amount', 'price_by_unit'],
								include: [
									{
										model: ContractLot,
										as: 'lot',
										attributes: ['id', 'sequential', 'description', 'year']
									}
								],
								where: {
									lot_id
								}
							}
						]
					},
					{
						model: OSExtraService,
						as: 'os_extra_services',
						attributes: ['id', 'service_id', 'executed_quantity', 'start', 'end']
					},
					{
						model: Service,
						as: 'extra_services',
						through: {
							where: { deleted_at: null },
							attributes: ['id', 'executed_quantity', 'start', 'end']
						},
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
								attributes: ['id', 'contract_id', 'lot_id', 'unit', 'amount', 'price_by_unit'],
								include: [
									{
										model: ContractLot,
										as: 'lot',
										attributes: ['id', 'sequential', 'description', 'year']
									}
								],
								where: {
									lot_id
								}
							}
						]
					},
					{
						model: OSPriority,
						as: 'priority',
						attributes: ['id', 'description']
					},
					{
						model: Person,
						as: 'requester',
						attributes: ['id', 'name'],
						include: [
							{
								model: Address,
								as: 'address',
								attributes: ['id', 'state', 'city', 'district', 'street', 'number', 'complement', 'zipcode']
							}
						]
					},
					{
						model: Person,
						as: 'company_requester',
						attributes: ['id', 'name'],
						include: [
							{
								model: Document,
								as: 'documents',
								attributes: ['id'],
								include: [
									{
										model: DocumentType,
										as: 'type',
										attributes: ['id', 'description']
									},
									{
										model: File,
										as: 'file',
										attributes: ['id', 'link']
									}
								],
								where: {
									type_id: DocumentTypes.Logo
								}
							}
						]
					},
					{
						model: Person,
						as: 'creator',
						attributes: ['id', 'name']
					},
					{
						model: Team,
						as: 'execution_team',
						attributes: ['id'],
						required: false,
						include: [
							{
								model: Person,
								as: 'people',
								attributes: ['id', 'name'],
								through: {
									where: { deleted_at: null },
									attributes: []
								}
							},
							{
								model: Person,
								as: 'master',
								attributes: ['id', 'name']
							}
						]
					},
					{
						model: Person,
						as: 'company_executor',
						attributes: ['id', 'name'],
						required: false
					},
					{
						model: Address,
						as: 'address',
						attributes: {
							exclude: ['created_at', 'updated_at', 'deleted_at']
						}
					}
				],
				where: { id }
			}
		}
	}
})

export { OS }

