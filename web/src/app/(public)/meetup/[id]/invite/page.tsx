'use client'

import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { Meetup } from "@/types/Meetup"
import { formatAddress } from "@/util/format"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Calendar, Check, MapPin, User } from "lucide-react"
import Image from "next/image"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Invite() {
	const { id } = useParams()
	const searchParams  = useSearchParams()

	const router = useRouter()

	const personId = searchParams.get('p')

	if(!personId) {
		router.push('/signin')
		
		return null
	}

	const { data: invitation } = useQuery<Invite | null>({
		queryKey: ['check-is-invited'],
		queryFn: async () => {
			const { data } = await api.get<Invite>(`meetup/${id}/invitation/${personId}`)

			if(!data) {
				router.replace('/signin')

				return null
			}

			return data
		}
	})

	const { data: meetup, refetch: refetchMeetup } = useQuery<Meetup>({
		queryKey: ['get-meetup'],
		queryFn: async () => {
			const { data } = await api.get<Meetup>(`meetup/${id}`)

			data.start = format(new Date(data.start), 'dd/MM/yyyy HH:mm\'h\'')
			data.end = format(new Date(data.end), 'dd/MM/yyyy HH:mm\'h\'')

			return data
		},
		enabled: !!invitation
	})

	const { data: person } = useQuery<Person>({
		queryKey: ['get-person'],
		queryFn: async () => {
			const { data } = await api.get<Person>(`person/${personId}`)

			return data
		},
		enabled: !!invitation
	})

	async function handleSubscribe() {
		if(meetup) {
			try {
				await api.post(`meetup/${id}/subscribe/${personId}`)

				toast.success('Sua inscrição foi enviada!')

				refetchMeetup()
			} catch(e: any) {
				toast.error(e.message)
			}
		}
	}

	if(invitation && invitation?.personId !== personId) {
		router.replace('/signin')
	}

	if(meetup === null) {
		return (
			<div className="text-slate-800 dark:text-slate-300">Este evento não existe.</div>
		)
	}

	if(!meetup || !person) {
		return null
	}

	const isSubscribed = !!meetup.subscriptions?.some(subs => subs.personId === personId)
	const isCreator = meetup.creator.id === personId

	return (
		<div className="flex flex-col gap-10 lg:max-w-4xl lg:self-center">
			<span className="font-semibold text-xl text-white">{`👋 Olá, ${person.name}!`}</span>

			<p className="mx-3 text-white">Você está quase lá! Só precisa confirmar sua inscrição abaixo.</p>

			<div className="py-6 px-7 rounded-md bg-white/90 dark:bg-slate-950/80 shadow-lg">
				{meetup.image && <Image src={meetup.image} alt="" width={1000} height={1000} className="float-left mr-10 mb-5 w-96 rounded-md object-contain shadow-sm" />}
				
				<div className="text-sm">
					<h1 className="font-bold text-2xl mb-6">{meetup.title}</h1>

					<div className="flex flex-col gap-6 mb-6">
						<div className="grid grid-cols-[1.4rem_auto] gap-2">
							<Calendar size={19} />
							Data/hora: {meetup.start}
						</div>

						<div className="grid grid-cols-[1.4rem_auto] gap-2">
							<MapPin size={19} />
							Local: {formatAddress(meetup.address)}
						</div>

						<div className="grid grid-cols-[1.4rem_auto] gap-2">
							<User size={19} />
							Criado por: {isCreator ? 'você' : meetup.creator.name}
						</div>
					</div>

					<div className="flex gap-6 mb-6 justify-end">
						{isSubscribed ? (
							<Button onClick={() => {}} className="bg-emerald-600 text-white hover:bg-emerald-600 cursor-default">							
								Você já está inscrito
								<Check size={16} />
							</Button>	
						) : (
							<Button onClick={handleSubscribe} className="bg-sky-600 text-white hover:bg-sky-700">							
								Inscrever-se
								<Check size={16} />
							</Button>
						)}
					</div>
					
					<span className="leading-loose text-slate-700 dark:text-slate-200">
						{meetup.description}
					</span>
				</div>
			</div>
		</div>
	)
}