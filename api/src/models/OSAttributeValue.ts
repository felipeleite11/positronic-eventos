import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'
import { OSAttribute } from './OSAttribute'
import { OSAttributeOption } from './OSAttributeOption'
import { OS } from './OS'
import { OSAttributeField } from './OSAttributeField'

class OSAttributeValue extends Model<InferAttributes<OSAttributeValue>, InferCreationAttributes<OSAttributeValue>> {
	declare id: CreationOptional<number>
	declare value?: string
	declare attribute_id: number
	declare attribute_option_id?: number
	declare attribute_field_id?: number
	declare os_id: number

	declare attribute?: OSAttribute
	declare field?: OSAttributeField
	declare option?: OSAttributeOption
	declare os?: OS
}

OSAttributeValue.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	value: {
		type: DataTypes.STRING
	},
	attribute_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	attribute_option_id: {
		type: DataTypes.INTEGER
	},
	attribute_field_id: {
		type: DataTypes.INTEGER
	},
	os_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	sequelize,

	tableName: 'os_attribute_value',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

export { OSAttributeValue }

