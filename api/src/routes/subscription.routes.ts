import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function subscriptionRoutes(app: FastifyInstance) {
	app.get<{Params: { meetup_id: string, person_id: string }}>(
		'/:meetup_id/confirmation/:person_id',
		async (request, reply) => {
			const { meetup_id, person_id } = request.params

			const response = await prisma.subscription.findUnique({
				where: {
					personId_meetupId: {
						meetupId: meetup_id,
						personId: person_id
					}
				}
			})

			return response
		}
	)

	app.patch<{Params: { id: string }}>(
		'/:id/toggle_confirmation',
		async (request, reply) => {
			const { id } = request.params

			const subscription = await prisma.subscription.findUnique({
				where: {
					id
				}
			})

			if(!subscription) {
				throw new Error('Inscrição não encontrada.')
			}

			const response = await prisma.subscription.update({
				where: {
					id
				},
				data: {
					presenceConfirmation: !subscription.presenceConfirmation
				}
			})

			return response
		}
	)
}