import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function meetupInviteSheetRoutes(app: FastifyInstance) {
	app.get<{ Params: { meetup_id: string } }>(
		'/:meetup_id',
		async (request, reply) => {
			const response = await prisma.meetupInviteSheet.findMany({
				where: {
					meetupId: request.params.meetup_id
				},
				include: {
					person: true
				}
			})

			return response
		}
	)
}