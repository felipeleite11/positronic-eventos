import { evolution } from "../config/evolution"

export async function invitationSend(data: any) {
	if(!data.number || !data.text) {
		throw new Error('Erro ao enviar convites.')
	}

	await evolution.post('/', data)
}