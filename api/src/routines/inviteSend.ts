export async function inviteSend({ event_id }: any) {
	await new Promise(r => setTimeout(r, 2500))
	
	console.log('inviteSend -> event_id', event_id)
	
	// throw new Error('Erro ao enviar convites.')
}