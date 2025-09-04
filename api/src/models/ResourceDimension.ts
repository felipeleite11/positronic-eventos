import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class ResourceDimension extends Model<InferAttributes<ResourceDimension>, InferCreationAttributes<ResourceDimension>> {
	declare id: CreationOptional<number>
	declare description: string
	declare unit: string
}

ResourceDimension.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	unit: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'resource_dimension',

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

export { ResourceDimension }

