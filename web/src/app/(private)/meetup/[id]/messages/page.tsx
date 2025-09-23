'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/services/api"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { queryClient } from "@/components/Providers"
import { useSession } from "next-auth/react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"

const notificationSchema = z.object({
	message: z.string().min(1, "Insira uma mensagem.")
})

type NotificationSchema = z.infer<typeof notificationSchema>

export default function Messages() {
	const { id } = useParams()

	const { data: session } = useSession()

	const {
		register,
		handleSubmit,
		reset
	} = useForm<NotificationSchema>({
		resolver: zodResolver(notificationSchema)
	})

	const { data: notifications } = useQuery<MeetupNotification[]>({
		queryKey: ['get-meetup-notifications'],
		queryFn: async () => {
			const { data } = await api.get<MeetupNotification[]>(`notification/${id}`)

			return data
		}
	})

	const { mutate: handleSendMessage, isPending: isSubmitting } = useMutation({
		mutationFn: async (data: NotificationSchema) => {
			await api.post(`notification/${id}/${session?.user.person_id}`, {
				text: data.message
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get-meetup-notifications']
			})

			toast.success('Sua mensagem foi enviada para todos os convidados do evento.')

			reset()
		}
	})

	if (!notifications) {
		return null
	}

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardContent className="flex flex-col items-center gap-8">
					<form onSubmit={handleSubmit(values => { handleSendMessage(values) })} className="space-y-4 w-full">
						<Textarea
							label="Sua mensagem"
							placeholder="Digite a mensagem"
							{...register('message')}
							className="bg-white border-gray-300 dark:bg-slate-700 dark:border-slate-600 h-36"
						/>

						<Button type="submit" className="w-full disabled:opacity-60 disabled:cursor-wait" disabled={isSubmitting}>
							Enviar
							<Send size={16} />
						</Button>
					</form>
				</CardContent>
			</Card>

			<Table className="text-sm">
				<TableHeader>
					<TableRow>
						<TableHead>Enviado por</TableHead>
						<TableHead className="w-full">Mensagem</TableHead>
						<TableHead className="w-48">Data/hora</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{notifications.map(notification => {
						
						return (
							<TableRow key={notification.id}>
								<TableCell>{notification.person.name}</TableCell>
								<TableCell className="line-clamp-4 whitespace-normal break-words">{notification.text}</TableCell>
								<TableCell>{format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm\'h\'')}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}