import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'

import { Resource } from './Resource'

class ResourceCategory extends Model<InferAttributes<ResourceCategory>, InferCreationAttributes<ResourceCategory>> {
	declare id: CreationOptional<number>
	declare description: string

	declare resources: NonAttribute<Resource[]>
}

ResourceCategory.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'resource_category',

	paranoid: true,

	hooks: {
		afterFind(data: any) {
			if(!data) {
				return data
			}

			if(Array.isArray(data)) {
				for(const item of data) {
					
				}
			} else {
				
			}
		}
	},

	scopes: {
		full: {
			attributes: ['id', 'description']
			// include: [
			// 	{
			// 		model: Resource,
			// 		as: 'resources',
			// 		attributes: ['id', 'description']
			// 	}
			// ]
		}
	}
})

export { ResourceCategory }

