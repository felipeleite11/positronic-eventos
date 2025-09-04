import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { ContractLot } from './ContractLot'

class Measurement extends Model<InferAttributes<Measurement>, InferCreationAttributes<Measurement>> {
	declare id: CreationOptional<number>
	declare contract_lot_id: number
	declare number: number

	declare lot: NonAttribute<ContractLot>
}

Measurement.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	contract_lot_id: DataTypes.INTEGER,
	number: DataTypes.INTEGER
}, { 
	sequelize,

	tableName: 'measurement',

	paranoid: true,

	scopes: {
		full: {
			attributes: ['id', 'number'],
			include: [
				{
					model: ContractLot,
					as: 'lot',
					attributes: ['id', 'sequential', 'year']
				}
			]
		}
	}
})

export { Measurement }

