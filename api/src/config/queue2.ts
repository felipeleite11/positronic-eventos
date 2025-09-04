import { Connection } from 'rabbitmq-client'
import { inviteSend } from '../routines/inviteSend'

const rabbit = new Connection(process.env.AMQP_SERVER!)

rabbit.on('error', (err) => {
	console.log('RabbitMQ connection error', err)
})

rabbit.on('connection', () => {
	console.log('Connection successfully established!')
})

// Publisher

export const publisher = rabbit.createPublisher()

// Subscriber

const subscriber = rabbit.createConsumer({
	queue: process.env.QUEUE_NAME!,
	queueOptions: { durable: true },

	// qos: { prefetchCount: 2 }, // Informa quantas mensagens por vez serão tratadas.
}, async ({ body: data }) => {
	console.log('Received message:', data)

	if(!data?.type) {
		throw new Error('RabbitMQ messages must have "data" property.')
	}

	const { type } = data

	switch(type) {
		case 'invite_send':
			await inviteSend(data)
			break
	}

	// The message is automatically acknowledged (BasicAck) when this function ends.
	// If this function throws an error, then msg is rejected (BasicNack) and
	// possibly requeued or sent to a dead-letter exchange. Ycou an also return a
	// status code from this callback to control the ack/nack behavior
	// per-message.
})

subscriber.on('error', err => {
	console.log('Consumer error:', err)
})

// Shutdown

export async function onShutdown() {
	await publisher.close()
	await subscriber.close()
	await rabbit.close()
}
