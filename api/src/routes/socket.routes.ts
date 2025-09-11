import { FastifyInstance } from 'fastify'
import { getIO, getSocketByUserId } from '../config/socket'

export async function socketRoutes(app: FastifyInstance) {
	app.get<{Params: { id: string }}>(
		'/:id', 
		async (request, reply) => {
			const { id } = request.params

			const { socket_id, person } = getSocketByUserId(+id)!
			
			const io = getIO()
	
			io.to(socket_id).emit('message', { sender: 'message from testRoutes' })
	
			return {
				message: `Message event was sent to ${person.name} -> ${socket_id}`
			}
		}
	)
}
