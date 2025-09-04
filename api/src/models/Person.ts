import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'

import { User } from './User'
import { Address } from './Address'
import { Contact } from './Contact'
import { ContactType } from './ContactType'
import { Document } from './Document'
import { DocumentType } from './DocumentType'
import { Rule } from './Rule'
import { Team } from './Team'
import { File } from './File'
import { ContractLot } from './ContractLot'

export type PersonType = 'admin' | 'company' | 'worker' | 'default'

class Person extends Model<InferAttributes<Person>, InferCreationAttributes<Person>> {
	declare id: CreationOptional<number>
	declare name: string
	declare type: PersonType
	declare nick?: string
	declare company_id?: number
	declare address_id?: number
	declare rule_id?: number

	declare address: NonAttribute<Address>
	declare contacts: NonAttribute<Contact[]>
	declare user: NonAttribute<User>
	declare company: NonAttribute<Person>
	declare documents: NonAttribute<Document[]>

	get short_name(): NonAttribute<string> {
		const words = this.name.split(' ')
		const firstName = words[0]
		const lastName = words[words.length - 1]

		return `${firstName} ${lastName}`
	}
}

Person.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		unique: {
			msg: 'Já existe uma pessoa com o nome especificado.',
			name: 'name'
		}
	},
	type: {
		type: DataTypes.ENUM,
		values: ['company', 'worker', 'default'],
		validate: {
			isIn: {
				args: [['company', 'worker', 'default']],
				msg: 'O tipo de pessoa deve ser company ou worker.'
			}
		}
	},
	nick: {
		type: DataTypes.STRING
	}
}, {
	sequelize,

	tableName: 'person',

	paranoid: true,

	hooks: {
		beforeCreate(data) {
			data.name = data.name.trim()
			data.nick = data.nick?.trim()
		}
	},

	scopes: {
		basic: {
			attributes: ['id', 'name', 'nick', 'type']
		},

		full: {
			attributes: ['id', 'name', 'nick', 'type'],
			include: [
				{
					model: ContractLot,
					as: 'lots',
					attributes: ['id', 'description'],
					through: { attributes: [] },
					required: false
				},
				{
					model: Rule,
					as: 'rule',
					attributes: ['id', 'description'],
					required: false
				},
				{
					model: Team,
					as: 'teams',
					through: { attributes: [] },
					attributes: ['id'],
					required: false,
					include: [
						{
							model: Person,
							as: 'supervisor',
							attributes: ['id', 'name']
						}
					]
				},
				{
					model: Person,
					as: 'company',
					attributes: ['id', 'name', 'nick'],
					required: false,
					include: [
						{
							model: Address,
							as: 'address',
							attributes: ['id', 'zipcode', 'state', 'city', 'district', 'street', 'number', 'complement']
						}
					]
				},
				{
					model: Address,
					as: 'address',
					attributes: ['id', 'zipcode', 'state', 'city', 'district', 'street', 'number', 'complement']
				},
				{
					model: Contact,
					as: 'contacts',
					attributes: ['id', 'contact'],
					include: [
						{
							model: ContactType,
							as: 'type',
							attributes: ['id', 'description']
						}
					]
				},
				{
					model: Document,
					as: 'documents',
					attributes: ['id', 'identifier'],
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
			]
		},

		'/contracts.[update].person': {
			attributes: ['id', 'name'],
			where: {
				type: 'company'
			}
		}
	}
})

export { Person }

