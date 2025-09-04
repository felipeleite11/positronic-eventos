import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { ContactType } from './ContactType'
import { Person } from './Person'

class Contact extends Model<InferAttributes<Contact>, InferCreationAttributes<Contact>> {
	declare id: CreationOptional<number>
	declare contact: string
	declare type_id: number
	declare person_id: number

	declare type: NonAttribute<ContactType>
	declare person: NonAttribute<Person>
}

Contact.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	contact: DataTypes.STRING,
	type_id: DataTypes.INTEGER,
	person_id: DataTypes.INTEGER
}, { 
	sequelize,

	tableName: 'contact',

	paranoid: true,

	hooks: {
		afterFind(data: any) {
			if(!data) {
				return data
			}

			if(Array.isArray(data)) {
				for(const item of data) {
					
				}
			} else {
				
			}
		},

		beforeCreate(data: Contact) {
			data.contact = data.contact.trim()
		},

		beforeUpdate(data: Contact) {
			data.contact = data.contact.trim()
		}
	},

	scopes: {
		full: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

export { Contact }

