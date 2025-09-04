import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class ContractServiceLoad extends Model<InferAttributes<ContractServiceLoad>, InferCreationAttributes<ContractServiceLoad>> {
	declare id: CreationOptional<number>
	declare link: string
	declare user_id: number
	declare contract_id: number | null
	declare lot_id: number | null
}

ContractServiceLoad.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	link: {
		type: DataTypes.STRING,
		allowNull: false
	},
	contract_id: {
		type: DataTypes.INTEGER
	},
	lot_id: {
		type: DataTypes.INTEGER
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'contract_service_load',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

export { ContractServiceLoad }
