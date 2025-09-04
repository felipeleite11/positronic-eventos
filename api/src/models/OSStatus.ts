import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class OSStatus extends Model<InferAttributes<OSStatus>, InferCreationAttributes<OSStatus>> {
	declare id: CreationOptional<number>
	declare description: string
}

OSStatus.init({
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

	tableName: 'os_status',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

OSStatus.addScope('full', {
	attributes: ['id', 'description']
})

export { OSStatus }

export const OSStatusIds = {
	OPENED: 1,
	IN_PROGRESS: 2,
	EXECUTED: 3,
	FINISHED: 4
}

export const OSStatusDescription = {
	[OSStatusIds.OPENED]: 'Aberto',
	[OSStatusIds.IN_PROGRESS]: 'Em execução',
	[OSStatusIds.EXECUTED]: 'Executado',
	[OSStatusIds.FINISHED]: 'Finalizado'
}
