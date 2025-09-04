import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { OSAttributeOption } from './OSAttributeOption'
import { OSAttributeField } from './OSAttributeField'

class OSAttribute extends Model<InferAttributes<OSAttribute>, InferCreationAttributes<OSAttribute>> {
	declare id: CreationOptional<number>
	declare description: string
	declare type: string

	declare options?: NonAttribute<OSAttributeOption[]>
	declare fields?: NonAttribute<OSAttributeField[]>
}

OSAttribute.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	type: {
		type: DataTypes.STRING,
		values: ['select']
	}
}, {
	sequelize,

	tableName: 'os_attribute',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			},
			include: [
				{
					model: OSAttributeField,
					as: 'fields',
					attributes: ['id', 'description'],
					order: [['id', 'asc']]
				},
				{
					model: OSAttributeOption,
					as: 'options',
					attributes: {
						exclude: ['created_at', 'updated_at', 'deleted_at']
					}
				}
			]
		}
	}
})

export { OSAttribute }

