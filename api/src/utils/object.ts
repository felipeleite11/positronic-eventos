export function trim(list: any[]) {
	if (!Array.isArray(list)) {
		throw new Error('Input must be an array of objects.')
	}

	const trimmedList = list.map((obj: any) => {
		const trimmedObject: any = {}

		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				if (typeof obj[key] === 'string') {
					trimmedObject[key] = obj[key].trim()
				} else {
					trimmedObject[key] = obj[key]
				}
			}
		}

		return trimmedObject
	})

	return trimmedList
}
