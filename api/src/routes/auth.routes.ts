import { FastifyInstance } from 'fastify'
import { auth } from '../lib/auth'

interface SignUpProps {
	name: string
	email: string
	password: string
}

interface SignInProps {
	email: string
	password: string
}

export async function authRoutes(app: FastifyInstance) {
	app.route({
		method: ["POST"],
		url: '/sign-up/*',
		async handler(request, reply) {
			try {
				const { name, email, password } = request.body as SignUpProps

				const data = await auth.api.signUpEmail({
					body: {
						name, 
						email, 
						password
					}
				})

				reply.send(data)
			} catch(error) {
				console.log("Authentication Error:", error)

				reply.status(500).send({
					error: "Erro ao criar conta.",
					code: "AUTH_FAILURE"
				})
			}
		}
	})

	app.route({
		method: ["POST"],
		url: '/sign-in/*',
		async handler(request, reply) {
			try {
				const { email, password } = request.body as SignInProps

				const data = await auth.api.signInEmail({
					body: {
						email, 
						password
					}
				})

				reply.send(data)
			} catch(error: any) {
				console.log('error', error)

				const code = error.body?.code || 'AUTH_FAILURE'

				switch(code) {
					case 'INVALID_EMAIL_OR_PASSWORD':
						reply.status(error.statusCode).send({
							error: "Usuário ou senha incorreta.",
							code
						})
						break

					default:
						reply.status(error.statusCode).send({
							error: "Usuário ou senha incorreta.",
							code
						})
						break
				}
			}
		}
	})

	app.route({
		method: ["GET"],
		url: '/get-session',
		async handler(request, reply) {
			const headers = new Headers()

			Object.entries(request.headers).forEach(([key, value]) => {
				if (value) {
					headers.append(key, value.toString())
				}
			})

			// const headers = Object.fromEntries(
			// 	Object.entries(request.headers).map(([k, v]) => [k, String(v)])
			// )

			const data = await auth.api.getSession({
				headers
			})

			console.log('get-session : data', data)

			reply.send(data)
		}
	})

	app.route({
		method: ["POST"],
		url: '/sign-out',
		async handler(request, reply) {
			try {
				const headers = new Headers()

				Object.entries(request.headers).forEach(([key, value]) => {
					if (value) {
						headers.append(key, value.toString())
					}
				})

				console.log('headers', headers)

				// const data = await auth.api.signOut({
				// 	headers,
				// 	// method: 'POST'
				// })

				// console.log('data', data)

				// reply.send(data)

				reply.send('ok')
			} catch(error: any) {
				reply.status(error.statusCode).send({
					error: "Erro ao fazer signout.",
					code: "SIGNOUT_FAILURE"
				})
			}
		}
	})
}
