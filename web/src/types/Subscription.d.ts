interface Subscription {
	id: string
	personId: string
	meetupId: string
	presenceConfirmation: boolean
	person: Person
}