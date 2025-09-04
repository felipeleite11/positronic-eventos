import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class Report extends Model<InferAttributes<Report>, InferCreationAttributes<Report>> {
	declare id: CreationOptional<number>
	declare identifier: string
	declare type: string
	declare generator: string
}

Report.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	identifier: {
		type: DataTypes.STRING,
		allowNull: false
	},
	generator: {
		type: DataTypes.STRING,
		allowNull: false
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'report',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

export { Report }
