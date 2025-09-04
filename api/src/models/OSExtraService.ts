import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { OS } from './OS'
import { Service } from './Service'
import { ServiceCategory } from './ServiceCategory'
import { ServiceQuote } from './ServiceQuote'
import { ContractLot } from './ContractLot'

class OSExtraService extends Model<InferAttributes<OSExtraService>, InferCreationAttributes<OSExtraService>> {
	declare id: CreationOptional<number>
	declare os_id: number
	declare service_id: number
	declare executed_quantity: number
	declare start?: string
	declare end?: string

	declare os: NonAttribute<OS>
	declare service: NonAttribute<Service>
}

OSExtraService.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	os_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	service_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	executed_quantity: {
		type: DataTypes.DECIMAL(10, 3),
		allowNull: false,
		defaultValue: 0
	},
	start: {
		type: DataTypes.STRING
	},
	end: {
		type: DataTypes.STRING
	}
}, {
	sequelize,

	tableName: 'os_extra_service',

	paranoid: true,

	scopes: {
		full: {
			attributes: ['id', 'service_id', 'os_id', 'executed_quantity', 'start', 'end']
		},
		report: {
			attributes: ['id', 'service_id', 'os_id', 'executed_quantity', 'start', 'end'],
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
				}
			]
		}
	}
})

export { OSExtraService }

