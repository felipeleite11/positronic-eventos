import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { Profile } from './Profile'
import { Permission } from './Permission'

class Restriction extends Model<InferAttributes<Restriction>, InferCreationAttributes<Restriction>> {
	declare id: CreationOptional<number>
	declare description: string
	declare identifier: number
	declare profile_id: number
	declare is_finished: boolean

	declare profile: NonAttribute<Profile>
	declare permission: NonAttribute<Permission>
}

Restriction.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	identifier: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	profile_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	is_finished: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
}, { 
	sequelize,

	tableName: 'restriction',

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
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

Restriction.addScope('full', {
	attributes: ['id']
})

export { Restriction }

