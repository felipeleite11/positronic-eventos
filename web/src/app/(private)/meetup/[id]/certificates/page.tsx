'use client'

import { queryClient } from "@/components/Providers";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { Meetup } from "@/types/Meetup";
import { Subscription } from "@/types/Subscription";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, EyeOff, FileBadge, FileInput } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Certificates() {
	const router = useRouter()

	const { id } = useParams()

	const { data: roles } = useQuery<Role[]>({
		queryKey: ['get-roles'],
		queryFn: async () => {
			const { data } = await api.get<Role[]>('role')

			return data
		}
	})

	const { data: meetup } = useQuery<Meetup>({
		queryKey: ['get-meetup-by-id'],
		queryFn: async () => {
			const { data } = await api.get<Meetup>(`meetup/${id}`)

			return data
		},
		enabled: !!roles
	})

	const { mutate: handleEmitCertificate, isPending: isIssuingCertificate } = useMutation({
		mutationFn: async (subscription: Subscription) => {
			await api.post(`meetup/${id}/certificate/${subscription.person.id}`)

			toast.success('O certificado foi emitido!')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get-meetup-by-id']
			})
		},
		onError: error => {
			toast.error(error?.message || ' Ocorreu um erro ao gerar o certificado.')
		}
	})

	async function handleShowCertificate(subscription: Subscription) {
		if (!subscription.certificateLink) {
			toast.error('Este certificado ainda não foi emitido.')

			return
		}

		const { data: fileBlob } = await api.get<Blob>(`certificate/${subscription.id}/download`, {
			responseType: 'blob'
		})

		const url = URL.createObjectURL(fileBlob)
		const a = document.createElement("a")
		a.href = url
		a.download = 'certificado.pdf'
		document.body.appendChild(a)
		a.click()
		a.remove()
		URL.revokeObjectURL(url)
	}

	if (!meetup || !roles) {
		return null
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

			<h2 className="text-lg font-semibold">Geração de certificados do evento</h2>

			<Tabs defaultValue={roles[0].name} className="w-full">
				<TabsList className="bg-slate-850 mb-2">
					{roles?.map(role => (
						<TabsTrigger key={role.id} value={role.name} className="cursor-pointer text-[0.8rem] p-4 capitalize">
							{role.name}
						</TabsTrigger>
					))}
				</TabsList>

				{roles?.map(role => {
					const subscriptionsOfRole = meetup.subscriptions?.filter(subs => subs.meetupRole?.id === role.id) || []

					return (
						<TabsContent key={role.id} value={role.name} className="flex flex-col gap-6 pt-4">
							{subscriptionsOfRole.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-full">Participante</TableHead>
											<TableHead className="w-full">Função</TableHead>
											<TableHead>Certificado</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{subscriptionsOfRole.map(subs => {
											const hasCertificateLink = !!subs.certificateLink

											console.log(subs)

											return (
												<TableRow key={subs.id} className="cursor-pointer">
													<TableCell>{subs.person.name}</TableCell>
													
													<TableCell className="capitalize">{subs.meetupRole.name}</TableCell>

													<TableCell className="flex justify-center gap-2">
														<Tooltip>
															<TooltipTrigger asChild>
																<span
																	className={cn(
																		'text-sm cursor-pointer p-2',
																		{ 'opacity-60 cursor-wait': isIssuingCertificate }
																	)}
																	onClick={() => {
																		if(!isIssuingCertificate) {
																			handleEmitCertificate(subs)
																		}
																	}}
																>
																	{hasCertificateLink ? <FileInput size={17} /> : <FileBadge size={17} />}
																</span>
															</TooltipTrigger>
															
															<TooltipContent>
																{hasCertificateLink ? 'Reenviar certificado' : 'Emitir certificado'}
															</TooltipContent>
														</Tooltip>

														<Tooltip>
															<TooltipTrigger asChild>
																<span
																	className={cn(
																		'text-sm cursor-pointer p-2',
																		{ 'opacity-60 cursor-not-allowed': !hasCertificateLink }
																	)}
																	onClick={() => {
																		if (hasCertificateLink) {
																			handleShowCertificate(subs)
																		}
																	}}
																>
																	{hasCertificateLink ? (
																		<Eye size={17} />
																	) : (
																		<EyeOff size={17} />
																	)}
																</span>
															</TooltipTrigger>
															
															<TooltipContent>
																{hasCertificateLink ? 'Visualizar certificado' : 'Certificado não emitido'}
															</TooltipContent>
														</Tooltip>
													</TableCell>
												</TableRow>
											)
										})}
									</TableBody>
								</Table>
							) : (
								<div className="text-slate-400 italic text-sm text-center mt-8">
									Nenhum participante foi registrado.
								</div>
							)}
						</TabsContent>
					)
				})}
			</Tabs>
		</div>
	)
}