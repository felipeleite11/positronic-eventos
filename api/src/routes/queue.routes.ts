import { FastifyInstance } from 'fastify'
import { publisher } from '../config/queue'

export async function queueRoutes(app: FastifyInstance) {
	app.get(
		'/', 
		async () => {
			try {
				publisher.send(process.env.QUEUE_NAME!, {
					type: 'invite_send',
					event_id: 1
				})

				return {
					message: 'Item was sent to queue.'
				}
			} catch(e) {
				return {
					message: 'Error: Item was NOT sent to queue.'
				}
			}
		}
	)
}
