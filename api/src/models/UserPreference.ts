import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { PreferenceOption } from './PreferenceOption'
import { Preference } from './Preference'
import { User } from './User'

class UserPreference extends Model<InferAttributes<UserPreference>, InferCreationAttributes<UserPreference>> {
	declare id: CreationOptional<number>
	declare value: string
	declare user_id: number
	declare preference_id: number

	declare user: NonAttribute<User>
	declare preference: NonAttribute<Preference>
}

UserPreference.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	value: {
		type: DataTypes.STRING,
		allowNull: false
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	preference_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	sequelize,

	tableName: 'user_preference',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		},

		full: {
			attributes: ['id', 'value'],
			include: [
				{
					model: Preference,
					as: 'preference',
					attributes: ['id', 'description', 'type', 'code'],
					include: [
						{
							model: PreferenceOption,
							as: 'options',
							attributes: ['id', 'text', 'value']
						}
					]
				}
			]
		}
	}
})

export { UserPreference }

export const PreferenceIds = {
	FILTER_BY_LOT_IN_OS_LIST: 4
}