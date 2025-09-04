import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { Person } from './Person'

class TeamPerson extends Model<InferAttributes<TeamPerson>, InferCreationAttributes<TeamPerson>> {
	declare id: CreationOptional<number>
	declare person_id: number
	declare team_id: number

	declare master: NonAttribute<Person>
}

TeamPerson.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	person_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	team_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, { 
	sequelize,

	tableName: 'team_person',

	paranoid: true
})

export { TeamPerson }

