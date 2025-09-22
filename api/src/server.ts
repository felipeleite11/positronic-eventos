import 'dotenv/config'

import Fastify from 'fastify'
import fastifyCors from "@fastify/cors"
import fastifyMultipart from '@fastify/multipart'

import { initSocketIO } from './config/socket'
import { onShutdown as onShutdownRabbitMQ } from './config/queue'

import { socketRoutes } from './routes/socket.routes'
import { queueRoutes } from './routes/queue.routes'
import { uploadRoutes } from './routes/upload.routes'
import { meetupRoutes } from './routes/meetup.routes'
import { categoryRoutes } from './routes/category.routes'
import { personRoutes } from './routes/person.routes'
import { sessionRoutes } from './routes/session.routes'
import { subscriptionRoutes } from './routes/subscription.routes'
import { inviteRoutes } from './routes/invite.routes'
import { roleRoutes } from './routes/role.routes'
import { certificateRoutes } from './routes/certificate.routes'

const fastify = Fastify({
	logger: false
})

fastify.register(fastifyMultipart, {
	limits: {
		fileSize: 20 * 1024 * 1024
	}
})

fastify.register(fastifyCors, {
	origin: process.env.WEB_URL || 'http://localhost:3000',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
})

fastify.get('/', () => {
	return { its_working: true }
})

fastify.register(socketRoutes, { prefix: '/test_socket' })
fastify.register(queueRoutes, { prefix: '/test_queue' })
fastify.register(uploadRoutes, { prefix: '/test_upload' })
fastify.register(sessionRoutes, { prefix: '/auth' })

fastify.register(meetupRoutes, { prefix: '/meetup' })
fastify.register(subscriptionRoutes, { prefix: '/subscription' })
fastify.register(categoryRoutes, { prefix: '/category' })
fastify.register(personRoutes, { prefix: '/person' })
fastify.register(inviteRoutes, { prefix: '/invite' })
fastify.register(roleRoutes, { prefix: '/role' })
fastify.register(certificateRoutes, { prefix: '/certificate' })

fastify.listen({ port: +process.env.PORT!, host: '0.0.0.0' }, function (err, address) {
	if (err) {
		fastify.log.error(err)

		process.on('SIGINT', onShutdownRabbitMQ)
		process.on('SIGTERM', onShutdownRabbitMQ)
		process.exit(1)
	}

	initSocketIO(fastify.server)

	console.log(`Servidor HTTP ouvindo em ${address}`)
	console.log(`Servidor Socket.IO também ativo em ${address}`)
})
