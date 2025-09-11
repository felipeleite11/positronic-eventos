import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { uploadToMinio } from '../config/file-storage'

interface MeetupCreateProps {
	name: string
	description?: string
	category_id: string
	image?: string
	available_subscriptions: number
	start: string
	end: string
	place: string
}

export async function meetupRoutes(app: FastifyInstance) {
	app.route({
		method: ["POST"],
		url: '/',
		async handler(request, reply) {
			try {
				const parts = request.parts()

				const data: Partial<MeetupCreateProps> = {}

				for await (const part of parts) {
					if (part.type === "file") {
						const link = await uploadToMinio(part)

						data[part.fieldname as keyof MeetupCreateProps] = link as any
					} else {
						data[part.fieldname as keyof MeetupCreateProps] = part.value as any
					}
				}
				
				console.log(data)

				const address = await prisma.address.create({
					data: {
						street: data.place!,
						city: data.place!,
						district: data.place!,
						number: data.place!,
						state: data.place!,
						zipcode: data.place!
					}
				})

				const meetup = await prisma.meetup.create({
					data: {
						title: data.name!,
						description: data.description,
						datetime: new Date(data.start!),
						categoryId: data.category_id!,
						image: data.image,
						addressId: address.id
					}
				})

				return meetup
			} catch(e: any) {
				console.log(e)

				return {
					message: `Error: ${e.message}`
				}
			}
		}
	})
}