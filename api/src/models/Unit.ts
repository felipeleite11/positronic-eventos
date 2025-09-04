import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { UnitField } from './UnitField'

class Unit extends Model<InferAttributes<Unit>, InferCreationAttributes<Unit>> {
	declare id: CreationOptional<number>
	declare description: string

	declare fields: NonAttribute<UnitField[]>
}

Unit.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	sequelize,

	tableName: 'unit',

	paranoid: true,

	scopes: {
		full: {
			attributes: ['id', 'description'],
			include: [
				{
					model: UnitField,
					as: 'fields',
					attributes: ['id', 'description'],
					separate: true,
					order: [['id', 'asc']]
				}
			]
		}
	}
})

export { Unit }

