import { ContactTypes } from "../models/ContactType"
import { DocumentTypes } from "../models/DocumentType"

const dataTypes = {
	...ContactTypes,
	...DocumentTypes
}

const regexes = [
	{ regex: /^\(\d{2}\) \d{5}-\d{4}$/g, data_type_id: dataTypes.WHATSAPP },
	{ regex: /^\(\d{2}\) \d{4}-\d{4}$/g, data_type_id: dataTypes.PHONE },
	{ regex: /^[a-z0-9-_.+]+@\w+\.\w+(\.\w+)?$/g, data_type_id: dataTypes.EMAIL },
	{ regex: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/g, data_type_id: dataTypes.CNPJ },
	{ regex: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/g, data_type_id: dataTypes.CPF }
]

interface CurrencyProps {
	withSymbol?: boolean
	decimals?: number
}

export function currency(value: number|string|undefined, options?: CurrencyProps) {
	if(!value && value !== 0) {
		return ''
	}
	
	const withSymbol = options?.withSymbol !== false

	const parsed = Number(value).toLocaleString('pt-BR', {
		currency: 'BRL',
		style: 'currency',
		maximumFractionDigits: options?.decimals || 2
	})

	if(withSymbol) {
		return parsed
	}

	const withoutSymbol = parsed.substring(3)
	
	return withoutSymbol
}

export function applyCPFMask(value: string) {
	if(value.length !== 11) {
		return value
	}

	const parts = [
		value.substring(0, 3),
		value.substring(3, 6),
		value.substring(6, 9),
		value.substring(9, 11)
	]

	let temp = parts.join('.')

	const lastDot = temp.lastIndexOf('.')

	return `${temp.substring(0, lastDot)}-${temp.substring(lastDot + 1)}`
}

export function identifyDataType(value: string) {
	value = value.trim()

	const type = regexes.find(item => item.regex.test(value))?.data_type_id

	const dataType = regexes.find(item => item.regex.test(value))?.data_type_id
	
	return type
}
