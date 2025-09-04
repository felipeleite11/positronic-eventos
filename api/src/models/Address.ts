import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { OS } from './OS'

class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
	declare id: CreationOptional<number>
	declare zipcode: string
	declare state: string
	declare city: string
	declare district: string
	declare street: string
	declare number: string
	declare complement: string
	declare full_address?: string

	declare os?: NonAttribute<OS>

	get fullAddress(): NonAttribute<string> {
		return `${this.street}, ${this.number} ${this.complement ? `- ${this.complement}` : ''}- ${this.district} - ${this.city} - ${this.state} - ${this.zipcode}`
	}
}

Address.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	zipcode: DataTypes.STRING,
	state: DataTypes.STRING,
	city: DataTypes.STRING,
	district: DataTypes.STRING,
	street: DataTypes.STRING,
	number: DataTypes.STRING,
	complement: DataTypes.STRING
}, {
	sequelize,

	tableName: 'address',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	},

	hooks: {
		afterFind(data: any) {
			if (!data) {
				return data
			}

			if (Array.isArray(data)) {
				for (const item of data) {
					item.dataValues.full_address = item.fullAddress
				}
			} else {
				data.dataValues.full_address = data.fullAddress
			}
		}
	}
})

export { Address }

