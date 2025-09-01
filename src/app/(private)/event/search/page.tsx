'use client'

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Event } from "@/types/Event.d"

export default function Search() {
	const [isSearching, setIsSearching] = useState(false)
	const [searchResult, setSearchResult] = useState<null | Event[]>(null)

	async function handleSearch() {
		try {
			setIsSearching(true)

			await new Promise(r => setTimeout(r, 2000))

			const eventList: Event[] = [
				{
					id: 1,
					name: 'Encontro Anual de Engenharia Civil do RJ',
					date: '14/09/2025',
					status: 'agendado',
					place: {
						id: 1,
						name: 'Auditório Central da UFRJ',
						address_text: 'Avenida Brasil, 2000 - Urca - Rio de Janeiro - RJ - 12345678',
						address: {
							country: 'Brasil',
							state: 'Rio de Janeiro',
							city: 'Rio de Janeiro',
							district: 'Urca',
							street: 'Avenida Brasil',
							number: '2000',
							zipcode: '12345678'
						}
					},
					available_subscriptions: 120
				},
				{
					id: 2,
					name: 'Encontro Anual de Engenharia Civil da Barra',
					date: '16/07/2025',
					status: 'finalizado',
					place: {
						id: 1,
						name: 'Sala de Palestras do Shopping da Barra',
						address_text: 'Avenida Brasil, 4000 - Barra da Tijuca - Rio de Janeiro - RJ - 12345670',
						address: {
							country: 'Brasil',
							state: 'Rio de Janeiro',
							city: 'Rio de Janeiro',
							district: 'Barra da Tijuca',
							street: 'Avenida Brasil',
							number: '4000',
							zipcode: '12345670'
						}
					},
					available_subscriptions: 450
				}
			]

			setSearchResult(eventList)
		} catch (e: any) {
			toast(e.message)
		} finally {
			setIsSearching(false)
		}
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="flex gap-2">
				<Input placeholder="Nome do evento" defaultValue="Encontro Anual de Engenharia Civil" />

				<Button onClick={handleSearch}>
					Buscar
					<SearchIcon />
				</Button>
			</div>

			{isSearching ? (
				<div className="flex flex-col gap-6">
					<Skeleton className="h-96 w-full rounded-md" />
				</div>
			) : !searchResult ? null : !!searchResult?.length ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Evento</TableHead>
							<TableHead>Data / hora</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Local</TableHead>
							<TableHead className="text-right">Vagas</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{searchResult.map(item => (
							<TableRow key={item.id}>
								<TableCell className="font-semibold">{item.name}</TableCell>
								<TableCell>{item.date}</TableCell>
								<TableCell>{item.status}</TableCell>
								<TableCell>{item.place.address_text || ''}</TableCell>
								<TableCell className="text-right">{item.available_subscriptions}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<div className="text-slate-400 italic text-sm">Nenhum evento correspondente à sua busca.</div>
			)}
		</div>
	)
}