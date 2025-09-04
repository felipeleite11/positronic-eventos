import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class PreferenceOption extends Model<InferAttributes<PreferenceOption>, InferCreationAttributes<PreferenceOption>> {
	declare id: CreationOptional<number>
	declare preference_id: number
	declare text: string
	declare value: string
}

PreferenceOption.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	text: {
		type: DataTypes.STRING,
		allowNull: false
	},
	value: {
		type: DataTypes.STRING,
		allowNull: false
	},
	preference_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'preference_option',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

PreferenceOption.addScope('full', {
	attributes: ['id', 'text', 'value']
})

export { PreferenceOption }

