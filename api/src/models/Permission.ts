import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'

class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
	declare id: CreationOptional<number>
	declare description: string
	declare route: string
	declare icon: string
	declare parent_id: number

	declare parent: NonAttribute<Permission>
}

Permission.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING
	},
	route: {
		type: DataTypes.STRING,
		validate: {
			is: {
				args: /^(\/)/i,
				msg: 'Rota inválida (deve começar com /).'
			}
		}
	},
	parent_id: {
		type: DataTypes.INTEGER
	},
	icon: {
		type: DataTypes.STRING
	}
}, {
	sequelize,

	tableName: 'permission',

	paranoid: true,

	scopes: {
		full: {
			attributes: ['id', 'description', 'icon', 'route'],
			include: [
				{
					model: Permission,
					as: 'parent',
					attributes: ['id', 'description', 'icon', 'route'],
					required: false
				}
			]
		}
	}
})

export { Permission }

