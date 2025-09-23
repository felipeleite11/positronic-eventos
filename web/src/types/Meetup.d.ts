export interface Meetup {
	id: string
	title: string
	description?: string
	location_name?: string
	status: 'created' | 'in_subscription' | 'in_progress' | 'finished' | 'cancelled'
	start: string
	end: string
	place: Partial<Place>
	category?: Category
	image?: string
	workload?: string
	available_subscriptions?: number
	creator: Person
	creatorId: string
	address?: Address
	subscriptions?: Subscription[]
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