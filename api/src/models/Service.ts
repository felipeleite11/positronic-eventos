import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { ServiceCategory } from './ServiceCategory'
import { ServiceQuote } from './ServiceQuote'
import { Font } from './Font'
import { OS } from './OS'
import { OSService } from './OSService'
import { OSExtraService } from './OSExtraService'

class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>> {
	declare id: CreationOptional<number>
	declare description: string
	declare category_id: number
	declare code: string
	declare font_id?: number

	declare category: NonAttribute<ServiceCategory>
	declare quotes: NonAttribute<ServiceQuote[]>
	declare quote: NonAttribute<ServiceQuote>
	declare font: NonAttribute<Font>
	declare oss: NonAttribute<OS[]>
	declare os_service: NonAttribute<OSService>
	declare os_extra_service: NonAttribute<OSExtraService>
}

Service.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	code: {
		type: DataTypes.STRING,
		allowNull: false
	},
	category_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	font_id: {
		type: DataTypes.STRING
	}
}, {
	sequelize,

	tableName: 'service',

	paranoid: true,

	scopes: {
		basic: {
			attributes: {
				exclude: ['created_at', 'updated_at', 'deleted_at']
			}
		}
	}
})

Service.addScope('full', {
	attributes: ['id', 'description', 'code'],
	include: [
		{
			model: Font,
			as: 'font',
			attributes: ['id', 'description']
		}
	],
	order: [['description', 'asc']]
})

export { Service }

