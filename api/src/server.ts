import 'dotenv/config'

import Fastify from 'fastify'
import { initSocketIO } from './config/socket'
import { testRoutes } from './routes/test.routes'
import { queueRoutes } from './routes/queueRoutes.routes'
import { onShutdown as onShutdownRabbitMQ } from './config/queue2'

const fastify = Fastify({
	logger: false
})

fastify.get('/', () => {
	return { teste: 'ok' }
})

fastify.register(testRoutes, { prefix: '/test_socket' })
fastify.register(queueRoutes, { prefix: '/test_queue' })

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
