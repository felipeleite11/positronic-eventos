import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function categoryRoutes(app: FastifyInstance) {
	app.route({
		method: ["GET"],
		url: '/',
		async handler(request, reply) {
			const response = await prisma.category.findMany()

			return response
		}
	})
}