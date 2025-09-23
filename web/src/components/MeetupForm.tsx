'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { queryClient } from "./Providers"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/services/api"
import { Meetup } from "@/types/Meetup"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Upload, UploadTrigger, UploadViewer } from "./ui/upload"
import { Image } from "lucide-react"
import { format } from "date-fns"
import { urlToFile } from "@/util/file"
import { AddressForm } from "./AddressForm"

const meetupSchema = z.object({
	title: z.string().min(1, "Informe o nome do evento"),
	description: z.string().optional(),
	place: z.string().min(1, "Informe o local do evento"),
	start: z.string()
		.refine(val => /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(val), "Use o formato 'dd/mm/yyyy hh:mm'")
		.transform(val => {
			const [date, time] = val.split(' ')
			const [d, M, y] = date.split('/')
			const [h, m] = time.split(':')
			return `${y}-${M.padStart(2, '0')}-${d.padStart(2, '0')} ${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`
		}),
	end: z.string()
		.refine(val => /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(val), "Use o formato 'dd/mm/yyyy hh:mm'")
		.transform(val => {
			const [date, time] = val.split(' ')
			const [d, M, y] = date.split('/')
			const [h, m] = time.split(':')
			return `${y}-${M.padStart(2, '0')}-${d.padStart(2, '0')} ${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`
		}),
	category_id: z.string(),
	workload: z.string()
		.refine(val => /^\d+( horas)$/.test(val), "Use o formato 'XX horas'")
		.transform(val => {
			return val.replace(' horas', '')
		}),
	image: z.file('Anexe uma imagem para o evento'),
	zipcode: z.string()
		.refine(val => /^\d{5}\-\d{3}$/.test(val), "Use o formato '00000-000'"),
	state: z.string(),
	city: z.string(),
	district: z.string().min(1, 'Informe o bairro onde ocorrerá o evento'),
	street: z.string().min(1, 'Informe a rua onde ocorrerá o evento'),
	number: z.string(),
	complement: z.string()
})

type MeetupSchema = z.infer<typeof meetupSchema>

interface MeetupFormProps {
	mode: 'create' | 'update'
}

export function MeetupForm({ mode }: MeetupFormProps) {
	const { data: session } = useSession()

	const { id } = useParams()

	const router = useRouter()

	const [isWaiting, setIsWaiting] = useState(false)

	const formHandlers = useForm<MeetupSchema>({
		resolver: zodResolver(meetupSchema)
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		reset
	} = formHandlers

	const { data: meetup } = useQuery({
		queryKey: ['get-meetup-by-id'],
		queryFn: async () => {
			const { data } = await api.get<Meetup>(`meetup/${id}`)

			return data
		},
		enabled: !!id
	})

	const { data: categories } = useQuery<Category[]>({
		queryKey: ['get-categories'],
		queryFn: async () => {
			const { data: response } = await api.get<Category[]>('category')

			return response
		}
	})

	const { mutate: handleCreate } = useMutation({
		mutationFn: async (data: MeetupSchema) => {
			setIsWaiting(true)

			console.log('data create', data)

			const formData = new FormData()

			Object.entries(data).forEach(([key, value]) => {
				if (key !== 'image') {
					formData.append(key, value)
				} else if (value instanceof File) {
					formData.append(key, value, value.name)
				}
			})

			// await api.post(`meetup/${session?.user.person_id}`, formData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get-meetups']
			})

			toast.success('Seu evento foi criado!')

			// router.replace('/home')
		},
		onError: error => {
			toast.error(error?.message || ' Ocorreu um erro ao cadastrar o torneio.')
		},
		onSettled: () => {
			setIsWaiting(false)
		}
	})

	const { mutate: handleUpdate } = useMutation({
		mutationFn: async (data: MeetupSchema) => {
			setIsWaiting(true)

			const formData = new FormData()

			Object.entries(data).forEach(([key, value]) => {
				if (key !== 'image') {
					formData.append(key, value)
				} else if (value instanceof File) {
					formData.append(key, value, value.name)
				}
			})

			await api.put(`meetup/${id}/${session?.user.person_id}`, formData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['get-meetups']
			})

			toast.success('Seu evento foi atualizado!')

			router.replace(`/meetup/${id}`)
		},
		onError: error => {
			toast.error(error?.message || ' Ocorreu um erro ao cadastrar o torneio.')
		},
		onSettled: () => {
			setIsWaiting(false)
		}
	})

	async function fillFormData(meetup: Meetup) {
		const image = await urlToFile(meetup.image)

		reset({
			title: meetup.title,
			category_id: meetup.category?.id,
			description: meetup.description,
			start: format(new Date(meetup.start), 'dd/MM/yyyy hh:mm'),
			end: format(new Date(meetup.end), 'dd/MM/yyyy hh:mm'),
			place: 'Auditório Central',
			image: image || undefined,

			// TODO: ADICIONAR CAMPOS DE ENDEREÇO PARA EDIÇÃO
		})
	}

	useEffect(() => {
		if (meetup) {
			fillFormData(meetup)
		}
	}, [meetup])

	async function handleAdd(values: MeetupSchema) {
		handleCreate(values)
	}

	async function handleEdit(values: MeetupSchema) {
		handleUpdate(values)
	}

	const submitFunction = mode === 'create' ? handleAdd : handleEdit

	return (
		<form className="grid grid-cols-[1fr_2fr] gap-8" onSubmit={handleSubmit(submitFunction)}>
			<Controller
				name="image"
				control={control}
				render={({ field }) => (
					<div className="space-y-2">
						<Upload 
							id="image" 
							onFileChange={field.onChange}
							validationMessage={errors.image?.message}
						>
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
					</div>
				)}
			/>

			<div className="flex flex-col gap-4">
				<Input
					label="Nome do evento"
					placeholder="Ex.: Palestra sobre comunicação"
					{...register("title")}
					validationMessage={errors.title?.message}
				/>

				<Textarea
					label="Detalhes do evento"
					placeholder="Ex.: A palestra vem este ano recheada de novidades."
					{...register("description")}
					validationMessage={errors.description?.message}
				/>

				<Input
					label="Nome do local"
					placeholder="Ex.: Avenida Central, 123"
					{...register("place")}
					validationMessage={errors.place?.message}
				/>

				<div className="flex gap-4">
					<Input
						label="Data/hora de início"
						placeholder="Ex.: 01/01/2021 10:00h"
						{...register("start")}
						validationMessage={errors.start?.message}
					/>

					<Input
						label="Data/hora de término"
						placeholder="Ex.: 01/01/2021 11:00h"
						{...register("end")}
						validationMessage={errors.end?.message}
					/>
				</div>

				<div className="flex gap-4">
					<Controller
						name="category_id"
						control={control}
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={field.onChange}
							>
								<SelectTrigger 
									className="w-full" 
									id="category" 
									label="Tipo de evento"
									validationMessage={errors.category_id?.message ? 'Selecione a categoria' : undefined}
								>
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
						label="Carga horária"
						placeholder="Ex.: 20 horas"
						{...register("workload")}
						validationMessage={errors.workload?.message}
					/>
				</div>

				<div className="flex gap-4">
					<AddressForm formHandlers={formHandlers} />
				</div>

				<Button disabled={isWaiting} type="submit">
					{mode === 'create' ? 'Criar evento' : 'Atualizar evento'}
				</Button>
			</div>
		</form>
	)
}