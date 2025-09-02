'use client'

import { Button } from "@/components/ui/button"
import { GlobalContext } from "@/contexts/GlobalContext"
import { getEventById, subscribe } from "@/util/storage"
import { useQuery } from "@tanstack/react-query"
import { Calendar, Check, MapPin, MessageCircle, User } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useContext } from "react"
import { toast } from "sonner"

export default function Event() {
	const { id } = useParams()

	const { person } = useContext(GlobalContext)

	const { data: event } = useQuery({
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
			} catch(e: any) {
				toast.error(e.message)
			}
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

	return (
		<div className="flex flex-col gap-10">
			<div>
				{event.image && <Image src={event.image} alt="" width={1000} height={1000} className="float-left mr-10 mb-5 w-96 rounded-md object-contain shadow-sm" />}
				
				<div className="text-sm">
					<h1 className="font-bold text-2xl mb-6">{event.name} {event.participants?.length || '-'}</h1>

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
							</Button>
						)}
					</div>
					
					<span className="leading-loose text-slate-700 dark:text-slate-200">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa?</span>
				</div>
			</div>
		</div>
	)
}