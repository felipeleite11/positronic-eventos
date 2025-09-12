import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function sessionRoutes(app: FastifyInstance) {
	app.post(
		'/', 
		async (request, reply) => {
			try {
				// const person = await prisma.person.findUnique({
				// 	where: {
				// 		id: 'cmfegl6uj0001zcs4g0nrbitm'
				// 	}
				// })

				// if(!person) {
				// 	throw new Error('Pessoa não encontrada.')
				// }

				return {
					name: 'Felipe Leite'
				}
			} catch(e: any) {
				return {
					message: e.message || 'Error: Cannot get the person.'
				}
			}
		}
	)
}
