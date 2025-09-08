import 'dotenv/config'

import Fastify from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import { initSocketIO } from './config/socket'
import { onShutdown as onShutdownRabbitMQ } from './config/queue'

import { testRoutes } from './routes/test.routes'
import { queueRoutes } from './routes/queue.routes'
import { uploadRoutes } from './routes/upload.routes'

const fastify = Fastify({
	logger: false
})

fastify.register(fastifyMultipart)

console.log('registrou multipart')

fastify.get('/', () => {
	return { teste: 'ok' }
})

fastify.register(testRoutes, { prefix: '/test_socket' })
fastify.register(queueRoutes, { prefix: '/test_queue' })
fastify.register(uploadRoutes, { prefix: '/test_upload' })

fastify.listen({ port: +(process.env.PORT || 3333), host: '0.0.0.0' }, function (err, address) {
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
