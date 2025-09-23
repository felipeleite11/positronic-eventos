'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/services/api"
import { Subscription } from "@/types/Subscription"
import { useQuery } from "@tanstack/react-query"
import { format, isSameDay } from "date-fns"
import { FileBadge } from "lucide-react"
import { useParams } from "next/navigation"

export default function Validate() {
	const { id } = useParams()

	const { data: subscription } = useQuery<Subscription>({
		queryKey: ['get-meetup-by-id'],
		queryFn: async () => {
			const { data } = await api.get<Subscription>(`subscription/${id}`)

			return data
		},
		enabled: !!id
	})

	if(!subscription?.meetup) {
		return null
	}

	let dateText = ''

	const { start, end } = subscription.meetup

	if(isSameDay(start, end)) {
		dateText = `Date: ${format(new Date(start), 'dd/MM/yyyy')}`
	} else {
		dateText = `Período: de ${format(new Date(start), 'dd/MM/yyyy')} a ${format(new Date(end), 'dd/MM/yyyy')}`
	}

	return (
		<Card className="max-w-96 w-full self-center mt-16">
			<CardHeader>
				<CardTitle className="flex flex-col gap-4 items-center">
					<FileBadge size={56} />

					<span className="text-lg font-semibold">Certificado detectado</span>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col gap-3 text-sm">
				<p>Participante: {subscription.person.name}</p>
				<p>Evento: {subscription.meetup?.title}</p>
				<p>{dateText}</p>
				{subscription.meetup?.workload && <p>Carga horária: {subscription.meetup?.workload} horas</p>}
			</CardContent>
		</Card>
	)
}