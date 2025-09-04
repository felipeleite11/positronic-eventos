import { string } from "yup"
import { errors } from "./errors"

interface ArrayOrderProps {
	direction?: 'asc' | 'desc'
	key?: string
}

function orderCallback<T>(a: T, b: T, direction: 'asc' | 'desc' = 'asc', key?: string): -1 | 0 | 1 {
	const isAscending = direction === 'asc'

	if (!key) {
		if (a < b) return isAscending ? -1 : 1
		if (b < a) return isAscending ? 1 : -1
		return 0
	}

	const keyLevels = key.split('.')

	let aValue = (a as any)
	let bValue = (b as any)

	for (const k of keyLevels) {
		aValue = aValue[k]
		bValue = bValue[k]
	}

	if (aValue < bValue) return isAscending ? -1 : 1
	if (bValue < aValue) return isAscending ? 1 : -1
	return 0
}

export function order<T>(array: T[], options?: ArrayOrderProps): T[] {
	return array.sort((a: T, b: T) => {
		return orderCallback<T>(a, b, options?.direction, options?.key)
	}) as T[]
}


export function orderCode<T>(array: T[], key: string): T[] {
	const arrayCopy = [...array]

	return arrayCopy.sort((a: T, b: T) => {
		const keyLevels = key.split('.')

		let aValue = (a as any)
		let bValue = (b as any)

		for (const k of keyLevels) {
			aValue = aValue[k]
			bValue = bValue[k]
		}

		const codeA = aValue.split('.').map(Number)
		const codeB = bValue.split('.').map(Number)

		for (var i = 0; i < Math.min(codeA.length, codeB.length); i++) {
			if (codeA[i] !== codeB[i]) {
				return codeA[i] - codeB[i]
			}
		}
		
		return codeA.length - codeB.length
	}) as T[]
}

export function removeDuplicated<T>(array: any[], key = 'id'): T[] {
	return array.reduce((result, current) => {
		if(!key) {
			if(result.includes(current)) {
				return result
			} else {
				return [
					...result,
					current
				]
			}
		}

		if (result.map((i: any) => i[key]).includes(current[key])) {
			return result
		}

		return [
			...result,
			current
		]
	}, [] as T[])
}

interface HasSameValuesOptions {
	ignoreAccentuation?: boolean
	ignoreCase?: boolean
	strictOrder?: boolean
}

export function hasSameValues(array1: any[], array2: any[], options?: HasSameValuesOptions) {
	const everyItemsContain = array1.every(i => array2.includes(i)) && array2.every(i => array1.includes(i))

	if (options?.ignoreAccentuation) {
		array1 = array1.map(item => typeof item === 'string' ? item.removeAccentuation() : item)
		array2 = array2.map(item => typeof item === 'string' ? item.removeAccentuation() : item)
	} else if (!everyItemsContain) {
		throw new errors.ARRAY('Acentuação incorreta.')
	}

	if (options?.ignoreCase) {
		array1 = array1.map(item => typeof item === 'string' ? item.toLowerCase() : item)
		array2 = array2.map(item => typeof item === 'string' ? item.toLowerCase() : item)
	} else if (!everyItemsContain) {
		throw new errors.ARRAY('Case incorreto.')
	}

	if (options?.strictOrder) {
		if (!array1.every((item, idx) => item === array2[idx])) {
			throw new errors.ARRAY('Ordem incorreta.')
		}
	} else if (!everyItemsContain) {
		throw new errors.ARRAY('Quantidade de itens incompatível.')
	}

	return true
}
