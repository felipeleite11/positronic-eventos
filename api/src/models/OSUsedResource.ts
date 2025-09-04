import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { OS } from './OS'
import { Unit } from './Unit'
import { UsedResourceValue } from './UsedResourceValue'

class OSUsedResource extends Model<InferAttributes<OSUsedResource>, InferCreationAttributes<OSUsedResource>> {
	declare id: CreationOptional<number>
	declare os_id: number
	declare resource: string
	declare quantity: number
	declare unit_id: number

	declare os: NonAttribute<OS>
	declare unit: NonAttribute<Unit>
	declare values: NonAttribute<UsedResourceValue[]>
}

OSUsedResource.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	os_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	resource: {
		type: DataTypes.STRING,
		allowNull: false
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1
	},
	unit_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'os_used_resource',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

OSUsedResource.addScope('full', {
	attributes: ['id', 'resource', 'quantity'],
	include: [
		{
			model: Unit,
			as: 'unit',
			attributes: ['id', 'description']
		},
		{
			model: OS,
			as: 'os',
			attributes: ['id', 'execution_start', 'execution_end', 'execution_assignment_date', 'observation', 'observation_no_execution', 'final_opinion', 'turn', 'start', 'end', 'created_at', 'contract_id', 'report', 'linked_os_id', 'requester_registration', 'contractor_os_number']
		}
	]
})

export { OSUsedResource }

