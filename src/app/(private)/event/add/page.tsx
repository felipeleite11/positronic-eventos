'use client'

import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, UploadTrigger, UploadViewer } from "@/components/ui/upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addEvent, getNextEventId } from "@/util/storage"
import { toast } from "sonner"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { GlobalContext } from "@/contexts/GlobalContext"

const eventSchema = z.object({
	name: z.string().min(1, "Informe o nome do evento"),
	description: z.string(),
	place: z.string().min(1, "Informe o local do evento"),
	start: z.string().regex(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/g, 'A data/hora deve estar no formato: dd/mm/yyyy hh:mm'),
	end: z.string().regex(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/g, 'A data/hora deve estar no formato: dd/mm/yyyy hh:mm'),
	available_subscriptions: z.string().min(1, 'Valor inválido'),
	category: z.string()
})

type EventSchema = z.infer<typeof eventSchema>

export default function Add() {
	const { person } = useContext(GlobalContext)

	const router = useRouter()

	const [isWaiting, setIsWaiting] = useState(false)

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<EventSchema>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			name: 'Palestra Prof. Dr. Carlos Nogueira',
			category: 'palestra',
			description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quo velit illum reiciendis praesentium nesciunt officia, voluptatum esse necessitatibus non rerum nemo iure eaque reprehenderit maiores a ex corporis suscipit.',
			available_subscriptions: '50',
			start: '18/09/2025 10:00',
			end: '18/09/2025 11:00',
			place: 'Auditório Central'
		}
	})

	const handleAdd: SubmitHandler<EventSchema> = async (data: EventSchema) => {
		try {
			setIsWaiting(true)

			await new Promise(r => setTimeout(r, 1000))

			const nextId = getNextEventId()

			addEvent({
				id: nextId,
				creator: person!,
				name: data.name,
				description: data.description,
				period: {
					start: data.start,
					end: data.end
				},
				place: {
					name: data.place,
					address_text: '-'
				},
				status: 'agendado',
				available_subscriptions:  +data.available_subscriptions
			})

			toast.success('Seu evento foi criado!')

			router.push('/')
		} catch (e: any) {
			toast.error(e.message)
		} finally {
			setIsWaiting(false)
		}
	}

	const errorMessages = Object.values(errors)

	const selectedCategory = watch('category')

	return (
		<div className="flex flex-col gap-6">
			<form className="grid grid-cols-[1fr_2fr] gap-8" onSubmit={handleSubmit(handleAdd)}>
				<Upload value="image">
					{({ image, value }) => {
						return (
							<>
								<UploadViewer file={image} />

								<UploadTrigger value={value} file={image}>
									Enviar imagem
								</UploadTrigger>
							</>
						)
					}}
				</Upload>

				<div className="flex flex-col gap-6">
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

					<Select
						value={selectedCategory}
          				onValueChange={option => setValue('category', option)}
					>
						<SelectTrigger className="w-full" id="category" label="Tipo de evento">
							<SelectValue placeholder="Selecione o tipo de evento" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="conferencia">Conferência</SelectItem>
							<SelectItem value="lançamento">Lançamento</SelectItem>
							<SelectItem value="palestra">Palestra</SelectItem>
							<SelectItem value="reuniao">Reunião</SelectItem>
							<SelectItem value="seminario">Seminário</SelectItem>
							<SelectItem value="treinamento">Treinamento</SelectItem>
							<SelectItem value="webinar">Webinar</SelectItem>
							<SelectItem value="workshop">Workshop</SelectItem>
						</SelectContent>
					</Select>

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