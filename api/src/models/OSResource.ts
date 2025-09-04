import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'
import { Resource } from './Resource'

class OSResource extends Model<InferAttributes<OSResource>, InferCreationAttributes<OSResource>> {
	declare id: CreationOptional<number>
	declare os_id: number
	declare resource_id: number
	declare consumed: number
}

OSResource.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	os_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	resource_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	consumed: {
		type: DataTypes.INTEGER
	}
}, {
	sequelize,

	tableName: 'os_resource',

	paranoid: true,

	hooks: {
		afterFind(data: any) {
			if (!data) {
				return data
			}

			if (Array.isArray(data)) {
				for (const item of data) {
					item.consumed = Number(item.consumed)
				}
			} else {
				data.consumed = Number(data.consumed)
			}
		}
	},

	scopes: {
		full: {
			attributes: ['id', 'os_id', 'consumed'],
			include: [
				{
					model: Resource,
					as: 'resource',
					attributes: ['id', 'description']
				}
			]
		}
	}
})

export { OSResource }

