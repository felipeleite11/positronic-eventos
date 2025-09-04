import { errors } from "./errors"

export function contains(this: string, substring: string) {
	const specialCharsRegex = /[\u0300-\u036f]/g
	const normalizedString = this.normalize('NFD').replace(specialCharsRegex, '').toLowerCase()
	const normalizedSubstring = substring.normalize('NFD').replace(specialCharsRegex, '').toLowerCase()

	const regex = new RegExp(normalizedSubstring, 'g')

	return regex.test(normalizedString)
}

export function searchInString(collection: any[], searchTerm: string, key: string = 'person.name') {
	const searchWords = searchTerm.toLowerCase().split(' ')
	const keys = key.split('.')

	const filtered = collection?.filter(item => {
		let obj = item

		for(const k of keys) {
			obj = obj[k]
		}

		const source: string = obj.toLowerCase()

		return searchWords.every(word => source.contains(word))
	}) || []

	return filtered
}

export function nameToLogin(name: string) {
	const words = name.split(' ')

	const [firstname] = words
	const lastName = words.at(-1)

	if(words.length === 1) {
		return firstname
	}

	return `${firstname.toLowerCase()}.${lastName?.toLowerCase()}`
}

export function capitalize(text: string) {
	const first = text[0]
	const rest = text.substring(1)

	return `${first.toUpperCase()}${rest}`
}

export function removeSpecialChars(this: string) {
	return this.replaceAll(/[._,\- ]/g, '')
}

export function unmaskCurrency(value: string|number) {
	if(!value) {
		throw new errors.INVALID_DATA
	}

	const cleanValue = String(value).replace(/\s/g, '').replace(/R\$( )?/g, '').replace(/\./g, '').replace(',', '.')

	const numberValue = Number(cleanValue)
	
	return isNaN(numberValue) ? 0 : numberValue
}

export function changeDotByComma(value: number | string | undefined) {
	if(value === undefined) {
		return ''
	}

	value = String(value)
		
	return value.replace('.', ',')
}

export function removeAccentuation(this: string) {
	return this.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

declare global {
    interface String {
        removeSpecialChars(this: string): string
        contains(this: string, substring: string): boolean
		removeAccentuation(this: string): string
    }
}

String.prototype.removeSpecialChars = removeSpecialChars
String.prototype.contains = contains
String.prototype.removeAccentuation = removeAccentuation
