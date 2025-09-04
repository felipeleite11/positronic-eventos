import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class DocumentType extends Model<InferAttributes<DocumentType>, InferCreationAttributes<DocumentType>> {
	declare id: CreationOptional<number>
	declare description: string
}

DocumentType.init({
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

	tableName: 'document_type',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

export { DocumentType }

export const DocumentTypes = {
	CNPJ: 1,
	CPF: 2,
	Logo: 3
}