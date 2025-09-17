'use client'

import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { Meetup } from "@/types/Meetup"
import { useQuery } from "@tanstack/react-query"
import { Calendar, Check, MapPin, User } from "lucide-react"
import Image from "next/image"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Confirmation() {
	const { id } = useParams()
	const searchParams  = useSearchParams()

	const router = useRouter()

	const personId = searchParams.get('p')

	if(!personId) {
		router.push('/')
		
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

	const { data: meetup } = useQuery<Meetup>({
		queryKey: ['get-meetup'],
		queryFn: async () => {
			const { data } = await api.get<Meetup>(`meetup/${id}`)

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

	const { data: confirmation, refetch: refetchConfirmation } = useQuery<Subscription>({
		queryKey: ['get-confirmation-status'],
		queryFn: async () => {
			const { data } = await api.get<Subscription>(`subscription/${id}/confirmation/${personId}`)

			return data
		},
		enabled: !!invitation
	})

	async function handleConfirm() {
		if(meetup) {
			try {
				await api.patch(`meetup/${id}/confirmation/${personId}`)

				toast.success('Sua inscrição está confirmada!')

				refetchConfirmation()
			} catch(e: any) {
				toast.error(e.message)
			}
		}
	}

	if(meetup === null) {
		return (
			<div className="text-slate-800 dark:text-slate-300">Este evento não existe.</div>
		)
	}

	if(!meetup || !person) {
		return null
	}

	const isSubscribed = !!confirmation?.presenceConfirmation

	return (
		<div className="flex flex-col gap-10 lg:max-w-4xl lg:self-center">
			<span className="font-semibold text-xl text-white">{`👋 Olá, ${person.name}!`}</span>

			<p className="mx-3 text-white">Você está quase lá! Só precisa confirmar sua inscrição abaixo.</p>

			<div className="py-6 px-7 rounded-md bg-white/90 dark:bg-slate-950/80 shadow-lg">
				{meetup.image && <Image src={meetup.image} alt="" width={1000} height={1000} className="float-left mr-10 mb-5 w-96 rounded-md object-contain shadow-sm" />}
				
				<div className="text-sm">
					<h1 className="font-bold text-2xl mb-6">{meetup.title}</h1>

					<div className="flex flex-wrap gap-6 mb-6">
						<div className="flex items-center gap-2">
							<Calendar size={16} />
							Data/hora: {meetup.datetime}
						</div>

						<div className="flex items-center gap-2">
							<MapPin size={16} />
							Local: {meetup.address?.street}
						</div>

						<div className="flex items-center gap-2">
							<User size={16} />
							Criado por: {meetup.creator.name}
						</div>
					</div>

					<div className="flex gap-6 mb-6 justify-end">
						{/* <Button onClick={handleContact}>
							Contatar a organização
							<MessageCircle size={16} />
						</Button> */}

						{isSubscribed ? (
							<Button onClick={() => {}} className="bg-emerald-600 hover:bg-emerald-600 text-white cursor-default">
								Você já está inscrito
								<Check size={16} />
							</Button>
						) : (
							<Button onClick={handleConfirm} className="bg-emerald-600 text-white hover:bg-emerald-700">							
								Confirmar inscrição
								<Check size={16} />
							</Button>
						)}
					</div>
					
					<span className="leading-loose text-slate-700 dark:text-slate-200">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa?</span>
				</div>
			</div>
		</div>
	)
}