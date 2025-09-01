'use client'

import { format } from 'date-fns'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'

const tournaments: Tournament[] = [
	{
		id: 1,
		title: 'Bolão Garden City 2',
		offered_subscriptions: 16,
		remaining_subscriptions: 14,
		status: 'finished',
		categories: [
			{
				id: 1,
				name: 'Masculina C'
			},
			{
				id: 2,
				name: 'Masculina D'
			}
		],
		subscriptions: [
			{
				id: 1,
				user: {
					id: 1,
					name: 'Felipe Leite',
					image: '/images/boy.jpg'
				},
				date: format(new Date(), 'dd/MM/yyyy HH:mm'),
				price: 1000
			},
			{
				id: 2,
				user: {
					id: 2,
					name: 'Kleizy Guimarães',
					image: '/images/girl.png'
				},
				date: format(new Date(), 'dd/MM/yyyy HH:mm'),
				price: 1000
			}
		],
		price: 1000,
		amount: 2000,
		subscription_period: {
			start: format(new Date(), 'dd/MM/yyyy HH:mm'),
			end: format(new Date(), 'dd/MM/yyyy HH:mm')
		},
		arena: {
			id: 1,
			address: 'Rod. Augusto Montenegro, 1000',
			name: 'Condomínio Cidade Jardim II',
			image: '/images/arena.png',
			position: {
				lat: 0,
				lng: 0
			},
			gallery: [],
			region: {
				id: 1,
				name: 'Augusto Montenegro / Icoaraci'
			}
		}
	},
	
	{
		id: 2,
		title: 'II Torneio Inter Arenas',
		offered_subscriptions: 48,
		remaining_subscriptions: 48,
		subscriptions: [],
		price: 1000,
		amount: 0,
		categories: [
			{
				id: 1,
				name: 'Masculina C'
			},
			{
				id: 2,
				name: 'Masculina D'
			}
		],
		subscription_period: {
			start: format(new Date(), 'dd/MM/yyyy HH:mm'),
			end: format(new Date(), 'dd/MM/yyyy HH:mm')
		},
		status: 'available_subscription',
		arena: {
			id: 1,
			address: 'Rod. Augusto Montenegro, 300',
			name: 'DBeach Premium',
			image: '/images/dbeach/1.jpg',
			position: {
				lat: 0,
				lng: 0
			},
			gallery: [],
			region: {
				id: 1,
				name: 'Augusto Montenegro / Icoaraci'
			}
		}
	}
]

export default function TournamentList() {
	function getStatusBadge(status: string) {
		switch (status) {
			case 'available_subscription':
				return <span className="text-[0.6rem] bg-emerald-600 text-white rounded-md p-1">INSCRIÇÕES ABERTAS</span>

			case 'cancelled':
				return <span className="text-[0.6rem] bg-red-500 text-white rounded-md p-1">CANCELADO</span>

			case 'finished':
				return <span className="text-[0.6rem] bg-sky-500 text-white rounded-md p-1">FINALIZADO</span>
		}
	}

	return (
		<div className="w-full pr-8 flex flex-col gap-6 overflow-y-auto">
			<h1 className="font-semibold text-3xl">Torneios abertos</h1>

			{tournaments.map(tournament => {
				const isSubscriptionAvailable = tournament.status === 'available_subscription'

				return (
					<div key={tournament.id} className="flex flex-col gap-4 border-t border-t-slate-200 dark:border-t-slate-600 pt-2">
						<div className="flex justify-between gap-6">
							<div className="flex flex-col gap-2">
								<div className="flex gap-3 items-center font-semibold">
									<span className="font-semibold text-xl">{tournament.title}</span>

									{getStatusBadge(tournament.status)}
								</div>

								<span className="text-sm">Inscrições: R$ {tournament.price! / 100}</span>

								<span className="text-sm flex gap-2">
									Local: {tournament.arena.name}
									<a href="https://www.google.com/maps" target="_blank">
										<ExternalLink size={15} className="cursor-pointer" />
									</a>
								</span>
							</div>

							<div className="flex flex-col items-end gap-2 group">
								<Button
									className="bg-orange-600 text-white cursor-pointer hover:bg-orange-500"
									onClick={() => { }}
									disabled={!isSubscriptionAvailable}
								>
									Inscrever-se
								</Button>

								{isSubscriptionAvailable && (
									<span className="flex text-slate-400 text-xs">
										{tournament.remaining_subscriptions} vagas
									</span>
								)}
							</div>
						</div>

						<div className="flex flex-col gap-3">
							{tournament.subscriptions.length > 0 ? (
								<span className="font-semibold">Participantes ({tournament.subscriptions.length} inscritos)</span>
							) : (
								<span className="italic text-sm text-slate-400">Nenhum inscrito</span>
							)}

							<ul className="flex flex-col gap-2 max-h-36 overflow-y-auto">
								{tournament.subscriptions.map(subscription => (
									<li key={subscription.id} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
										<Avatar className="w-6 h-6">
											<AvatarImage src={subscription.user.image} />
											<AvatarFallback>{subscription.user.name[0].toUpperCase()}</AvatarFallback>
										</Avatar>

										<span className="text-sm">{subscription.user.name}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				)
			})}
		</div>
	)
}
