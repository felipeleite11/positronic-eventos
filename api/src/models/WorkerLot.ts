import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class WorkerLot extends Model<InferAttributes<WorkerLot>, InferCreationAttributes<WorkerLot>> {
	declare id: CreationOptional<number>
	declare worker_id: number
	declare lot_id: number
}

WorkerLot.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	worker_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	lot_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	sequelize,

	tableName: 'worker_lot',

	paranoid: true,

	scopes: {
		full: {
			attributes: ['id', 'lot_id', 'worker_id']
		}
	}
})

export { WorkerLot }

