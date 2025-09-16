export interface Meetup {
	id: number
	title: string
	description?: string
	status: 'agendado' | 'em curso' | 'finalizado' | 'cancelado'
	datetime: string
	period: {
		start: string
		end: string
	}
	place: Partial<Place>
	category?: string
	image?: string
	available_subscriptions?: number
	creator: Person
	creatorId: string
	address?: Address
	subscriptions?: {
		id: string
		personId: string
	}[]
	likes?: Person[]
}
