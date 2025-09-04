import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { OS } from './OS'

class OSService extends Model<InferAttributes<OSService>, InferCreationAttributes<OSService>> {
	declare id: CreationOptional<number>
	declare os_id: number
	declare service_id: number
	declare requested_quantity: number
	declare executed_quantity: number
	declare created_at: Date
	declare start?: string
	declare end?: string

	declare os: NonAttribute<OS>
}

OSService.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	os_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	service_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	requested_quantity: {
		type: DataTypes.DECIMAL(10, 3),
		allowNull: false,
		defaultValue: 0
	},
	executed_quantity: {
		type: DataTypes.DECIMAL(10, 3),
		allowNull: false,
		defaultValue: 0
	},
	created_at: {
		type: DataTypes.DATE
	},
	start: {
		type: DataTypes.STRING
	},
	end: {
		type: DataTypes.STRING
	}
}, {
	sequelize,

	tableName: 'os_service',

	paranoid: true,

	scopes: {
		full: {
			attributes: ['id', 'service_id', 'requested_quantity', 'executed_quantity', 'start', 'end'],
			include: [
				{
					model: OS,
					as: 'os',
					attributes: ['id', 'lot_id']
				}
			]
		}
	}
})

export { OSService }

