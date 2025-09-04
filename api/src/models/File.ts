import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class File extends Model<InferAttributes<File>, InferCreationAttributes<File>> {
	declare id: CreationOptional<number>
	declare link: string
}

File.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	link: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	sequelize,

	tableName: 'file',

	paranoid: true,

	scopes: {
		full: {
			attributes: ['id', 'link']
		}
	}
})

export { File }

