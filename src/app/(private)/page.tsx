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
	const [subscribedEvents, setSubscribedEvents] = useState<Event[]>([])

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
		<div className="flex flex-col gap-6">
			<h1 className="font-semibold text-xl">Eventos</h1>

			<Tabs defaultValue="events" className="w-full">
				<TabsList className="bg-slate-850 mb-2">
					<TabsTrigger value="events" className="cursor-pointer text-[0.8rem] p-4">Administração</TabsTrigger>
					<TabsTrigger value="participations" className="cursor-pointer text-[0.8rem] p-4">Participações</TabsTrigger>
					<TabsTrigger value="subscribed" className="cursor-pointer text-[0.8rem] p-4">Acompanhamento</TabsTrigger>
				</TabsList>

				<TabsContent value="events" className="flex flex-col gap-6">
					<p className="mx-5 text-slate-200 text-sm">Aqui você verá todos os eventos que criou ou administra.</p>

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
												{item.place.name}
											</div>
										</TableCell>
										<TableCell className="text-right">{item.available_subscriptions}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-sm text-slate-400 italic my-6 mx-5">Você ainda não criou nenhum evento.</div>
					)}
				</TabsContent>

				<TabsContent value="participations" className="flex flex-col gap-6">
					<p className="mx-5 text-slate-200 text-sm">Aqui você verá todos os eventos nos quais está inscrito.</p>

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
												{item.place.name}
											</div>
										</TableCell>
										<TableCell className="text-right">{item.available_subscriptions}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-sm text-slate-400 italic my-6 mx-5">Você não está inscrito em nenhum evento.</div>
					)}
				</TabsContent>

				<TabsContent value="subscribed" className="flex flex-col gap-6">
					<p className="mx-5 text-slate-200 text-sm">Aqui você verá todos os eventos que optou por acompanhar. Dessa forma, receberá notificações de atualizações de cada evento.</p>

					{subscribedEvents.length > 0 ? (
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
								{subscribedEvents.map(item => (
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
												{item.place.name}
											</div>
										</TableCell>
										<TableCell className="text-right">{item.available_subscriptions}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="text-sm text-slate-400 italic my-6 mx-5">Você não está acompanhando nenhum evento.</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
