import { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyRemoveAssociationMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'
import { Permission } from './Permission'

import sequelize from './_connection'

class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
	declare id: CreationOptional<number>
	declare description: string

	declare permissions: NonAttribute<Permission[]>

	declare addPermission: HasManyAddAssociationMixin<Permission, number>
	declare removePermission: HasManyRemoveAssociationMixin<Permission, number>
}

Profile.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		unique: {
			name: 'description',
			msg: 'Já existe este perfil.'
		}
	}
}, {
	sequelize,

	tableName: 'profile',

	paranoid: true,

	scopes: {
		full: {
			attributes: ['id', 'description'],
			include: [
				{
					model: Permission,
					as: 'permissions',
					attributes: ['id', 'description', 'route', 'icon'],
					through: { attributes: [] }
				}
			]
		}
	}
})

export { Profile }

export enum ProfilesIds {
	ADMIN = 1,
	MASTER = 2,
	EXECUTOR = 3,
	CREATOR = 5,
	ASSIGNER = 6,
	CONFIGURATOR = 7
}