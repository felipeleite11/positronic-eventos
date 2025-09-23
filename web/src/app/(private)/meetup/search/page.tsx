'use client'

import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatAddress, formatStatus } from "@/util/format";
import { Meetup } from "@/types/Meetup";
import { api } from "@/services/api";
import { format } from "date-fns";
import { useQueryState } from "nuqs"
import { useSession } from "next-auth/react";

interface SearchProps {
	search: string
}

export default function Search() {
	const router = useRouter()

	const { data: session } = useSession()

	const [isSearching, setIsSearching] = useState(false)
	const [searchResult, setSearchResult] = useState<null | Meetup[]>(null)
	const [filter, setFilter] = useQueryState('filter', { defaultValue: '',  })

	const firstRender = useRef(true)

	const {
		handleSubmit,
		register
	} = useForm<SearchProps>({
		defaultValues: {
			search: filter
		}
	})

	const handleSearch: SubmitHandler<SearchProps> = async (data: SearchProps) => {
		try {
			setIsSearching(true)

			let { data: meetupList } = await api.get<Meetup[]>(`meetup/search/${session?.user.person_id}`, {
				params: {
					q: data.search
				}
			})

			meetupList = meetupList.map(item => ({
				...item,
				start: format(new Date(item.start), 'dd/MM/yyyy HH:mm\'h\''),
				end: format(new Date(item.end), 'dd/MM/yyyy HH:mm\'h\'')
			}))

			setSearchResult(meetupList)
		} catch (e: any) {
			toast.error(e.message)
		} finally {
			setIsSearching(false)
		}
	}

	function handleOpenMeetup(meetup: Meetup) {
		router.push(`/meetup/${meetup.id}`)
	}

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false

			if (filter) {
				handleSearch({ search: filter })
			}
		}
	}, [filter])

	return (
		<div className="flex flex-col gap-10 p-8">
			<form className="flex gap-2" onSubmit={handleSubmit(handleSearch)}>
				<Input 
					placeholder="Nome do evento" 
					className="w-96" 
					{...register('search', {
						onChange(e) {
							setFilter(e.target.value)	
						}
					})}
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
						</TableRow>
					</TableHeader>
					<TableBody>
						{searchResult.map(item => (
							<TableRow key={item.id} onClick={() => { handleOpenMeetup(item) }} className="cursor-pointer">
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
						))}
					</TableBody>
				</Table>
			) : (
				<div className="text-slate-400 italic text-sm text-center mt-8">Nenhum evento correspondente à sua busca.</div>
			)}
		</div>
	)
}