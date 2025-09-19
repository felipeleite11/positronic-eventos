import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function roleRoutes(app: FastifyInstance) {
	app.get<{Params: { meetup_id: string, person_id: string }}>(
		'/',
		async (request, reply) => {
			const response = await prisma.meetupRole.findMany()

			return response
		}
	)
}