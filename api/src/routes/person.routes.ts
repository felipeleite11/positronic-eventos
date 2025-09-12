import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function personRoutes(app: FastifyInstance) {
	app.get<{Params: { id: string }}>(
		'/by_user/:id', 
		async (request, reply) => {
			try {
				const person = await prisma.person.findFirst({
					where: {
						userId: request.params.id
					}
				})

				if(!person) {
					throw new Error('Pessoa não encontrada.')
				}

				return person
			} catch(e: any) {
				return {
					message: e.message || 'Error: Cannot get the person.'
				}
			}
		}
	)
}
