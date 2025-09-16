'use client'

import { Button } from "@/components/ui/button"
import { getEventById, getPersonById, subscribe } from "@/util/storage"
import { useQuery } from "@tanstack/react-query"
import { Calendar, Check, LogIn, MapPin, MessageCircle, User } from "lucide-react"
import Image from "next/image"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Event() {
	const { id } = useParams()
	const searchParams  = useSearchParams()

	const router = useRouter()

	const personId = searchParams.get('p')

	if(!personId) {
		router.push('/')
		
		return null
	}

	const person = getPersonById(Number(personId))

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

	if(event === null) {
		return (
			<div className="text-slate-800 dark:text-slate-300">Este evento não existe.</div>
		)
	}

	if(!event || !person) {
		return null
	}

	const isSubscribed = event.participants?.some(part => part.id === person?.id)

	return (
		<div className="flex flex-col gap-10">
			<span className="font-semibold text-xl">{`👋 Olá, ${person.name}!`}</span>

			<p>Você está quase lá! Só precisa confirmar sua inscrição abaixo.</p>

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
						<Button onClick={handleSubscribe}>
							Contatar a organização
							<MessageCircle size={16} />
						</Button>

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