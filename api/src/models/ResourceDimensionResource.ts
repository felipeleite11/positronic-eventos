import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class ResourceDimensionResource extends Model<InferAttributes<ResourceDimensionResource>, InferCreationAttributes<ResourceDimensionResource>> {
	declare id: CreationOptional<number>
	declare resource_id: number
	declare resource_dimension_id: number
}

ResourceDimensionResource.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	resource_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	resource_dimension_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'resource_dimension_resource',

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
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

export { ResourceDimensionResource }

