'use client'

import { useQuery } from "@tanstack/react-query"
import { redirect, useParams } from "next/navigation"
import { api } from "@/services/api"
import { Subscription } from "@/types/Subscription"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileBadge, FileX2 } from "lucide-react"
import Link from "next/link"

export default function Certificate() {
	const { id } = useParams()

	const { data: subscription } = useQuery<Subscription>({
		queryKey: ['get-meetup'],
		queryFn: async () => {
			const { data } = await api.get<Subscription>(`subscription/${id}`)

			return data
		},
		refetchOnWindowFocus: false
	})

	const { refetch: downloadCertificate } = useQuery<Blob>({
		queryKey: ['get-certificate-file'],
		queryFn: async () => {
			const { data: fileBlob } = await api.get<Blob>(`certificate/${id}/download`, {
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

			return fileBlob
		},
		refetchOnWindowFocus: false,
		enabled: false
	})

	if(subscription === null) {
		redirect('/signin')
	}

	if(!subscription) {
		return null
	}

	const hasCerficateLink = !!subscription?.certificateLink

	return (
		<div className="flex flex-col gap-6 items-center">
			<Card
				className="w-full h-fit max-w-xl shadow-lg rounded-2xl border bg-white text-black dark:bg-slate-900 dark:text-white"
			>
				{hasCerficateLink ? (
					<>
						<CardHeader>
							<CardTitle className="flex flex-col gap-4">
								<span className="text-md self-start font-semibold">Olá, {subscription.person.name},</span>

								<FileBadge size={56} className="self-center" />

								<span className="text-center text-xl font-bold">Seu certificado está disponível!</span>
							</CardTitle>
						</CardHeader>

						<CardContent className="flex flex-col items-center gap-8">
							<p>Baixe aqui o certificado de participação no evento <span className="font-bold">{subscription.meetup?.title}</span></p>

							<Button className="self-center" onClick={() => { downloadCertificate() }}>
								Baixar meu certificado
							</Button>
						</CardContent>
					</>
				) : (
					<CardHeader>
						<CardTitle className="flex flex-col gap-4">
							<FileX2 size={56} className="self-center" />

							<span className="text-center text-xl font-bold">Certificado não encontrado!</span>

							<Link href="/signin" className="underline underline-offset-4 self-center hover:opacity-70 mt-6">
								Ir para o login
							</Link>
						</CardTitle>
					</CardHeader>
				)}
			</Card>
		</div>
	)
}