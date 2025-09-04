import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { Contract } from './Contract'
import { ServiceQuote } from './ServiceQuote'
import { Service } from './Service'
import { Log } from './Log'
import { OS } from './OS'
import { WorkerLot } from './WorkerLot'

class ContractLot extends Model<InferAttributes<ContractLot>, InferCreationAttributes<ContractLot>> {
	declare id: CreationOptional<number>
	declare contract_id: number
	declare sequential: number
	declare description: string
	declare year: number

	declare contract: NonAttribute<Contract>
	declare quotes: NonAttribute<ServiceQuote[]>
	declare logs: NonAttribute<Log[]>
	declare last_log: NonAttribute<Log>
	declare oss: NonAttribute<OS[]>
	declare total: NonAttribute<number>
	declare quotes_length: NonAttribute<number>
}

ContractLot.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	contract_id: DataTypes.INTEGER,
	year: DataTypes.INTEGER,
	sequential: DataTypes.INTEGER,
	description: DataTypes.STRING
}, {
	sequelize,

	tableName: 'contract_lot',

	paranoid: true,

	hooks: {
		afterFind(data: any) {
			if (!data) {
				return
			}

			if (Array.isArray(data)) {
				for (const item of data) {
					if (item.quotes) {
						for (const quote of item.quotes) {
							quote.price_by_unit = Number(quote.price_by_unit)
						}
					}
				}
			} else {
				if (data.quotes) {
					for (const quote of data.quotes) {
						quote.price_by_unit = Number(quote.price_by_unit)
					}
				}
			}
		}
	},

	scopes: {
		full: {
			attributes: ['id', 'sequential', 'year', 'description', 'contract_id'],
			include: [
				{
					model: ServiceQuote,
					as: 'quotes',
					attributes: ['id', 'amount', 'consumed', 'warn_value', 'unit', 'price_by_unit'],
					include: [
						{
							model: Service,
							as: 'service',
							attributes: ['id', 'description', 'code']
						}
					]
				}
			]
		},

		'/contracts.[details].lot': {
			attributes: ['id', 'description', 'contract_id'],
			include: [
				{
					model: ServiceQuote,
					as: 'quotes',
					attributes: ['id', 'amount', 'price_by_unit', 'unit', 'consumed', 'formula'],
					include: [
						{
							model: Service,
							as: 'service',
							attributes: ['id', 'description', 'code']
						}
					]
				}
			]
		}
	}
})

export { ContractLot }

