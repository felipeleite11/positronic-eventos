import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize'

import sequelize from './_connection'
import { ServiceCategory } from './ServiceCategory'
import { ServiceQuote } from './ServiceQuote'

interface ServiceConsumption {
	id: number
	description: string
	quotes?: ServiceQuote[]
	os_service: number
	category: ServiceCategory
	quantity: number
	consumed?: number
	start?: string
	end?: string
}

interface ExtraServiceConsumption {
	service: number
	consumed?: number
	start?: string
	end?: string
}

export interface ExecutionDataProps {
	report: string
	finalOpinion: string
	observationNoExecution: string
	services: ServiceConsumption[],
	extra_services: ExtraServiceConsumption[],
	aditional_info: {
		[key: string]: string | number
	},
	resources: {
		resource: string
		quantity: number
		unit: string
	}[]
}

class OSExecutionTempData extends Model<InferAttributes<OSExecutionTempData>, InferCreationAttributes<OSExecutionTempData>> {
	declare id: CreationOptional<number>
	declare data: string
	declare os_id: number

	declare data_obj: NonAttribute<ExecutionDataProps>
}

OSExecutionTempData.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	data: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: '{}'
	},
	os_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	sequelize,

	tableName: 'os_execution_temp_data',

	paranoid: true,

	hooks: {
		afterFind(data: any) {
			if (!data) {
				return data
			}

			if (Array.isArray(data)) {
				for (const item of data) {
					item.data_obj = JSON.parse(item.data)
				}
			} else {
				data.data_obj = JSON.parse(data.data)
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

OSExecutionTempData.addScope('full', {
	attributes: ['id', 'os_id', 'data']
})

export { OSExecutionTempData }

