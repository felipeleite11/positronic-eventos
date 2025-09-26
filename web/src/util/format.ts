export function formatAddress(address: Address | undefined) {
	if(!address) {
		return ''
	}

	let output = address.street

	if(address.number) {
		output += `, ${address.number}`
	}

	if(address.district) {
		output += ` - ${address.district}`
	}

	if(address.city && address.state) {
		output += ` - ${address.city} - ${address.state}`
	}

	if(address.zipcode) {
		output += ` - ${address.zipcode}`
	}

	if(address.complement) {
		output += ` - ${address.complement}`
	}

	return output
}

export function formatStatus(value: string) {
	switch(value) {
		case 'created': return 'Criado'
		case 'in_subscription': return 'Aceitando inscrições'
		case 'in_progress': return 'Em progresso'
		case 'finished': return 'Finaizado'
		case 'cancelled': return 'Cancelado'
	}
}
