import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import axios from 'axios'

export async function certificateRoutes(app: FastifyInstance) {
	app.get<{ Params: { subscription_id: string } }>(
		'/:subscription_id',
		async (request, reply) => {
			const { subscription_id } = request.params

			const subscription = await prisma.subscription.findUnique({
				where: {
					id: subscription_id
				}
			})

			return {
				link: subscription?.certificateLink
			}
		} 
	)

	app.get<{ Params: { subscription_id: string } }>(
		'/:subscription_id/download',
		async (request, reply) => {
			const { subscription_id } = request.params

			const subscription = await prisma.subscription.findUnique({
				where: {
					id: subscription_id
				}
			})

			if(!subscription?.certificateLink) {
				return null
			}

			const { data: certificate } = await axios.get(subscription.certificateLink, {
				responseType: 'arraybuffer'
			})

			return reply
				.header("Content-Type", "application/pdf")
				.header("Content-Disposition", `attachment; filename="certificado.pdf"`)
				.header("Cache-Control", "no-store")
				.send(certificate)
		} 
	)
}