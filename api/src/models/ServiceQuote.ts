import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'

import { currency } from '../utils/mask'
import { ContractLot } from './ContractLot'
import { Service } from './Service'
import { Contract } from './Contract'
import { ServiceCategory } from './ServiceCategory'
import { Person } from './Person'

class ServiceQuote extends Model<InferAttributes<ServiceQuote>, InferCreationAttributes<ServiceQuote>> {
	declare id: CreationOptional<number>
	declare contract_id: number
	declare service_id: number
	declare lot_id: number
	declare amount: string
	declare consumed: number
	declare warn_value?: number
	declare price_by_unit: string
	declare formula: CreationOptional<string>
	declare formula_observation: CreationOptional<string>
	declare formula_creator_id: CreationOptional<number>
	declare unit: string

	declare lot: NonAttribute<ContractLot>
	declare service: NonAttribute<Service>
	declare contract: NonAttribute<Contract>
	declare formula_creator: NonAttribute<Person>

	get formatted_price_by_unit(): NonAttribute<string> {
		return currency(this.price_by_unit)
	}

	get consumed_percent(): NonAttribute<number> {
		return Number(((this.consumed * 100) / Number(this.amount)).toFixed(2))
	}
}

ServiceQuote.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	contract_id: DataTypes.INTEGER,
	service_id: DataTypes.INTEGER,
	amount: DataTypes.STRING,
	consumed: DataTypes.DECIMAL(10, 3),
	warn_value: DataTypes.DECIMAL,
	price_by_unit: DataTypes.STRING(30),
	unit: DataTypes.STRING,
	formula: DataTypes.STRING,
	formula_observation: DataTypes.STRING,
	formula_creator_id: DataTypes.INTEGER,
	lot_id: DataTypes.INTEGER
}, {
	sequelize,

	tableName: 'service_quote',

	paranoid: true,

	hooks: {
		afterFind(data: any) {
			if (!data) {
				return
			}

			if (Array.isArray(data)) {
				for(const item of data) {
					item.dataValues.formatted_price_by_unit = item.formatted_price_by_unit
					item.dataValues.consumed_percent = item.consumed_percent
					item.amount = item.amount
					item.consumed = Number(item.consumed)
					item.warn_value = Number(item.warn_value)
					item.price_by_unit = Number(item.price_by_unit)
				}
			} else {
				data.dataValues.formatted_price_by_unit = data.formatted_price_by_unit
				data.dataValues.consumed_percent = data.consumed_percent
				data.amount = data.amount
				data.consumed = Number(data.consumed)
				data.warn_value = Number(data.warn_value)
				data.price_by_unit = Number(data.price_by_unit)
			}
		}
	},

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			},
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
	}
})

export { ServiceQuote }

