export function normalizeText(text: string) {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
}

export function extractNumbers(text: string) {
	return text.replace(/\D/g, '')
}