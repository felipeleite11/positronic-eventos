'use client'	

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/services/api";
import { Meetup } from "@/types/Meetup";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Eye, FileBadge, Search } from "lucide-react";
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

	async function handleEmitCertificate(subscription: Subscription) {
		try {
			await api.post(`meetup/${id}/certificate/${subscription.person.id}`)

			toast.success('O certificado foi emitido!')
		} catch(e: any) {
			toast.error(e.message)
		}
	}

	async function handleShowCertificate(subscription: Subscription) {
		if(!subscription.certificateLink) {
			toast.error('Este certificado ainda não foi emitido.')

			return
		}

		console.log('LINK', subscription.certificateLink)
	}

	if(!meetup || !roles) {
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
						<TabsTrigger key={role.id} value={role.name} className="cursor-pointer text-[0.8rem] p-4 capitalize">{role.name}</TabsTrigger>	
					))}
				</TabsList>

				{roles?.map(role => {
					const subscriptionsOfRole = meetup.subscriptions?.filter(subs => subs.meetupRole?.id === role.id) || []

					return (
						<TabsContent key={role.id} value={role.name} className="flex flex-col gap-6 pt-4">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-full">Nome</TableHead>
										<TableHead>Certificado</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{subscriptionsOfRole.map(subs => (
										<TableRow key={subs.id} className="cursor-pointer">
											<TableCell>{subs.person.name}</TableCell>

											<TableCell className="flex justify-center gap-2">
												<span 
													className="text-sm cursor-pointer p-2" 
													onClick={() => {
														handleEmitCertificate(subs)
													}}
												>
													<FileBadge size={17}  />
												</span>
											
												<span 
													className="text-sm cursor-pointer p-2" 
													onClick={() => {
														handleShowCertificate(subs)
													}}
												>
													<Search size={17}  />
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TabsContent>
					)
				})}
			</Tabs>
		</div>
	)
}