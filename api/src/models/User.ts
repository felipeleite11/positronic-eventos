import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'
import bcrypt from 'bcryptjs'

import sequelize from './_connection'

import { Person } from './Person'
import { Profile } from './Profile'
import { Permission } from './Permission'
import { Restriction } from './Restriction'
import { Preference } from './Preference'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>
	declare login: string
	declare password: string
	declare person_id: number
	declare profile_id: number
	declare deleted_at: CreationOptional<Date | null>
	declare recover_token: CreationOptional<string | null>
	declare last_login_at: CreationOptional<Date>
	declare password_changed_at: CreationOptional<Date>

	declare instance_id: NonAttribute<string | null>
	declare profile: NonAttribute<Profile>
	declare person: NonAttribute<Person>
	declare permissions: NonAttribute<Permission[]>
	declare preferences: NonAttribute<Preference[]>
}

User.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	login: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	person_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	profile_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	last_login_at: {
		type: DataTypes.DATE
	},
	password_changed_at: {
		type: DataTypes.DATE
	},
	recover_token: {
		type: DataTypes.STRING
	},
	deleted_at: {
		type: DataTypes.DATE
	}
}, {
	sequelize,

	tableName: 'user',

	paranoid: true,

	scopes: {
		basic: {
			attributes: ['id', 'password_changed_at']
		},

		profile: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			},
			include: [
				{
					model: Person,
					as: 'person',
					attributes: ['id', 'name']
				},
				{
					model: Profile,
					as: 'profile',
					attributes: ['id', 'description']
				}
			]
		},

		full: {
			attributes: {
				exclude: ['created_at', 'updated_at']
			},
			include: [
				{
					model: Person,
					as: 'person',
					attributes: ['id', 'name', 'type']
				},
				{
					model: Profile,
					as: 'profile',
					attributes: ['id', 'description'],
					include: [
						{
							model: Permission,
							as: 'permissions',
							attributes: ['id', 'description', 'route', 'icon'],
							through: { attributes: [] },
							include: [
								{
									model: Permission,
									as: 'children',
									attributes: ['id', 'description', 'icon', 'route']
								}
							]
						},
						{
							model: Restriction,
							as: 'restrictions',
							attributes: ['id', 'description', 'identifier', 'is_finished'],
							include: [
								{
									model: Permission,
									as: 'permission',
									attributes: ['id', 'description']
								}
							]
						}
					]
				}
			]
		}
	},

	hooks: {
		async beforeSave(data) {
			if (data.password) {
				data.password = await bcrypt.hash(data.password, 8)
			}
		},

		async beforeBulkCreate(data) {
			for (const item of data) {
				if (item.password) {
					item.password = await bcrypt.hash(item.password, 8)
				}
			}
		}
	}
})

export { User }

