'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { notify } from "@/util/notification"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ArrowLeft, ArrowRight, Bell, BellOff, Calendar, Check, Edit, LogIn, MapPin, UploadCloud, User } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSession } from "next-auth/react"
import { api } from "@/services/api"
import { Meetup, MeetupFollowing } from "@/types/Meetup"
import { extractNumbers } from "@/util/string"
import { formatAddress } from "@/util/format"
import { format, isBefore } from "date-fns"
import Link from "next/link"

export default function Event() {
	const { id } = useParams()

	const router = useRouter()

	const { data: session } = useSession()

	const { person } = session?.user!

	const meetupPageLink = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/meetup/${id}/invite?p=${person.id}`

	const { data: meetup, refetch: refetchMeetup } = useQuery<Meetup | null>({
		queryKey: ['get-meetup'],
		queryFn: async () => {
			const { data } = await api.get<Meetup>(`meetup/${id}`)

			return data
		}
	})

	const { mutate: handleToggleFollowing } = useMutation({
		mutationFn: async () => {
			const { data: response } = await api.patch<MeetupFollowing | null>(`meetup/${id}/following_toggle/${person.id}`)

			if(response) {
				toast.success('Agora você receberá as notificações deste evento.')
			} else {
				toast.info('Você não receberá mais as notificações deste evento.')
			}

			refetchMeetup()
		}
	})

	async function handleSubscribe() {
		if(meetup) {
			try {
				await api.post<Subscription>(`meetup/${id}/subscribe/${person.id}`)

				toast.success('Sua inscrição está confirmada!')

				refetchMeetup()
			} catch(e: any) {
				toast.error(e.message)
			}
		}
	}

	async function handleUpload() {
		await new Promise(r => setTimeout(r, 800))
		
		toast.success('Carga concluída com sucesso!')
	}

	async function handleSendInvitations() {
		try {
			if(!meetup) {
				return
			}

			const { data } = await api.get<Meetup>(`meetup/${id}/invitations`)

			const guestsToNotify = data.invites?.filter(item => item.person.phone && !data.subscriptions?.some(subs => subs.personId === item.personId)) || []

			for(const guest of guestsToNotify) {
				notify(
					`Olá, ${guest.person.name}!\n\nVocê está convidad${guest.person.gender === 'F' ? 'a' : 'o'} para o evento ${meetup?.title}.\n\nConfirme sua presença na página do evento:\n${meetupPageLink}\n\nTe aguardamos lá!`, 
					`55${extractNumbers(guest.person.phone!)}`
				)
			}
			
			toast.success('Os convidados foram notificados!')
		} catch(e: any) {
			toast.error(e.message)
		}
	}

	if(meetup === null) {
		return (
			<div className="text-slate-800 dark:text-slate-300">Este evento não existe.</div>
		)
	}

	if(!meetup) {
		return null
	}

	const isSubscribed = meetup.subscriptions?.some(subs => subs.personId === person?.id)
	const isCreator = meetup.creatorId === person.id
	const isFollowed = meetup.followers?.some(follower => follower.personId === person?.id)
	const wasStarted = isBefore(new Date(meetup.start), new Date())

	return (
		<div className="flex flex-col">
				<div className="flex justify-between gap-8 mb-6">
					<Button variant="ghost" onClick={() => router.back()} className="text-sm text-slate-600 dark:text-slate-400 hover:opacity-70 transition-opacity">
						<ArrowLeft size={15} />
						Voltar
					</Button>

					{isCreator && (
						<Button asChild variant="ghost" className="text-sm text-slate-600 dark:text-slate-400 hover:opacity-70 transition-opacity">
							<Link href={`/meetup/${id}/edit`} className="flex gap-2 items-center">
								Editar
								<Edit size={16} />
							</Link>
						</Button>
					)}
				</div>

				<div className="grid grid-cols-[24rem_auto] gap-8">
					{meetup.image && <Image src={meetup.image} alt="" width={1000} height={1000} className="float-left mr-10 mb-5 w-96 rounded-md object-contain shadow-sm" />}

					<div className={cn('text-sm', { 'col-span-2': !meetup.image })}>
						<h1 className="font-bold text-2xl mb-6">{meetup.title}</h1>

						<div className="flex flex-col gap-6 mb-6">
							<div className="grid grid-cols-[1.4rem_auto] gap-2">
								<Calendar size={19} />
								Data/hora: {format(new Date(meetup.start), 'dd/MM/yyyy HH:mm\'h\'')}
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
					</div>
				</div>

				<div className="flex my-6">
					{!isCreator ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className={cn('hover:bg-red-500 hover:text-white rounded-r-none', { 'bg-red-500 hover:bg-red-400 text-white': isFollowed })}
									onClick={() => handleToggleFollowing()}
								>
									{isFollowed ? <BellOff size={16} /> : <Bell size={16} />}
								</Button>
							</TooltipTrigger>
							
							<TooltipContent>
								<p>{isFollowed ? 'Remover acompanhamento' : 'Acompanhar'}</p>
							</TooltipContent>
						</Tooltip>
					) : (
						<div className="flex">
							<input type="file" className="hidden" id="file" onChange={handleUpload} />

							<Button asChild className="rounded-r-none bg-sky-700 hover:bg-sky-600 text-white border-r border-sky-500">
								<label htmlFor="file">
									Carregar convidados
									<UploadCloud size={16} />
								</label>
							</Button>

							<Button className="bg-sky-700 hover:bg-sky-600 text-white rounded-none border-x border-sky-500" onClick={handleSendInvitations}>
								Enviar convites
								<ArrowRight size={16} />
							</Button>

							{wasStarted && (
								<Button asChild className="bg-sky-700 hover:bg-sky-600 text-white rounded-none border-x border-sky-500">
									<Link href={`/meetup/${id}/confirmation`} className="flex items-center gap-2">
										Confirmar presenças
										<ArrowRight size={16} />
									</Link>
								</Button>
							)}
						</div>
					)}

					{isSubscribed ? (
						<Button onClick={handleSubscribe} className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-l-none cursor-default">
							Você já está inscrito
							<Check size={16} />
						</Button>
					) : (
						<Button onClick={handleSubscribe} className="bg-sky-700 text-white hover:bg-sky-600 rounded-l-none border-l border-sky-500">							
							Inscrever-se
							<LogIn size={16} />
						</Button>
					)}
				</div>
				
				<div className="text-sm">
					<span className="leading-loose text-slate-700 dark:text-slate-200">
						{meetup.description}
					</span>
				</div>
		</div>
	)
}