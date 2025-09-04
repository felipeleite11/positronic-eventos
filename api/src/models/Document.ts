import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'
import { DocumentType } from './DocumentType'
import { File } from './File'

class Document extends Model<InferAttributes<Document>, InferCreationAttributes<Document>> {
	declare id: CreationOptional<number>
	declare identifier?: string
	declare extra_data?: string | object
	declare type_id: number
	declare person_id: number
	declare file_id?: number

	declare extra_data_obj?: object
	declare file?: File
	declare type?: DocumentType
}

Document.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	identifier: DataTypes.STRING,
	extra_data: DataTypes.TEXT,
	type_id: DataTypes.INTEGER,
	person_id: DataTypes.INTEGER,
	file_id: DataTypes.INTEGER
}, {
	sequelize,

	tableName: 'document',

	paranoid: true,

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			},
			include: [
				{
					model: DocumentType,
					as: 'type',
					attributes: ['id', 'description']
				},
				{
					model: File,
					as: 'file',
					attributes: ['id', 'link'],
					required: false
				}
			]
		}
	},

	hooks: {
		afterFind(data: null | Document | Document[]) {
			if (!data) {
				return
			}

			if (Array.isArray(data)) {
				for (const doc of data) {
					if (doc.extra_data) {
						doc.extra_data = JSON.parse(doc.extra_data as string)
					}
				}
			} else {
				if (data.extra_data) {
					data.extra_data = JSON.parse(data.extra_data as string)
				}
			}
		},

		beforeUpdate(data: Document) {
			data.extra_data = data.extra_data ? JSON.stringify(data.extra_data) : ''

			if(data.identifier) {
				data.identifier = data.identifier.trim()
			}
		},

		beforeSave(data: Document) {
			data.extra_data = data.extra_data ? JSON.stringify(data.extra_data) : ''

			if(data.identifier) {
				data.identifier = data.identifier.trim()
			}
		}
	}
})

export { Document }
