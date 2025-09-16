'use client'

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Event } from "@/types/Meetup"
import { events } from "@/seed-data"
import { normalizeText } from '@/util/string'
import { searchEvent } from "@/util/storage";

interface SearchProps {
	search: string
}

export default function Search() {
	const router = useRouter()

	const [isSearching, setIsSearching] = useState(false)
	const [searchResult, setSearchResult] = useState<null | Event[]>(null)

	const {
		handleSubmit,
		register
	} = useForm<SearchProps>({
		defaultValues: {
			search: ''
		}
	})

	const handleSearch: SubmitHandler<SearchProps> = async (data: SearchProps) => {
		try {
			setIsSearching(true)

			await new Promise(r => setTimeout(r, 2000))

			const eventList = searchEvent(data.search)
			
			setSearchResult(eventList)
		} catch (e: any) {
			toast.error(e.message)
		} finally {
			setIsSearching(false)
		}
	}

	function handleOpenEvent(event: Event) {
		router.push(`/meetup/${event.id}`)
	}

	return (
		<div className="flex flex-col gap-10">
			<form className="flex gap-2" onSubmit={handleSubmit(handleSearch)}>
				<Input 
					placeholder="Nome do evento" 
					className="w-96" 
					{...register('search')}
				/>

				<Button type="submit">
					Buscar
					<SearchIcon />
				</Button>
			</form>

			{isSearching ? (
				<div className="flex flex-col gap-6">
					<Skeleton className="h-96 w-full rounded-md" />
				</div>
			) : !searchResult ? null : !!searchResult?.length ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="lg:w-80">Evento</TableHead>
							<TableHead>Data / hora</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="lg:w-80">Local</TableHead>
							<TableHead className="text-right">Vagas</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{searchResult.map(item => (
							<TableRow key={item.id} onClick={() => { handleOpenEvent(item) }} className="cursor-pointer">
								<TableCell className="font-semibold">
									<div className="lg:w-80 truncate">
										{item.name}
									</div>
								</TableCell>
								<TableCell>{item.period?.start}</TableCell>
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
				<div className="text-slate-400 italic text-sm">Nenhum evento correspondente à sua busca.</div>
			)}
		</div>
	)
}