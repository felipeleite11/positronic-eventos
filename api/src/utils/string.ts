export function normalizeText(text: string) {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
}

export function extractNumbers(text: string | null) {
	if (!text) {
		return ''
	}

	return text.replace(/\D/g, '')
}

export function fillTemplate(template: string, data: any) {
	let result = template

	for (const key in data) {
		const regex = new RegExp(`\\[${key}\\]`, 'g')

		result = result.replace(regex, data[key])
	}

	return result
}

export function fillTemplateForPDFMake(template: string, data: Record<string, string | number>) {
	// 1️⃣ Substituir os placeholders pelo valor correspondente
	let filled = template;
	for (const key in data) {
		const regex = new RegExp(`\\[${key}\\]`, 'g');
		filled = filled.replace(regex, String(data[key]));
	}

	// 2️⃣ Gerar array de objetos { text, bold } onde os valores substituídos ficam bold
	const regex = /([^\[]+)|([^\]]+)/g;
	const result: { text: string; bold?: boolean }[] = [];

	let lastIndex = 0;
	// Percorremos o template original para saber onde estão os placeholders
	const placeholderRegex = /\[([^\]]+)\]/g;
	let match: RegExpExecArray | null;

	while ((match = placeholderRegex.exec(template)) !== null) {
		// Texto antes do placeholder
		if (match.index > lastIndex) {
			result.push({ text: template.slice(lastIndex, match.index) });
		}

		// Texto do placeholder substituído, em bold
		const key = match[1];
		const value = data[key] ?? match[0];
		result.push({ text: String(value), bold: true });

		lastIndex = match.index + match[0].length;
	}

	// Texto após o último placeholder
	if (lastIndex < template.length) {
		result.push({ text: template.slice(lastIndex) });
	}

	return result;
}
