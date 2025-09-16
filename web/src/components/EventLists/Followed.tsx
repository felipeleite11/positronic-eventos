import React from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Meetup } from '@/types/Meetup'

interface EventListProps {
	meetups: Meetup[]
}

export default function FollowedEvents({ meetups }: EventListProps) {
	const router = useRouter()

	function handleOpenEvent(meetup: Meetup) {
		router.push(`/meetup/${meetup.id}`)
	}

	if(meetups.length === 0) {
		return <div className="text-sm text-slate-400 italic mx-5">Você não está acompanhando nenhum evento.</div>
	}

	return (
		<>
			<p className="mx-5 text-slate-700 dark:text-slate-200 text-sm">Aqui você verá todos os eventos que optou por acompanhar. Dessa forma, receberá notificações de atualizações de cada evento.</p>
		
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="lg:w-80">Nome</TableHead>
						<TableHead>Data / hora</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="lg:w-80">Local</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{meetups.map(item => (
						<TableRow 
							key={item.id} 
							onClick={() => { handleOpenEvent(item) }} 
							className="cursor-pointer"
						>
							<TableCell className="font-semibold">
								<div className="lg:w-80 truncate">
									{item.title}
								</div>
							</TableCell>
							<TableCell>{item.datetime}</TableCell>
							<TableCell>{item.status}</TableCell>
							<TableCell>
								<div className="lg:w-80 truncate">
									{item.place.name}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	)
}
