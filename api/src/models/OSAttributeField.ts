import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'
import { OSAttribute } from './OSAttribute'

class OSAttributeField extends Model<InferAttributes<OSAttributeField>, InferCreationAttributes<OSAttributeField>> {
	declare id: CreationOptional<number>
	declare description: string
	declare attribute_id: number

	declare attribute?: OSAttribute
}

OSAttributeField.init({
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

	tableName: 'os_attribute_field',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

export { OSAttributeField }

