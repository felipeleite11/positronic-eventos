import { FastifyInstance } from 'fastify'
import { format, isSameDay } from 'date-fns'
import { prisma } from '../lib/prisma'
import { uploadToMinio } from '../config/file-storage'
import { generateCertificate } from '../routines/generateCertificate'
import { whatsappSend } from '../routines/whatsappSend'
import { extractNumbers } from '../utils/string'
import { create } from 'domain'

interface MeetupProps {
	title: string
	description?: string
	category_id: string
	image?: string
	available_subscriptions: number
	start: string
	end: string
	place: string
	workload: string

	zipcode: string
	state: string
	city: string
	district: string
	street: string
	number: string
	complement: string
}

export async function meetupRoutes(app: FastifyInstance) {
	app.get<{ Headers: { auth: string } }>(
		'/',
		async (request, reply) => {
			const meetups = await prisma.meetup.findMany({
				include: {
					subscriptions: {
						where: {
							personId: request.headers.auth
						}
					},
					address: true,
					followers: {
						where: {
							personId: request.headers.auth
						}
					}
				}
			})

			return meetups
		}
	)

	app.get<{ Params: { id: string } }>(
		'/:id/invitations',
		async (request, reply) => {
			const meetups = await prisma.meetup.findUnique({
				where: {
					id: request.params.id
				},
				include: {
					subscriptions: true,
					invites: {
						include: {
							person: true
						}
					}
				}
			})

			return meetups
		}
	)

	app.get<{ Params: { person_id: string } }>(
		'/search/:person_id',
		async (request, reply) => {
			const search = (request.query as { q?: string }).q || ''

			const result = await prisma.meetup.findMany({
				where: {
					invites: {
						some: {
							personId: request.params.person_id
						}
					},
					OR: [
						{
							title: {
								contains: search
							}
						},
						{
							description: {
								contains: search
							}
						}
					]
				},
				include: {
					address: true
				}
			})

			return result
		}
	)

	app.get<{ Params: { id: string } }>(
		'/:id',
		async (request, reply) => {
			try {
				const meetup = await prisma.meetup.findUnique({
					where: {
						id: request.params.id
					},
					include: {
						address: true,
						creator: true,
						subscriptions: {
							include: {
								person: true,
								meetupRole: true
							}
						},
						meetupAdmins: true,
						followers: true,
						category: true
					}
				})

				if (!meetup) {
					throw new Error('Evento não encontrado.')
				}

				return meetup
			} catch (e: any) {
				return {
					message: e.message || 'Error: Cannot get the meetup.'
				}
			}
		}
	)

	app.get<{ Params: { id: string, person_id: string } }>(
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

	app.get<{ Params: { id: string, person_id: string } }>(
		'/:id/invitation/:person_id',
		async (request, reply) => {
			const { id, person_id } = request.params

			console.log(id, person_id)

			const response = await prisma.invite.findUnique({
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

	app.post<{ Params: { id: string, person_id: string } }>(
		'/:id/subscribe/:person_id',
		async (request, reply) => {
			const { id, person_id } = request.params

			const subscription = await prisma.subscription.create({
				data: {
					meetupId: id,
					personId: person_id,
					meetupRoleId: '1'
				}
			})

			return subscription
		}
	)

	app.patch<{ Params: { id: string, person_id: string } }>(
		'/:id/confirmation/:person_id',
		async (request, reply) => {
			const { id, person_id } = request.params

			const reponse = await prisma.subscription.update({
				where: {
					personId_meetupId: {
						meetupId: id,
						personId: person_id
					}
				},
				data: {
					presenceConfirmation: true
				}
			})

			return reponse
		}
	)

	app.patch<{ Params: { id: string, person_id: string } }>(
		'/:id/following_toggle/:person_id',
		async (request, reply) => {
			const { id, person_id } = request.params

			const meetupFollower = await prisma.meetupFollower.findUnique({
				where: {
					meetupId_personId: {
						meetupId: id,
						personId: person_id
					}
				}
			})

			if (!meetupFollower) {
				const response = await prisma.meetupFollower.create({
					data: {
						meetupId: id,
						personId: person_id
					}
				})

				return response
			} else {
				await prisma.meetupFollower.delete({
					where: {
						meetupId_personId: {
							meetupId: id,
							personId: person_id
						}
					}
				})

				return null
			}
		}
	)

	app.post<{ Params: { id: string, person_id: string } }>(
		'/:id/certificate/:person_id',
		async (request, reply) => {
			const { id, person_id } = request.params

			try {
				const meetup = await prisma.meetup.findUniqueOrThrow({
					where: {
						id
					},
					include: {
						certificateModel: true,
						subscriptions: {
							where: {
								personId: person_id
							},
							include: {
								meetupRole: true
							}
						}
					}
				})

				const person = await prisma.person.findUniqueOrThrow({
					where: {
						id: person_id
					}
				})

				const subscription = await prisma.subscription.findUniqueOrThrow({
					where: {
						personId_meetupId: {
							meetupId: id,
							personId: person_id
						}
					}
				})

				if (!subscription.certificateLink) {
					const buffer = await generateCertificate({
						meetup: meetup as any,
						person
					})

					const certificateMinioLink = await uploadToMinio(buffer, '.pdf', 'application/pdf')

					await prisma.subscription.update({
						where: {
							personId_meetupId: {
								meetupId: id,
								personId: person_id
							}
						},
						select: {
							id: true
						},
						data: {
							certificateLink: certificateMinioLink
						}
					})
				}

				let period = ''
				const pageLink = `${process.env.WEB_URL}/meetup/${meetup.id}/overview`
				const certificateLink = `${process.env.WEB_URL}/certificate/${subscription.id}`

				if (isSameDay(meetup.start!, meetup.end!)) {
					period = `Data: *${format(meetup.start!, 'dd/MM/yyyy')}*`
				} else {
					period = `Período: de *${format(meetup.start!, 'dd/MM/yyyy')} a ${format(meetup.end!, 'dd/MM/yyyy')}*`
				}

				if (person.phone) {
					await whatsappSend({
						number: `55${extractNumbers(person.phone)}`,
						text: `Olá, seu certificado já está disponível!\n\nEvento: *${meetup.title}*\n${period}\nPágina do evento: ${pageLink}\n\nBaixe seu certificado abaixo:\n${certificateLink}`
					})
				}

				return {
					message: 'Certificado gerado!'
				}
			} catch (e: any) {
				console.log(e)

				return {
					message: `Error: ${e.message}`
				}
			}
		}
	)

	app.post<{ Params: { person_id: string } }>(
		'/:person_id',
		async (request, reply) => {
			try {
				const parts = request.parts()

				const data: Partial<MeetupProps> = {}

				for await (const part of parts) {
					if (part.type === "file") {
						const link = await uploadToMinio(part)

						data[part.fieldname as keyof MeetupProps] = link as any
					} else {
						data[part.fieldname as keyof MeetupProps] = part.value as any
					}
				}

				const response = await prisma.$transaction(async tx => {
					const address = await tx.address.create({
						data: {
							zipcode: data.zipcode!,
							state: data.state!,
							city: data.city!,
							district: data.district!,
							street: data.street!,
							number: data.number,
							complement: data.complement,
						}
					})
	
					const meetup = await tx.meetup.create({
						data: {
							title: data.title!,
							description: data.description,
							start: new Date(data.start!),
							end: new Date(data.end!),
							categoryId: data.category_id!,
							image: data.image,
							workload: +data.workload!,
							creatorId: request.params.person_id,
							locationName: data.place,
							addressId: address.id
						}
					})

					return meetup
				})
				
				return response
			} catch (e: any) {
				return {
					message: `Error: ${e.message}`
				}
			}
		}
	)

	app.put<{ Params: { id: String, person_id: string } }>(
		'/:id/:person_id',
		async (request, reply) => {
			try {
				const { id } = request.params
				const parts = request.parts()

				const data: Partial<MeetupProps> = {}

				for await (const part of parts) {
					if (part.type === "file") {
						const link = await uploadToMinio(part)

						data[part.fieldname as keyof MeetupProps] = link as any
					} else {
						data[part.fieldname as keyof MeetupProps] = part.value as any
					}
				}

				const response = await prisma.$transaction(async tx => {
					const meetup = await tx.meetup.findUnique({
						where: {
							id: String(id)
						}
					})

					if (meetup?.addressId) {
						await tx.address.update({
							data: {
								street: data.street,
								city: data.city,
								district: data.district,
								number: data.number,
								state: data.state,
								zipcode: data.zipcode,
								complement: data.complement
							},
							where: {
								id: meetup.addressId
							}
						})
					}

					const updatedMeetup = await tx.meetup.update({
						data: {
							title: data.title!,
							description: data.description,
							start: new Date(data.start!),
							end: new Date(data.end!),
							workload: +data.workload!,
							categoryId: data.category_id!,
							image: data.image,
							creatorId: request.params.person_id,
							locationName: data.place
						},
						where: {
							id: id.toString()
						}
					})

					return updatedMeetup
				})

				return response
			} catch (e: any) {
				return {
					message: `Error: ${e.message}`
				}
			}
		}
	)
}