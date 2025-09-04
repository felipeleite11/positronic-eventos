import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class Font extends Model<InferAttributes<Font>, InferCreationAttributes<Font>> {
	declare id: CreationOptional<number>
	declare description: string
}

Font.init({
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

	tableName: 'service_font',

	paranoid: true
})

export { Font }

