import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { Person } from './Person'

class Team extends Model<InferAttributes<Team>, InferCreationAttributes<Team>> {
	declare id: CreationOptional<number>
	declare supervisor_id: number

	declare people: NonAttribute<Person[]>
	declare supervisor: NonAttribute<Person>
}

Team.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	supervisor_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'team',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['updated_at', 'deleted_at']
			}
		}
	}
})

Team.addScope('full', {
	attributes: ['id', 'created_at']
})

export { Team }

