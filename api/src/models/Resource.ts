import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { ResourceCategory } from './ResourceCategory'
import { ResourceDimension } from './ResourceDimension'

class Resource extends Model<InferAttributes<Resource>, InferCreationAttributes<Resource>> {
	declare id: CreationOptional<number>
	declare description: string
	declare category_id: number
	
	declare category: NonAttribute<ResourceCategory>
	declare dimensions: NonAttribute<ResourceDimension[]>
}

Resource.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	category_id: {
		type: DataTypes.INTEGER
	}
}, { 
	sequelize,

	tableName: 'resource',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updatyed_at', 'deleted_at']
			},
			include: [
				{
					model: ResourceCategory,
					as: 'category',
					attributes: ['id', 'description']
				},
				{
					model: ResourceDimension,
					as: 'dimensions',
					attributes: ['id', 'description', 'unit'],
					through: { attributes: [] }
				}
			]
		}
	}
})

export { Resource }

