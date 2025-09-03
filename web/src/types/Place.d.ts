interface Place {
	id: number
	name: string
	address: Partial<Address>
	address_text?: string
}