import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { UnitField } from './UnitField'
import { OSUsedResource } from './OSUsedResource'

class UsedResourceValue extends Model<InferAttributes<UsedResourceValue>, InferCreationAttributes<UsedResourceValue>> {
	declare id: CreationOptional<number>
	declare value: string
	declare unit_field_id: number
	declare os_used_resource_id: number

	declare field: NonAttribute<UnitField>
	declare os_used_resource: NonAttribute<OSUsedResource>
}

UsedResourceValue.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	value: {
		type: DataTypes.STRING
	},
	unit_field_id: {
		type: DataTypes.INTEGER
	},
	os_used_resource_id: {
		type: DataTypes.INTEGER
	}
}, { 
	sequelize,

	tableName: 'used_resource_value',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			},
			include: [
				{
					model: UnitField,
					as: 'field',
					attributes: ['id', 'description']
				}
			]
		}
	}
})

export { UsedResourceValue }

