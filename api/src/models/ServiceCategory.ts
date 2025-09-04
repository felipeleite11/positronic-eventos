import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { Service } from './Service'

class ServiceCategory extends Model<InferAttributes<ServiceCategory>, InferCreationAttributes<ServiceCategory>> {
	declare id: CreationOptional<number>
	declare description: string
	declare parent_id: number | null
	declare code?: string

	declare services: NonAttribute<Service[]>
	declare parent: NonAttribute<ServiceCategory>
}

ServiceCategory.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	parent_id: {
		type: DataTypes.INTEGER
	},
	code: {
		type: DataTypes.STRING
	},
}, {
	sequelize,

	tableName: 'service_category',

	paranoid: true,

	hooks: {
		async afterFind(data: any) {
			if (!data) {
				return data
			}

			if (Array.isArray(data)) {
				for (const item of data) {

				}
			} else {

			}
		}
	},

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

ServiceCategory.addScope('full', {
	attributes: ['id', 'description', 'code'],
	include: [
		{
			model: Service,
			as: 'services',
			attributes: ['id', 'description']
		},
		{
			model: ServiceCategory,
			as: 'parent',
			attributes: ['id', 'description', 'code'],
			required: false
		},
		{
			model: ServiceCategory,
			as: 'children',
			attributes: ['id', 'description', 'code']
		}
	]
})

export { ServiceCategory }

