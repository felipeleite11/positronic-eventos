'use client'

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Event } from "@/types/Event"
import { checkSeedDataOnStorage } from "@/util/storage"
import { GlobalContext } from "@/contexts/GlobalContext"

export default function Home() {
	const { person } = useContext(GlobalContext)

	const router = useRouter()

	const [myEventsList, setMyEventsList] = useState<Event[]>([])
	const [eventsParticipation, setEventsParticipation] = useState<Event[]>([])

	function handleOpenEvent(event: Event) {
		router.push(`/event/${event.id}`)
	}

	useEffect(() => {
		const eventsOnDatabase = checkSeedDataOnStorage()

		if(eventsOnDatabase.length > 0) {
			setMyEventsList(eventsOnDatabase.filter(event => event.creator.id === person?.id))
			setEventsParticipation(eventsOnDatabase.filter(event => event.participants?.some(part => part.id === person?.id)))
		}
	}, [])

	return (
		<Tabs defaultValue="events" className="w-full">
			<TabsList className="bg-slate-850">
				<TabsTrigger value="events" className="cursor-pointer">Meus eventos</TabsTrigger>
				<TabsTrigger value="participations" className="cursor-pointer">Eventos que participo</TabsTrigger>
			</TabsList>

			<TabsContent value="events">
				{myEventsList.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="lg:w-80">Nome</TableHead>
								<TableHead>Data / hora</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="lg:w-80">Local</TableHead>
								<TableHead className="text-right">Participantes</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{myEventsList.map(item => (
								<TableRow key={item.id} onClick={() => { handleOpenEvent(item) }} className="cursor-pointer">
									<TableCell className="font-semibold">
										<div className="lg:w-80 truncate">
											{item.name}
										</div>
									</TableCell>
									<TableCell>{item.period.start}</TableCell>
									<TableCell>{item.status}</TableCell>
									<TableCell>
										<div className="lg:w-80 truncate">
											{item.place.address_text || ''}
										</div>
									</TableCell>
									<TableCell className="text-right">{item.available_subscriptions}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="text-sm text-slate-400 italic my-6 mx-3">Você ainda não criou nenhum evento.</div>
				)}
			</TabsContent>

			<TabsContent value="participations">
				{eventsParticipation.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="lg:w-80">Nome</TableHead>
								<TableHead>Data / hora</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="lg:w-80">Local</TableHead>
								<TableHead className="text-right">Participantes</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{eventsParticipation.map(item => (
								<TableRow key={item.id} onClick={() => { handleOpenEvent(item) }} className="cursor-pointer">
									<TableCell className="font-semibold">
										<div className="lg:w-80 truncate">
											{item.name}
										</div>
									</TableCell>
									<TableCell>{item.period.start}</TableCell>
									<TableCell>{item.status}</TableCell>
									<TableCell>
										<div className="lg:w-80 truncate">
											{item.place.address_text || ''}
										</div>
									</TableCell>
									<TableCell className="text-right">{item.available_subscriptions}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="text-sm text-slate-400 italic my-6 mx-3">Você não está inscrito em nenhum evento.</div>
				)}
			</TabsContent>
		</Tabs>
	)
}
