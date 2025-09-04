import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class ContactType extends Model<InferAttributes<ContactType>, InferCreationAttributes<ContactType>> {
	declare id: CreationOptional<number>
	declare description: string
}

ContactType.init({
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

	tableName: 'contact_type',

	paranoid: true,

	hooks: {
		afterFind(data: any) {
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
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

export { ContactType }

export const ContactTypes = {
	EMAIL: 1,
	WHATSAPP: 2,
	PHONE: 3
}