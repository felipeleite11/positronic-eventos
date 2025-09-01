'use client'

import { useEffect, useState } from "react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import LeafletMap from "@/components/Map"
import Image from "next/image"
import { format } from "date-fns"
import { CalendarCheck, Clock, Map, Phone } from "lucide-react"

import 'leaflet/dist/leaflet.css'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"

const availableRegions = [
	{ value: '1', text: 'Augusto Montenegro / Icoaraci' },
	{ value: '2', text: 'Ananindeua' },
	{ value: '3', text: 'Belém Centro' }
]

const arenas: Arena[] = [
	{
		id: 1,
		name: 'DBeach Premium',
		image: '/images/dbeach/dbeach.png',
		modalities: [
			'beach tennis', 'voleibol'
		],
		contacts: ['(91) 99999-9999 (WhatsApp)', 'arenadbeach@gmail.com'],
		business_hours: 'Seg. a sex. 09h às 22h, sáb. 10h às 21h',
		day_use: 'Seg. a sex. 09h às 22h, sáb. 10h às 21h',
		region: {
			id: 1,
			name: 'Augusto Montenegro / Icoaraci'
		},
		gallery: [
			{
				title: 'Foto 1',
				url: '/images/dbeach/2.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 2',
				url: '/images/dbeach/3.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 3',
				url: '/images/dbeach/4.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 4',
				url: '/images/dbeach/5.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 5',
				url: '/images/dbeach/6.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 6',
				url: '/images/dbeach/7.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 7',
				url: '/images/dbeach/1.jpg',
				description: 'Areia tratada toda semana.'
			}
		],
		address: 'Rod. Augusto Montenegro, 300',
		tournaments: [
			{
				id: 2,
				title: 'II Torneio Inter Arenas',
				offered_subscriptions: 48,
				remaining_subscriptions: 48,
				subscriptions: [],
				price: 10000,
				image: '/images/torneio.jpg',
				amount: 0,
				subscription_period: {
					start: format(new Date(), 'dd/MM/yyyy HH:mm'),
					end: format(new Date(), 'dd/MM/yyyy HH:mm')
				},
				status: 'available_subscription',
				categories: [
					{
						id: 1,
						name: 'Masculina C'
					},
					{
						id: 2,
						name: 'Masculina D'
					}
				]
			},
			{
				id: 3,
				title: 'III Torneio Inter Arenas',
				offered_subscriptions: 40,
				remaining_subscriptions: 40,
				subscriptions: [],
				price: 8000,
				image: '/images/torneio.jpg',
				amount: 0,
				subscription_period: {
					start: format(new Date(), 'dd/MM/yyyy HH:mm'),
					end: format(new Date(), 'dd/MM/yyyy HH:mm')
				},
				status: 'available_subscription',
				categories: [
					{
						id: 1,
						name: 'Masculina C'
					},
					{
						id: 3,
						name: 'Feminina C'
					}
				]
			}
		],
		teachers: [
			{
				id: 1,
				image: '/images/professor.jpg',
				name: 'Lucas Monteiro'
			},
			{
				id: 2,
				image: '/images/professor2.png',
				name: 'Nayana Cabral'
			}
		]
	},

	{
		id: 2,
		name: 'Afluar',
		contacts: ['(91) 99999-9999 (WhatsApp)', 'arenadbeach@gmail.com'],
		image: '/images/afluar/afluar.png',
		region: {
			id: 3,
			name: 'Belém Centro'
		},
		gallery: [
			{
				title: 'Foto 1',
				url: '/images/afluar/1.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 2',
				url: '/images/afluar/2.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 3',
				url: '/images/afluar/3.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 4',
				url: '/images/afluar/4.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 5',
				url: '/images/afluar/5.png',
				description: 'Areia tratada toda semana.'
			}
		],
		address: 'Rua São Boaventura, 104 - Cidade Velha'
	},

	{
		id: 3,
		name: 'Condomínio Cidade Jardim II',
		contacts: ['(91) 99999-9999 (WhatsApp)', 'arenadbeach@gmail.com'],
		image: '/images/arena.png',
		region: {
			id: 1,
			name: 'Augusto Montenegro / Icoaraci'
		},
		gallery: [
			{
				title: 'Foto 1',
				url: '/images/afluar/1.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 2',
				url: '/images/afluar/2.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 3',
				url: '/images/afluar/3.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 4',
				url: '/images/afluar/4.jpg',
				description: 'Areia tratada toda semana.'
			},
			{
				title: 'Foto 5',
				url: '/images/afluar/5.png',
				description: 'Areia tratada toda semana.'
			}
		],
		address: 'Rod. Augusto Montenegro, 1000'
	}
]

