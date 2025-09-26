import React from 'react'
import { useRouter } from 'next/navigation'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut
} from "@/components/ui/context-menu"
import { Meetup } from "@/types/Meetup"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { formatAddress, formatStatus } from '@/util/format'
import Link from 'next/link'
import { Edit, Eye } from 'lucide-react'

interface EventListProps {
	meetups: Meetup[]
}

export default function ManagedMeetups({ meetups }: EventListProps) {
	const router = useRouter()

	function handleOpenEvent(meetup: Meetup) {
		router.push(`/meetup/${meetup.id}`)
	}
	
	if (meetups.length === 0) {
		return <div className="text-sm text-slate-400 italic mx-5">Você ainda não criou nenhum evento.</div>
	}

	return (
		<>
			<p className="mx-5 text-slate-700 dark:text-slate-200 text-sm">Aqui você verá todos os eventos que <span className="underline underline-offset-2">criou ou administra</span>.</p>

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
						<ContextMenu key={item.id}>
							<ContextMenuTrigger asChild>
								<TableRow onClick={() => { handleOpenEvent(item) }} className="cursor-pointer">
									<TableCell className="font-semibold">
										<div className="lg:w-80 truncate">
											{item.title}
										</div>
									</TableCell>
									<TableCell>{item.start}</TableCell>
									<TableCell>{formatStatus(item.status)}</TableCell>
									<TableCell>
										<div className="lg:w-80 truncate">
											{formatAddress(item.address)}
										</div>
									</TableCell>
								</TableRow>
							</ContextMenuTrigger>
							<ContextMenuContent>
								<ContextMenuItem asChild>
									<Link href={`/meetup/${item.id}`} className="cursor-pointer">
										Visualizar
										<ContextMenuShortcut>
											<Eye />
										</ContextMenuShortcut>
									</Link>
								</ContextMenuItem>

								<ContextMenuItem asChild>
									<Link href={`/meetup/${item.id}/edit`} className="cursor-pointer">
										Editar
										<ContextMenuShortcut>
											<Edit />
										</ContextMenuShortcut>
									</Link>
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					))}
				</TableBody>
			</Table>
		</>
	)
}
