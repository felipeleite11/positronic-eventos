import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class OSFile extends Model<InferAttributes<OSFile>, InferCreationAttributes<OSFile>> {
	declare id: CreationOptional<number>
	declare os_id: number
	declare file_id: number
	declare at_moment?: 'start' | 'end'
}

OSFile.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	os_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	file_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	at_moment: {
		type: DataTypes.STRING
	}
}, {
	sequelize,

	tableName: 'os_file',

	paranoid: true
})

export { OSFile }

