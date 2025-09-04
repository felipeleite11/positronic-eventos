import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { User } from './User'

class Notification extends Model<InferAttributes<Notification>, InferCreationAttributes<Notification>> {
	declare id: CreationOptional<number>
	declare is_read: CreationOptional<boolean>
	declare content: string
	declare title: string
	declare user_id: number
	
	declare user: NonAttribute<User>
}

Notification.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	is_read: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	content: {
		type: DataTypes.STRING(2000),
		allowNull: false
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'notification',

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
				exclude: ['updated_at', 'deleted_at']
			}
		}
	}
})

Notification.addScope('full', {
	attributes: ['id']
})

export { Notification }

