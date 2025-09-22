import { Meetup } from "./Meetup"

interface Subscription {
	id: string
	personId: string
	meetupId: string
	certificateLink: string
	presenceConfirmation: boolean
	person: Person
	meetupRole?: Role
	meetup?: Meetup
}