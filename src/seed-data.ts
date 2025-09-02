import { Event } from "@/types/Event"

export const events: Event[] = [
	{
		id: 1,
		name: 'Encontro Anual de Engenharia Civil do RJ',
		period: {
			start: '14/09/2025 10:00h',
			end: '14/09/2025 11:00h'
		},
		status: 'agendado',
		description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa?',
		place: {
			id: 1,
			name: 'Auditório Central da UFRJ',
			address_text: 'Avenida Brasil, 2000 - Urca - Rio de Janeiro - RJ - 12345678',
			address: {
				country: 'Brasil',
				state: 'Rio de Janeiro',
				city: 'Rio de Janeiro',
				district: 'Urca',
				street: 'Avenida Brasil',
				number: '2000',
				zipcode: '12345678'
			}
		},
		available_subscriptions: 120,
		creator: {
			id: 1,
			name: 'Felipe Leite'
		},
		participants: []
	},
	{
		id: 2,
		name: 'Encontro Anual de Engenharia Civil da Barra',
		description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt, quasi vero, natus laborum facilis quas corporis nobis neque laboriosam veritatis maiores. Blanditiis, numquam ducimus! Cumque quo harum sit sunt ipsa?',
		period: {
			start: '16/09/2025 10:00h',
			end: '16/09/2025 11:00h'
		},
		status: 'finalizado',
		place: {
			id: 2,
			name: 'Sala de Palestras do Shopping da Barra',
			address_text: 'Avenida Brasil, 4000 - Barra da Tijuca - Rio de Janeiro - RJ - 12345670',
			address: {
				country: 'Brasil',
				state: 'Rio de Janeiro',
				city: 'Rio de Janeiro',
				district: 'Barra da Tijuca',
				street: 'Avenida Brasil',
				number: '4000',
				zipcode: '12345670'
			}
		},
		available_subscriptions: 450,
		creator: {
			id: 2,
			name: 'Adozindo Neto'
		},
		participants: [
			{
				id: 1,
				name: 'Felipe Leite'
			},
			{
				id: 2,
				name: 'Adozindo Neto'
			}
		]
	}
]