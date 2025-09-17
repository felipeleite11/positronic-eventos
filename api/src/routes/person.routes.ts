import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function personRoutes(app: FastifyInstance) {
	app.get(
		'/', 
		async (request, reply) => {
			try {
				const people = await prisma.person.findMany()

				return people
			} catch(e: any) {
				return {
					message: e.message || 'Error: Cannot get people.'
				}
			}
		}
	)

	app.get<{Params: { id: string }}>(
		'/:id', 
		async (request, reply) => {
			try {
				const person = await prisma.person.findUnique({
					where: {
						id: request.params.id
					}
				})

				return person
			} catch(e: any) {
				return {
					message: e.message || 'Error: Cannot get person.'
				}
			}
		}
	)

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
