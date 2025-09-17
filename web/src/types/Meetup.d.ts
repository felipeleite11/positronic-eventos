export interface Meetup {
	id: string
	title: string
	description?: string
	status: 'created' | 'in_subscription' | 'in_progress' | 'finished' | 'cancelled'
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
	invites?: {
		person: Person
		personId: string
		meetupId: string
		link: string
	}[]
	followers?: MeetupFollowing[]
}

interface MeetupFollowing {
	id: string
	meetupId: string
	personId: string
}