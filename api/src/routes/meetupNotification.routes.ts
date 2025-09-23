import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { publisher } from '../config/queue'
import { extractNumbers } from '../utils/string'

interface NotificationCreateProps {
	text: string
}

export async function meetupNotificationRoutes(app: FastifyInstance) {
	app.get<{ Params: { meetup_id: string } }>(
		'/:meetup_id',
		async (request, reply) => {
			const response = await prisma.meetupNotification.findMany({
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

	app.post<{ Params: { meetup_id: string, person_id: string }, Body: NotificationCreateProps }>(
		'/:meetup_id/:person_id',
		async (request, reply) => {
			const { meetup_id, person_id } = request.params
			const { text } = request.body

			const meetup = await prisma.meetup.findUnique({
				where: {
					id: meetup_id
				},
				include: {
					subscriptions: {
						include: {
							person: true
						}
					}
				}
			})

			if(!meetup) {
				throw new Error('Meetup não encontrada.')
			}

			const people = meetup?.subscriptions.map(subs => subs.person)

			for(const person of people) {
				if(!person.phone) {
					continue
				}

				publisher.send(process.env.QUEUE_NAME!, {
					type: 'notification_send',
					data: {
						number: `55${extractNumbers(person.phone)}`,
						text
					}
				})
			}

			const response = await prisma.meetupNotification.create({
				data: {
					meetupId: meetup_id,
					personId: person_id,
					text
				}
			})

			return response
		}
	)
}