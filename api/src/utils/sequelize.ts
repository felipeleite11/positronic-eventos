import { Op, WhereOptions } from "sequelize"

import { errors } from "./errors"

interface SearchOptions {
	name_attribute?: string
	operator?: 'or'|'and'
	ignoreEmptySearch?: boolean
	exact?: boolean // Must correspond exactly with the string 
}

export function generateSearchInString(search: string|undefined, options?: SearchOptions): WhereOptions {
	if(!search?.trim()) {
		if(!options?.ignoreEmptySearch) {
			throw new errors.FILTER_REQUIRED('Passe um termo de busca para filtrar.')
		} else {
			return {}
		}
	}

	const words = search.split(' ')

	const nameAttribute = options?.name_attribute || 'name'

	if(options?.exact) {
		return {
			[Op[options?.operator || 'and']]: [
				{
					[nameAttribute]: search
				}
			]
		}
	}

	return {
		[Op[options?.operator || 'and']]: words.map(word => (
			{
				[nameAttribute]: {
					[Op.like]: `%${word}%`
				}
			}
		))
	}
}