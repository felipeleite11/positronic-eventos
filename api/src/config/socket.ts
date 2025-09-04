import { Server as IOServer } from "socket.io"

let io: IOServer | null = null
const userSockets = new Map<number, SocketUser & { socket_id: string }>()

export function initSocketIO(server: any) {
	io = new IOServer(server, {
		cors: { origin: '*' }
	})

	io.on("connection", socket => {
		// console.log(`Novo cliente conectado: ${socket.id}`)
		
		socket.on('register', (data: SocketUser) => {
			userSockets.set(data.id, {
				socket_id: socket.id,
				...data
			} as any)

			console.log(data.person.name, 'está conectado com o ID:', socket.id)
			// console.log(userSockets.size)
		})

		socket.on('message', data => {
			console.log('message event:', data)
		})

		socket.on("disconnect", () => {
			// console.log(`❌ Cliente desconectado: ${socket.id}`)

			for (const [userId, data] of userSockets.entries()) {
				if (data.socket_id === socket.id) {
					userSockets.delete(userId)
					break
				}
			}

			// console.log(userSockets.size)
		})
	})

	return io
}

export function getSocketByUserId(user_id: number) {
	return userSockets.get(user_id)
}

export function getIO(): IOServer {
	if (!io) {
		throw new Error("❌ Socket.io não inicializado. Chame initSocketIO primeiro.")
	}
	
	return io
}