export default function Places() {
	const [selectedRegionId, setSelectedRegionId] = useState('1')
	const [arenasInSelectedRegion, setArenasInSelectedRegion] = useState<Arena[]>([])
	const [selectedArenaId, setSelectedArenaId] = useState('')

	useEffect(() => {
		if (selectedRegionId) {
			const arenasInRegion = arenas.filter(arena => arena.region.id === +selectedRegionId)

			setArenasInSelectedRegion(arenasInRegion)
		}
	}, [selectedRegionId])

	const selectedArena = arenasInSelectedRegion.find(arena => arena.id === +selectedArenaId)

	return (
		<main className="pl-10 pt-8 flex flex-col gap-6 h-[93vh]">
			<h1 className="font-semibold text-3xl border-b border-b-slate-200 dark:border-b-slate-600 pb-6">Quadras e Arenas</h1>

			<div className="text-sm flex items-center gap-2">
				<span>Região:</span>

				<Select value={selectedRegionId || ''} onValueChange={setSelectedRegionId}>
					<SelectTrigger className="w-80 cursor-pointer">
						<SelectValue placeholder="Selecione" />
					</SelectTrigger>

					<SelectContent>
						{availableRegions.map(region => (
							<SelectItem key={region.value} value={region.value}>
								{region.text}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="text-sm flex items-center gap-2">
				<span>Arena:</span>

				{selectedRegionId && (
					<>
						{arenasInSelectedRegion.length > 0 ? (
							<Select value={selectedArenaId || ''} onValueChange={setSelectedArenaId}>
								<SelectTrigger className="w-80 cursor-pointer">
									<SelectValue placeholder="Selecione" />
								</SelectTrigger>

								<SelectContent>
									{arenasInSelectedRegion.map(region => (
										<SelectItem key={region.id} value={String(region.id)}>
											{region.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<span className="italic text-slate-400 text-sm">Nenhuma arena cadastrada nesta região</span>
						)}
					</>
				)}
			</div>

			<ArenaContainer arena={selectedArena} />
		</main>
	)
}

function ArenaContainer({ arena }: { arena?: Arena }) {
	if (!arena) {
		return null
	}

	return (
		<div className="flex flex-col gap-4 text-sm mt-4 pb-8 mr-8">
			<div className="flex gap-4 items-end">
				<Image src={arena.image} alt={arena.name} width={300} height={100} className="object-cover h-16 w-16 rounded-md" />

				<h2 className="text-xl font-semibold">{arena.name}</h2>
			</div>

			<div className="flex gap-12">
				<div className="flex flex-col gap-4 mt-4">
					<div className="flex items-center gap-1">
						<Map size={16} />
						Endereço: {arena.address}
					</div>

					<div className="flex items-center gap-1">
						<Phone size={16} />
						Contatos: {arena.contacts?.map(contact => contact).join(' - ')}
					</div>

					<div className="flex items-center gap-1">
						<Clock size={16} />
						Horário de funcionamento: {arena.business_hours}
					</div>

					<div className="flex items-center gap-1">
						<CalendarCheck size={16} />
						Day use: {arena.day_use}
					</div>
				</div>

				{/* Status: Fazer barra de progresso ao redor da imagem */}
				{/* <div className="">
					<Image src="/images/dbeach/1.jpg" alt="" width={300} height={300} className="rounded-md" />
				</div> */}
			</div>

			<div className="flex flex-col gap-4">
				<h3 className="text-lg font-semibold mt-2">Fotos</h3>

				{arena.gallery.length > 0 ? (
					<section className="xl:columns-[4] lg:columns-[3] gap-6 w-fit">
						{arena.gallery.map(image => (
							<div key={image.url} className="flex flex-col gap-2 group relative cursor-pointer mb-6">
								<Image src={image.url} alt="" width={300} height={300} className="w-64 rounded-md shadow-md group-hover:opacity-40 transition-opacity" />
								
								{image.description && <span className="hidden group-hover:block font-medium absolute top-6 left-6 line-clamp-6">{image.description}</span>}
							</div>
						))}

						{/* Adicionar um "Ver mais" */}
					</section>
				) : (
					<span className="text-sm italic text-slate-400">Nenhuma foto cadastrada</span>
				)}
			</div>

			<div className="flex flex-col gap-4">
				<h3 className="text-lg font-semibold mt-2">Localização</h3>
			
				<LeafletMap
					lat={-1.3710349016107874}
					lng={-48.44330618579579}
					marker_message="Vem pra DBeach!"
				/>

				<a href="https://maps.app.goo.gl/BjYqcCu8fwHDG6ia8" target="_blank" className="text-sky-500 hover:text-sky-600">Como chegar?</a>
			</div>

			<div className="flex flex-col gap-6">
				<h3 className="text-lg font-semibold mt-2">Torneios</h3>

				<div className="flex flex-col xl:grid xl:grid-cols-2 gap-8 w-fit">
					{arena.tournaments?.map(tournament => (
						<div key={tournament.id} className="flex items-center gap-4 cursor-pointer bg-slate-100/10 hover:bg-slate-100/5 transition-all w-[29rem] 2xl:w-[33rem] pr-8 rounded-md overflow-hidden">
							<Image src={tournament.image!} alt="" width={500} height={500} className="object-contain h-36 w-fit" />

							<div className="flex flex-col gap-2 leading-loose">
								<span className="font-semibold text-lg">{tournament.title}</span>

								<span className="text-sm">Vagas: {tournament.offered_subscriptions}</span>

								{tournament.categories && <span className="text-sm">Categorias: {tournament.categories.map(category => category.name).join(', ')}</span>}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<h3 className="text-lg font-semibold mt-2">Professores</h3>

				<ul className="flex gap-12 flex-wrap">
					{arena.teachers?.map(teacher => (
						<li key={teacher.id} className="flex flex-col justify-center gap-3">
							<Avatar className="w-24 h-24">
								<AvatarImage src={teacher.image} className="object-cover w-full" />
								<AvatarFallback>{teacher.name[0].toUpperCase()}</AvatarFallback>
							</Avatar>

							<span className="font-semibold">{teacher.name}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}