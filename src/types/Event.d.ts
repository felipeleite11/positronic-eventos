export interface Event {
	id: number
	name: string
	description?: string
	status: 'agendado' | 'em curso' | 'finalizado' | 'cancelado'
	period: {
		start: string
		end: string
	}
	place: Partial<Place>
	category?: string
	image?: string
	available_subscriptions?: number
	creator: Person
	participants?: Person[]
}
