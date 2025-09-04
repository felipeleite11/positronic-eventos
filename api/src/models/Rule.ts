import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import sequelize from './_connection'

class Rule extends Model<InferAttributes<Rule>, InferCreationAttributes<Rule>> {
	declare id: CreationOptional<number>
	declare description: string
}

Rule.init({
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

	tableName: 'rule',

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
		}
	},

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

Rule.addScope('full', {
	attributes: ['id', 'description']
})

export { Rule }

