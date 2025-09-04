import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'
import { Person } from './Person'
import { LogType } from './LogType'

class Log extends Model<InferAttributes<Log>, InferCreationAttributes<Log>> {
	declare id: CreationOptional<number>
	declare details: CreationOptional<string>
	declare type_id: number
	declare person_id: number
}

Log.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	type_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	person_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	details: {
		type: DataTypes.STRING
	}
}, { 
	sequelize,

	tableName: 'log',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

Log.addScope('full', {
	attributes: ['id', 'created_at', 'updated_at'],
	include: [
		{
			model: Person,
			as: 'person',
			attributes: ['id', 'name']
		},
		{
			model: LogType,
			as: 'type',
			attributes: ['id', 'description']
		}
	]
})

export { Log }

export const logTypes = {
	SERVICES_LOAD: 1
}