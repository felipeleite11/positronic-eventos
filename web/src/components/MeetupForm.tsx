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

const meetupSchema = z.object({
	title: z.string().min(1, "Informe o nome do evento"),
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
	category_id: z.string(),
	image: z.file('Anexe a imagem para o evento')
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

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		reset
	} = useForm<MeetupSchema>({
		resolver: zodResolver(meetupSchema)
	})

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

			const formData = new FormData()

			Object.entries(data).forEach(([key, value]) => {
				if (key !== 'image') {
					formData.append(key, value)
				} else if (value instanceof File) {
					formData.append(key, value, value.name)
				}
			})

			await api.post(`meetup/${session?.user.person_id}`, formData)
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
			image: image || undefined
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

	const errorMessages = Object.values(errors)

	return (
		<form className="grid grid-cols-[1fr_2fr] gap-8" onSubmit={handleSubmit(submitFunction)}>
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
					{...register("title")}
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

				<ul className="flex flex-col leading-loose text-sm text-yellow-500 ml-2">
					{errorMessages.length > 0 && errorMessages.map(({ message }) => (
						<li key={message}>{message}</li>
					))}
				</ul>

				<Button disabled={isWaiting} type="submit">
					{mode === 'create' ? 'Criar evento' : 'Atualizar evento'}
				</Button>
			</div>
		</form>
	)
}