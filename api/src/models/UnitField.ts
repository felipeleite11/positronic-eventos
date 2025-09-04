import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { Unit } from './Unit'

class UnitField extends Model<InferAttributes<UnitField>, InferCreationAttributes<UnitField>> {
	declare id: CreationOptional<number>
	declare description: string

	declare unit: NonAttribute<Unit>
}

UnitField.init({
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

	tableName: 'unit_field',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			},
			include: [
				{
					model: Unit,
					as: 'unit',
					attributes: ['id', 'description']
				}
			]
		}
	}
})

export { UnitField }

