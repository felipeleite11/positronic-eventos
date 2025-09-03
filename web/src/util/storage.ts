'use client'

import { events, people } from "@/seed-data"
import { Event } from "@/types/Event"
import { normalizeText } from "./string"

const storageKey = 'positronic-eventos:data'

function updateEvent(event: Partial<Event>) {
	const dataString = localStorage.getItem(storageKey)

	if(dataString) {
		const events = JSON.parse(dataString) as Event[]

		const foundEvent = events.find(evt => evt.id === event.id)

		if(foundEvent) {
			Object.assign(foundEvent, event)
		}

		const updatedEvents = [
			...events.filter(evt => evt.id !== event.id),
			foundEvent
		]

		localStorage.setItem(storageKey, JSON.stringify(updatedEvents))
	}
}

export function checkSeedDataOnStorage(): Event[] {
	const data = localStorage.getItem(storageKey)

	if(!data) {
		const eventsString = JSON.stringify(events)

		localStorage.setItem(storageKey, eventsString)

		return events
	}

	return JSON.parse(data) as Event[]
}

export function getNextEventId() {
	const dataString = localStorage.getItem(storageKey)

	if(dataString) {
		const events = JSON.parse(dataString) as Event[]

		const lastId = events.length ? Math.max(...events.map(event => event.id)) : 0

		return lastId + 1
	} else {
		const events = checkSeedDataOnStorage()

		return events.at(-1)!.id + 1
	}
}

export function addEvent(event: Event) {
	const dataString = localStorage.getItem(storageKey)

	if(dataString) {
		const events = JSON.parse(dataString)

		events.push(event)

		localStorage.setItem(storageKey, JSON.stringify(events))

		return events
	} else {
		const events = checkSeedDataOnStorage()

		events.push(event)

		localStorage.setItem(storageKey, JSON.stringify(events))

		return events
	}
}

export function searchEvent(search: string): Event[] {
	const dataString = localStorage.getItem(storageKey)

	if(dataString) {
		const events = JSON.parse(dataString) as Event[]

		return events.filter(event => normalizeText(event.name).includes(normalizeText(search)))
	}

	return []
}

export function getEventById(id: number) {
	const dataString = localStorage.getItem(storageKey)

	if(dataString) {
		const events = JSON.parse(dataString) as Event[]

		return events.find(event => event.id === id)
	}
	
	return undefined
}

export function subscribe(event: Event, person: Person) {
	const dataString = localStorage.getItem(storageKey)

	if(dataString) {
		const events = JSON.parse(dataString) as Event[]

		const foundEvent = events.find(evt => evt.id === event.id)

		if(foundEvent) {
			if(foundEvent.participants) {
				if(foundEvent.participants.some(part => part.id === person.id)) {
					throw new Error('Você já está inscrito neste evento.')
				}

				foundEvent.participants.push(person)
			} else {
				foundEvent.participants = [person]
			}

			updateEvent(foundEvent)

			return
		}

		throw new Error('Este evento não foi encontrado.')
	}

	throw new Error('Este evento não foi encontrado.')
}

export function toggleLike(event: Event, person: Person) {
	const dataString = localStorage.getItem(storageKey)

	if(dataString) {
		const events = JSON.parse(dataString) as Event[]

		const foundEvent = events.find(evt => evt.id === event.id)

		if(foundEvent) {
			if(foundEvent.likes) {
				const alreadyLiked = foundEvent.likes.some(part => part.id === person.id)

				if(alreadyLiked) {
					foundEvent.likes = foundEvent.likes.filter(like => like.id !== person.id)
				} else {
					foundEvent.likes.push(person)
				}
			} else {
				foundEvent.likes = [person]
			}

			updateEvent(foundEvent)

			return
		}

		throw new Error('Este evento não foi encontrado.')
	}

	throw new Error('Este evento não foi encontrado.')
}

export function getPersonById(id: number) {
	return people.find(person => person.id === id)
}