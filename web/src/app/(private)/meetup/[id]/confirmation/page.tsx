'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/services/api"
import { Meetup } from "@/types/Meetup"
import { useParams, useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Subscription } from "@/types/Subscription"

export default function Confirmation() {
	const { id } = useParams()

	const router = useRouter()

	const [meetup, setMeetup] = useState<Meetup | null>(null)
	const [confirmations, setConfirmations] = useState<Subscription[] | null>(null)

	useEffect(() => {
		async function loadSubscriptions() {
			const { data } = await api.get<Meetup>(`meetup/${id}`)

			setMeetup(data)

			if(!!data.subscriptions?.length) {
				setConfirmations(data.subscriptions)
			}
		}

		if(id) {
			loadSubscriptions()
		}
	}, [id])

	async function handleConfirm(subscription: Subscription, status: boolean) {
		const newState = confirmations?.find(item => item.id === subscription.id)

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

		await api.patch(`subscription/${subscription.id}/toggle_confirmation`)
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="mb-1">
				<Button variant="ghost" onClick={() => router.back()} className="text-sm text-slate-600 dark:text-slate-400 hover:opacity-70 transition-opacity">
					<ArrowLeft size={15} />
					Voltar
				</Button>
			</div>

			<h1 className="text-2xl font-semibold">{meetup?.title}</h1>

			<h2 className="text-lg font-semibold">Confirmação de presenças no evento</h2>

			<p className="text-sm text-slate-400 dark:text-slate-300">Somente pessoas com presença confirmada poderão receber seus <span className="underline underline-offset-2">certificados</span> de forma automática.</p>

			{!!confirmations?.length ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-full">Nome</TableHead>
							<TableHead>Confirmado</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{confirmations.map(confirmation => (
							<TableRow key={confirmation.id} className="cursor-pointer">
								<TableCell>{confirmation.person.name}</TableCell>
								<TableCell className="flex justify-center">
									<Checkbox 
										onCheckedChange={checked => { 
											handleConfirm(confirmation, !!checked)
										}}
										checked={confirmation.presenceConfirmation}
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