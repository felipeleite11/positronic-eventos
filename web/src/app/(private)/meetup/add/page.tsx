'use client'

import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, UploadTrigger, UploadViewer } from "@/components/ui/upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { addEvent, getNextEventId } from "@/util/storage"
import { toast } from "sonner"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { GlobalContext } from "@/contexts/GlobalContext"
import { Image } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "@/components/Providers"
import { api } from "@/services/api"

const meetupSchema = z.object({
	name: z.string().min(1, "Informe o nome do evento"),
	description: z.string(),
	place: z.string().min(1, "Informe o local do evento"),
	start: z.string()
		.refine(val => /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(val), "Use o formato dd/mm/yyyy hh:mm")
		.transform(val => {
			const [date, time] = val.split(' ')
			const [d, M, y] = date.split('/')
			const [h, m] = time.split(':')
			return `${y}-${M.padStart(2, '0')}-${d.padStart(2, '0')} ${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`
		}),
	end: z.string()
		.refine(val => /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(val), "Use o formato dd/mm/yyyy hh:mm")
		.transform(val => {
			const [date, time] = val.split(' ')
			const [d, M, y] = date.split('/')
			const [h, m] = time.split(':')
			return `${y}-${M.padStart(2, '0')}-${d.padStart(2, '0')} ${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`
		}),
	available_subscriptions: z.string().min(1, 'Valor inválido'),
	category_id: z.string(),
	image: z.file('Anexe a imagem para o evento')
})

type MeetupSchema = z.infer<typeof meetupSchema>

export default function Add() {
	const router = useRouter()

	const [isWaiting, setIsWaiting] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		control
	} = useForm<MeetupSchema>({
		resolver: zodResolver(meetupSchema),
		defaultValues: {
			name: 'Evento',
			category_id: '1',
			description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quo velit illum reiciendis praesentium nesciunt officia, voluptatum esse necessitatibus non rerum nemo iure eaque reprehenderit maiores a ex corporis suscipit.',
			available_subscriptions: '50',
			start: '18/09/2025 10:00',
			end: '18/09/2025 11:00',
			place: 'Auditório Central'
		}
	})

	const { data: categories } = useQuery<Category[]>({
		queryKey: ['get-categories'],
		queryFn: async () => {
			const { data: response } = await api.get<Category[]>('category')

			return response
		}
	})

	const { mutate: handleAdd } = useMutation({
		mutationFn: async (data: MeetupSchema) => {
			setIsWaiting(true)

			const formData = new FormData()

			Object.entries(data).forEach(([key, value]) => {
				if(key !== 'image') {
					formData.append(key, value)
				} else if(value instanceof File) {
					formData.append(key, value, value.name)
				}
			})

			// formData.append('image', data.image, data.image.name)

			await api.post('meetup', formData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get-meetups']
			})

			toast.success('Seu evento foi criado!')

			router.replace('/home')
		},
		onError: error => {
			toast.error(error?.message || ' Ocorreu um erro ao cadastrar o torneio.')
		},
		onSettled: () => {
			setIsWaiting(false) 
		}
	})

	const errorMessages = Object.values(errors)

	return (
		<div className="flex flex-col gap-6">
			<form className="grid grid-cols-[1fr_2fr] gap-8" onSubmit={handleSubmit(handleAdd)}>
				<Controller
					name="image"
					control={control}
					render={({ field }) => (
						<div className="space-y-2">
							<Upload id="image" onFileChange={field.onChange}>
								{({ id }) => (
									<>
										<UploadViewer file={field.value} />

										<UploadTrigger id={id} file={field.value} className="flex flex-col gap-2">
											<Image size={28} />
											Enviar imagem
										</UploadTrigger>
									</>
								)}
							</Upload>

							{errors.image && (
								<p className="text-sm text-red-500">{errors.image.message}</p>
							)}
						</div>
					)}
				/>

				<div className="flex flex-col gap-4">
					<Input 
						label="Nome do evento" 
						placeholder="Ex.: Palestra sobre comunicação"
						{...register("name")}
					/>

					<Textarea 
						label="Detalhes do evento" 
						placeholder="Ex.: A palestra vem este ano recheada de novidades."
						{...register("description")}
					/>

					<Input 
						label="Nome do local" 
						placeholder="Ex.: Avenida Central, 123" 
						{...register("place")}
					/>

					<div className="flex gap-4">
						<Input 
							label="Data/hora de início" 
							placeholder="Ex.: 01/01/2021 10:00h" 
							{...register("start")}
						/>
						<Input
							label="Data/hora de término" 
							placeholder="Ex.: 01/01/2021 11:00h" 
							{...register("end")}
						/>
					</div>

					<Controller
						name="category_id"
						control={control}
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger className="w-full" id="category" label="Tipo de evento">
									<SelectValue placeholder="Selecione o tipo de evento" />
								</SelectTrigger>

								<SelectContent>
									{categories?.map(category => (
										<SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>

					<Input
						{...register("available_subscriptions")} 
						label="Quantidade de vagas" 
						placeholder="Ex.: 50" 
						className="w-40" 
						type="number"
					/>

					<ul className="flex flex-col leading-loose text-sm text-yellow-500 ml-2">
						{errorMessages.length > 0 && errorMessages.map(({ message }) => (
							<li key={message}>{message}</li>
						))}
					</ul>

					<Button disabled={isWaiting} type="submit">
						Criar evento
					</Button>
				</div>
			</form>
		</div>
	)
}