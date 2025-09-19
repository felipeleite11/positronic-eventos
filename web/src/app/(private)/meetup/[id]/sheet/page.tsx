'use client'

import { Button } from "@/components/ui/button"
import { Upload, UploadTrigger, UploadViewer } from "@/components/ui/upload"
import { api } from "@/services/api"
import { Meetup } from "@/types/Meetup"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { File, UploadCloud } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const sheetSchema = z.object({
	sheet: z.file('Envie a planilha de convidados.')
})

type SheetSchema = z.infer<typeof sheetSchema>

export default function Sheet() {
	const { id } = useParams()

	const router = useRouter()

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

	async function submitFunction(data: SheetSchema) {
		try {
			const formData = new FormData()

			formData.append('sheet', data.sheet, data.sheet.name)

			await api.post(`invite/${id}`, formData)

			toast.success('A planilha foi processada com sucesso.')

			router.back()
		} catch(e: any) {
			toast.error(e.message)
		}
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-xl font-semibold self-start">{meetup?.title}</h1>
			<h2 className="text-md font-normal self-start">Carga de convidados</h2>

			<form className="flex flex-col max-w-96 w-full gap-6" onSubmit={handleSubmit(submitFunction)}>
				<Controller
					name="sheet"
					control={control}
					render={({ field }) => (
						<div className="space-y-2">
							<Upload id="image" onFileChange={field.onChange}>
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

				<Button disabled={isSubmitting} type="submit">
					Carregar convidados
					<UploadCloud size={16} />
				</Button>
			</form>
		</div>
	)
}