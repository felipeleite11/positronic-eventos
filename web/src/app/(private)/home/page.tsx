'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Meetup } from "@/types/Meetup"
import ManagedMeetups from "@/components/MeetupsLists/Subscribed"
import SubscribedMeetups from "@/components/MeetupsLists/Managed"
import FollowedMeetups from "@/components/MeetupsLists/Followed"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/services/api"
import { useSession } from "next-auth/react"

interface MeetupLists {
	managedEvents: Meetup[]
	subscribedEvents: Meetup[]
	followingEvents: Meetup[]
}

export default function Home() {
	const { data: session } = useSession()

	const personId = session?.user.person_id

	const { data: meetups } = useQuery<MeetupLists>({
		queryKey: ['get-meetups'],
		queryFn: async () => {
			const { data: response } = await api.get<Meetup[]>('meetup', {
				headers: {
					auth: session?.user.person_id
				}
			})

			const managedEvents = response.filter(meetup => meetup.creatorId === personId)
			const subscribedEvents = response.filter(meetup => meetup.subscriptions?.some(item => item.personId === personId))
			const followingEvents = response.filter(meetup => meetup.followers?.some(follower => follower.personId === personId))
			
			return {
				managedEvents,
				subscribedEvents,
				followingEvents
			}
		}
	})
	
	if(!meetups) {
		return (
			<div>Agaurde...</div>
		)
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-semibold text-xl">Eventos</h1>

			<Tabs defaultValue="managed" className="w-full">
				<TabsList className="bg-slate-850 mb-2">
					<TabsTrigger value="managed" className="cursor-pointer text-[0.8rem] p-4">Administração</TabsTrigger>
					<TabsTrigger value="subscribed" className="cursor-pointer text-[0.8rem] p-4">Participação</TabsTrigger>
					<TabsTrigger value="followed" className="cursor-pointer text-[0.8rem] p-4">Acompanhamento</TabsTrigger>
				</TabsList>

				<TabsContent value="managed" className="flex flex-col gap-6 pt-4">
					<ManagedMeetups meetups={meetups.managedEvents} />
				</TabsContent>

				<TabsContent value="subscribed" className="flex flex-col gap-6 pt-4">
					<SubscribedMeetups meetups={meetups.subscribedEvents} />
				</TabsContent>

				<TabsContent value="followed" className="flex flex-col gap-6 pt-4">
					<FollowedMeetups meetups={meetups.followingEvents} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
