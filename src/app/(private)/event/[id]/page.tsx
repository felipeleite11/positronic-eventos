'use client'

import { Button } from "@/components/ui/button"
import { GlobalContext } from "@/contexts/GlobalContext"
import { people } from "@/seed-data"
import { notify } from "@/util/notification"
import { getEventById, subscribe } from "@/util/storage"
import { useQuery } from "@tanstack/react-query"
import { Bell, Calendar, Check, LogIn, MapPin, MessageCircle, UploadCloud, User } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useContext } from "react"
import { toast } from "sonner"

export default function Event() {
	const { id } = useParams()

	const { person } = useContext(GlobalContext)

	const eventPageLink = `${process.env.NEXT_PUBLIC_BASE_URL}/event/${id}/confirmation?p=${person?.id}`

	const { data: event, refetch: refetchEvent } = useQuery({
		queryKey: ['event'],
		queryFn: async () => {
			return getEventById(+id!) || null
		}
	})

	function handleSubscribe() {
		if(event) {
			try {
				subscribe(event, person!)

				toast.success('Sua inscrição está confirmada!')

				refetchEvent()
			} catch(e: any) {
				toast.error(e.message)
			}
		}
	}

	async function handleUpload() {
		await new Promise(r => setTimeout(r, 800))
		
		toast.success('Carga concluída com sucesso!')
	}

	async function handleNotify() {
		try {
			if(!event) {
				return
			}

			const guestsToNotify = people.filter(person => person.whatsapp && !event.participants?.some(pert => pert.id === person.id))

			for(const guest of guestsToNotify) {
				notify(`Olá, ${guest.name}!\n\nVocê está convidado para o evento ${event.name}.\n\nConfirme sua presença na página do evento:\n${eventPageLink}\n\nTe aguardamos lá!`, guest.whatsapp!)
			}
			
			toast.success('Os convidados foram notificados!')
		} catch(e: any) {
			toast.error(e.message)
		}
	}

	if(event === null) {
		return (
			<div className="text-slate-800">Este evento não existe.</div>
		)
	}

	if(!event) {
		return null
	}

	const isSubscribed = event.participants?.some(part => part.id === person?.id)
	const isCreator = event.creator.id === person?.id

	return (
		<div className="flex flex-col gap-10">
			<div>
				{event.image && <Image src={event.image} alt="" width={1000} height={1000} className="float-left mr-10 mb-5 w-96 rounded-md object-contain shadow-sm" />}
				
				<div className="text-sm">
					<h1 className="font-bold text-2xl mb-6">{event.name}</h1>

					<div className="flex flex-wrap gap-6 mb-6">
						<div className="flex items-center gap-2">
							<Calendar size={16} />
							Data/hora: {event.period.start}
						</div>

						<div className="flex items-center gap-2">
							<MapPin size={16} />
							Local: {event.place.name}
						</div>

						<div className="flex items-center gap-2">
							<User size={16} />
							Criado por: {event.creator.name}
						</div>
					</div>

					<div className="flex gap-6 mb-6 justify-end">
						{!isCreator ? (
							<Button onClick={handleSubscribe}>
								Contatar a organização
								<MessageCircle size={16} />
							</Button>
						) : (
							<div className="flex gap-8">
								<input type="file" className="hidden" id="file" onChange={handleUpload} />

								<Button asChild>
									<label htmlFor="file">
										Carregar convidados
										<UploadCloud size={16} />
									</label>
								</Button>

								<Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={handleNotify}>
									Notificar convidados
									<Bell size={16} />
								</Button>
							</div>
						)}

						{isSubscribed ? (
							<Button onClick={handleSubscribe} className="bg-emerald-500 hover:bg-emerald-500 text-white cursor-default">
								Você já está inscrito
								<Check size={16} />
							</Button>
						) : (
							<Button onClick={handleSubscribe} className="bg-sky-500 text-white hover:bg-sky-500">							
								Inscrever-se
								<LogIn size={16} />
							</Button>
						)}
					</div>
					
					<span className="leading-loose text-slate-700 dark:text-slate-200">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa?</span>
				</div>
			</div>
		</div>
	)
}