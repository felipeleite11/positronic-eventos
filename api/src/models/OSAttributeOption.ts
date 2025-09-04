import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'
import { OSAttribute } from './OSAttribute'

class OSAttributeOption extends Model<InferAttributes<OSAttributeOption>, InferCreationAttributes<OSAttributeOption>> {
	declare id: CreationOptional<number>
	declare description: string
	declare attribute_id: number

	declare attribute?: OSAttribute
}

OSAttributeOption.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	attribute_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	sequelize,

	tableName: 'os_attribute_option',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

export { OSAttributeOption }

