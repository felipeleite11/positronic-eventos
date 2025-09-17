import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function subscriptionRoutes(app: FastifyInstance) {
	app.get<{Params: { id: string, person_id: string }}>(
		'/:id/confirmation/:person_id',
		async (request, reply) => {
			const { id, person_id } = request.params

			const response = await prisma.subscription.findUnique({
				where: {
					personId_meetupId: {
						meetupId: id,
						personId: person_id
					}
				}
			})

			return response
		}
	)
}