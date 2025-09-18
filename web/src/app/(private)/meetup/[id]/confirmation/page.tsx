'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/services/api"
import { Meetup } from "@/types/Meetup"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

export default function Confirmation() {
	const { id } = useParams()

	// TODO: Falta trazer marcadas as presenças já confirmadas
	// Ao marcar cada presença, atualizar na base

	const [confirmations, setConfirmations] = useState<Subscription[] | null>(null)

	useQuery<Meetup>({
		queryKey: ['get-meetup-by-id'],
		queryFn: async () => {
			const { data } = await api.get<Meetup>(`meetup/${id}`)

			if(!!data.subscriptions?.length) {
				setConfirmations(data.subscriptions)
			}

			return data
		},
		enabled: !!id
	})

	async function handleConfirm(subscription: Subscription, status: boolean) {
		setConfirmations(old => {
			const foundSubscription = (old as Subscription[]).find(item => item.id === subscription.id)
			const foundSubscriptionIndex = (old as Subscription[]).findIndex(item => item.id === subscription.id)

			if(foundSubscriptionIndex < 0) {
				return old
			}
			
			if(foundSubscription) {
				foundSubscription.presenceConfirmation = status
			} else {
				return old
			}

			return [
				...(old as Subscription[]).slice(0, foundSubscriptionIndex),
				foundSubscription,
				...(old as Subscription[]).slice(foundSubscriptionIndex + 1)
			]
		})
	}

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-xl font-semibold">Confirmação de presenças no evento</h1>

			{!!confirmations?.length ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="lg:w-80">Nome</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{confirmations.map(subs => (
							<TableRow key={subs.id} className="cursor-pointer">
								<TableCell>{subs.person.name}</TableCell>
								<TableCell className="flex justify-end mx-3">
									<Checkbox 
										onCheckedChange={checked => { 
											handleConfirm(subs, !!checked)
										}}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<div className="text-sm text-slate-400 italic mx-5">Nenhuma pessoa se increveu neste evento.</div>
			)}
		</div>
	)
}