import { FastifyInstance, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'

interface SessionRequestBody {
	email: string
	password: string
}

export async function sessionRoutes(app: FastifyInstance) {
	app.post(
		'/', 
		async (request: FastifyRequest<{ Body: SessionRequestBody }>, reply) => {
			try {
				const { email, password } = request.body

				const user = await prisma.user.findUnique({
					include: {
						person: true
					},
					where: {
						email
					}
				})

				if(!user) {
					throw new Error('Usuário não encontrado.')
				}

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					person_id: user.person?.id,
					person: user.person
				}
			} catch(e: any) {
				return {
					message: e.message || 'Error: Cannot get the person.'
				}
			}
		}
	)
}
