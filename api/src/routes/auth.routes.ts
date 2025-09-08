import { FastifyInstance } from 'fastify'
import { auth } from '../lib/auth'

export async function authRoutes(app: FastifyInstance) {
	app.route({
		method: ["GET", "POST"],
		url: "/*",
		async handler(request, reply) {
			try {
				console.log('input', request.body, request.url)

				// Construct request URL
				const url = new URL(request.url, `http://${request.headers.host}`)

				// Convert Fastify headers to standard Headers object
				const headers = new Headers()

				Object.entries(request.headers).forEach(([key, value]) => {
					if (value) headers.append(key, value.toString())
				})

				// Create Fetch API-compatible request
				const req = new Request(url.toString(), {
					method: request.method,
					headers,
					body: request.body ? JSON.stringify(request.body) : undefined
				})

				// Process authentication request
				const response = await auth.handler(req)
				
				// Forward response to client
				reply.status(response.status)

				response.headers.forEach((value, key) => reply.header(key, value))

				console.log('response', response)

				reply.send(response.body ? await response.text() : null)
			} catch (error) {
				console.log("Authentication Error:", error)

				reply.status(500).send({
					error: "Internal authentication error",
					code: "AUTH_FAILURE"
				})
			}
		}
	})
}
