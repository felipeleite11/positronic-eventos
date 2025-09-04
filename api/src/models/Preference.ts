import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'
import { PreferenceOption } from './PreferenceOption'

class Preference extends Model<InferAttributes<Preference>, InferCreationAttributes<Preference>> {
	declare id: CreationOptional<number>
	declare description: string
	declare type: string
	declare code: string
	declare default_value: string
}

Preference.init({
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
		allowNull: false
	},
	code: {
		type: DataTypes.STRING,
		allowNull: false
	},
	default_value: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	sequelize,

	tableName: 'preference',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

Preference.addScope('full', {
	attributes: ['id', 'description', 'type', 'default_value'],
	include: [
		{
			model: PreferenceOption,
			as: 'options',
			attributes: ['id', 'text', 'value']
		}
	]
})

export { Preference }

