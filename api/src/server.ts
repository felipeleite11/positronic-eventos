import 'dotenv/config'

import Fastify from 'fastify'
import { initSocketIO } from './config/socket'
import { testRoutes } from './routes/test.routes'

const fastify = Fastify({
	logger: false
})

fastify.get('/', () => {
	return { teste: 'ok' }
})

fastify.register(testRoutes, { prefix: '/test_socket' })

fastify.listen({ port: +(process.env.PORT || 3333), host: '0.0.0.0' }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}

	initSocketIO(fastify.server)

	console.log(`Servidor HTTP ouvindo em ${address}`)
	console.log(`Servidor Socket.IO também ativo em ${address}`)
})

// import { MessageChannel } from './config/queue'

// async function start() {
// 	try {
// 		server.listen({ port: 3000 })

// 		// if(process.env.AMQP_SERVER) {
// 		// 	MessageChannel.getInstance().consumeMessages()
// 		// }

// 		console.log(`Server running on port http://localhost:${process.env.PORT}`)
// 	} catch (err) {
// 		process.exit(1)
// 	}
// }
