'use client'

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Upload, UploadTrigger, UploadViewer } from "@/components/ui/upload"
import { cn } from "@/lib/utils"
import { api } from "@/services/api"
import { Meetup } from "@/types/Meetup"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Check, File, UploadCloud } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const sheetSchema = z.object({
	sheet: z.file('Envie a planilha de convidados.')
})

type SheetSchema = z.infer<typeof sheetSchema>

interface SheetDataProps {
	link: string
	data: {
		name: string
		cpf: string
		whatsapp: string
		email: string
	}[]
	errors: {
		index: number
		error: string
	}[]
}

export default function Sheet() {
	const { id } = useParams()

	const router = useRouter()

	const [sheetData, setSheetData] = useState<SheetDataProps | null>(null)
	const [isAnalyzingData, setIsAnalyzingData] = useState(false)

	const { data: meetup } = useQuery<Meetup>({
		queryKey: ['get-meetup-by-id'],
		queryFn: async () => {
			const { data } = await api.get<Meetup>(`meetup/${id}`)

			return data
		}
	})

	const {
		handleSubmit,
		formState: { errors, isSubmitting },
		control
	} = useForm<SheetSchema>({
		resolver: zodResolver(sheetSchema)
	})

	async function handleSendSheet(data: SheetSchema) {
		try {
			setIsAnalyzingData(true)

			const formData = new FormData()

			formData.append('sheet', data.sheet, data.sheet.name)

			const { data: sheetDataItems } = await api.post<SheetDataProps>('invite/sheet_data', formData)

			setSheetData(sheetDataItems)
		} catch(e: any) {
			toast.error(e.message)
		} finally {
			setIsAnalyzingData(false)
		}
	}

	async function handleSendInvitations() {
		try {
			if(sheetData) {
				await api.post(`invite/${id}`, {
					data: sheetData?.data,
					link: sheetData.link
				})

				toast.success('A planilha foi processada com sucesso.')

				router.back()
			}
		} catch(e: any) {
			toast.error(e.message)
		}
	}

	const hasErrors = !!sheetData?.errors.length

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-xl font-semibold self-start">{meetup?.title}</h1>
			<h2 className="text-sm font-normal self-start">Carga de convidados</h2>

			<form className="flex flex-col max-w-96 w-full gap-6 mb-8" onSubmit={handleSubmit(handleSendSheet)}>
				<Controller
					name="sheet"
					control={control}
					render={({ field }) => (
						<div className="space-y-2">
							<Upload id="image" onFileChange={field.onChange} className="h-36">
								{({ id }) => (
									<>
										<UploadViewer file={field.value} />

										<UploadTrigger id={id} file={field.value} className="flex flex-col gap-2">
											<File size={28} />
											Enviar planilha
										</UploadTrigger>
									</>
								)}
							</Upload>

							{errors.sheet && (
								<p className="text-sm text-red-500">{errors.sheet.message}</p>
							)}
						</div>
					)}
				/>

				<Button disabled={isSubmitting || isAnalyzingData} type="submit">
					Carregar convidados
					<UploadCloud size={16} />
				</Button>
			</form>

			{isAnalyzingData && (
				<div className="w-full flex justify-center items-center flex-col gap-4 text-slate-300 text-sm mt-6">
					<Image alt="" src="/images/positronic.png" width={700} height={200} className="w-48 animation-jump" />
					Estamos analizando sua planilha. Um momento...
				</div>
			)}

			{sheetData && (
				<>
					<h2 className="text-md font-semibold self-start">Convidados a carregar</h2>
					<div className="text-sm self-start">Fizemos a leitura da sua planilha e detectamos os convidados abaixo. Confirme se as informações estão correta a conclua sua carga clicando em <span className="font-semibold">Finalizar</span>.</div>

					<Button 
						onClick={handleSendInvitations} 
						disabled={hasErrors} 
						className="bg-emerald-700 hover:bg-emerald-800 text-white self-end"
					>
						Finalizar
						<Check size={16} />
					</Button>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nome</TableHead>
								<TableHead>CPF</TableHead>
								<TableHead>WhatsApp</TableHead>
								<TableHead>E-mail</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sheetData.data.map((item, idx) => {
								const errorMessage = sheetData.errors.find(error => error.index === idx)?.error

								if(errorMessage) {
									return (
										<Tooltip key={item.whatsapp}>
											<TooltipTrigger asChild>
												<TableRow className={cn('cursor-pointer', { 'bg-red-900': !!errorMessage })}>
													<TableCell>{item.name}</TableCell>
													<TableCell>{item.cpf}</TableCell>
													<TableCell>{item.whatsapp}</TableCell>
													<TableCell>{item.email}</TableCell>
												</TableRow>
											</TooltipTrigger>
											
											<TooltipContent>
												<p>{errorMessage}</p>
											</TooltipContent>
										</Tooltip>
									)
								}
								
								return (
									<TableRow key={item.whatsapp} className="cursor-pointer">
										<TableCell>{item.name}</TableCell>
										<TableCell>{item.cpf}</TableCell>
										<TableCell>{item.whatsapp}</TableCell>
										<TableCell>{item.email}</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</>
			)}
		</div>
	)
}