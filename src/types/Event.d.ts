export interface Event {
	id: number
	name: string
	description?: string
	status: 'agendado' | 'em curso' | 'finalizado' | 'cancelado'
	date: string
	place: Place
	category?: string
	image?: string
	available_subscriptions?: number
}
