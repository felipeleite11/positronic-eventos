'use client'

import { useContext, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Event } from "@/types/Event"
import { checkSeedDataOnStorage } from "@/util/storage"
import { GlobalContext } from "@/contexts/GlobalContext"
import SubscribedEvents from "@/components/EventLists/Subscribed"
import ManagedEvents from "@/components/EventLists/Managed"
import FollowedEvents from "@/components/EventLists/Followed"

export default function Home() {
	const { person } = useContext(GlobalContext)

	const [managedEvents, setManagedEvents] = useState<Event[]>([])
	const [subscribedEvents, setSubscribedEvents] = useState<Event[]>([])
	const [followedEvents, setFollowedEvents] = useState<Event[]>([])

	useEffect(() => {
		const eventsOnDatabase = checkSeedDataOnStorage()

		if(eventsOnDatabase.length > 0) {
			setManagedEvents(eventsOnDatabase.filter(event => event.creator.id === person?.id))
			setSubscribedEvents(eventsOnDatabase.filter(event => event.participants?.some(part => part.id === person?.id)))
			setFollowedEvents(eventsOnDatabase.filter(event => event.likes?.some(like => like.id === person?.id)))
		}
	}, [])

	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-semibold text-xl">Eventos</h1>

			<Tabs defaultValue="managed" className="w-full">
				<TabsList className="bg-slate-850 mb-2">
					<TabsTrigger value="managed" className="cursor-pointer text-[0.8rem] p-4">Administração</TabsTrigger>
					<TabsTrigger value="subscribed" className="cursor-pointer text-[0.8rem] p-4">Participações</TabsTrigger>
					<TabsTrigger value="followed" className="cursor-pointer text-[0.8rem] p-4">Acompanhamento</TabsTrigger>
				</TabsList>

				<TabsContent value="managed" className="flex flex-col gap-6 pt-4">
					<ManagedEvents events={managedEvents} />
				</TabsContent>

				<TabsContent value="subscribed" className="flex flex-col gap-6 pt-4">
					<SubscribedEvents events={subscribedEvents} />
				</TabsContent>

				<TabsContent value="followed" className="flex flex-col gap-6 pt-4">
					<FollowedEvents events={followedEvents} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
