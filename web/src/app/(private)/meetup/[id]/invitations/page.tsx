'use client'

import { ArrowLeft, Check, CopyCheck, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Meetup } from "@/types/Meetup";
import { api } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { queryClient } from "@/components/Providers";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Invitations() {
	const router = useRouter()
	const { id } = useParams()

	const [isSelectMode, setIsSelectMode] = useState(false)
	const [selectedInvitations, setSelectedInvitations] = useState<Invite[]>([])

	const { data: meetup } = useQuery<Meetup>({
		queryKey: ['get-meetup-by-id'],
		queryFn: async () => {
			const { data } = await api.get<Meetup>(`meetup/${id}/invitations`)

			return data
		}
	})

	const { mutate: handleRevokeInvite } = useMutation({
		mutationFn: async (data: Invite) => {
			await api.delete(`invite/${id}/${data.personId}`)
		},
		onSuccess() {
			toast.success('Convite removido com sucesso.')

			queryClient.invalidateQueries({
				queryKey: ['get-meetup-by-id']
			})
		}
	})

	const { mutate: handleRevokeInvites } = useMutation({
		mutationFn: async () => {
			await api.patch(`invite/${id}/revoke`, {
				invitations: selectedInvitations.map(invitation => invitation.id)
			})
		},
		onSuccess() {
			toast.success('Convites removidos com sucesso.')

			queryClient.invalidateQueries({
				queryKey: ['get-meetup-by-id']
			})

			setSelectedInvitations([])
			setIsSelectMode(false)
		}
	})

	useEffect(() => {
		setSelectedInvitations([])
	}, [isSelectMode])

	return (
		<div className="flex flex-col gap-4">
			<div>
				<Button variant="ghost" onClick={() => router.back()} className="text-sm text-slate-600 dark:text-slate-400 hover:opacity-70 transition-opacity">
					<ArrowLeft size={15} />
					Voltar
				</Button>
			</div>

			<h1 className="text-xl font-semibold self-start">{meetup?.title}</h1>
			<h2 className="font-semibold text-lg self-start">Gerenciamento de convidados</h2>

			<div className="flex justify-end gap-3">
				<Button 
					onClick={() => {
						setIsSelectMode(old => !old)
					}}
				>
					<CopyCheck size={16} />
					{isSelectMode ? 'Cancelar seleção' : 'Selecionar vários'}
				</Button>

				{isSelectMode && selectedInvitations.length > 0 && (
					<Button 
						onClick={() => {
							handleRevokeInvites()
						}}
						className="bg-emerald-600 text-white hover:bg-emerald-700"
					>
						Remover convites selecionados
						<Check size={16} />
					</Button>
				)}
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						{isSelectMode && <TableHead className="w-8"></TableHead>}
						<TableHead>Nome</TableHead>
						<TableHead className="w-36">Data</TableHead>
						<TableHead className="w-20 text-center">Revogar</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{meetup?.invites?.map(invitation => (
						<TableRow key={invitation.personId}>
							{isSelectMode && (
								<TableCell>
									<Checkbox 
										className="cursor-pointer"
										onCheckedChange={checked => { 
											setSelectedInvitations(old => {
												return checked ? [
													...old,
													invitation
												] : old.filter(item => item.id !== invitation.id)
											})
										}}
									/>
								</TableCell>	
							)}
							<TableCell>{invitation.person.name}</TableCell>
							<TableCell>{format(new Date(invitation.createdAt), 'dd/MM/yyyy HH:mm\'h\'')}</TableCell>
							<TableCell className="flex justify-center">
								<X 
									size={16} 
									className="cursor-pointer"
									onClick={() => {
										handleRevokeInvite(invitation)
									}} 
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}