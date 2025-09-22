import { evolution } from "../config/evolution"

interface WhatsappSendProps {
	number: string
	text: string
}

export async function whatsappSend(data: WhatsappSendProps) {
	if(!data.number || !data.text) {
		throw new Error('Erro ao enviar convites.')
	}

	await evolution.post('/', data)
}