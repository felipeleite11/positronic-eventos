import { connect } from 'amqplib'
import 'dotenv/config'

import { DocumentGenerators, generators } from '../document-generators/_generators'
import sequelize from '../models/_connection'
import { io } from '../app'
import { uploadToMinio } from './file-storage'

export let connection: any
export let channel: any

export class MessageChannel {
	private static instance: MessageChannel
	channel?: any

	private constructor() {}

	public static getInstance(): MessageChannel {
		if(!MessageChannel.instance) {
			MessageChannel.instance = new MessageChannel()
		}

		return MessageChannel.instance
	}

	private async _createChannel() {
		try {
			setTimeout(() => {
				console.log(`\nConectando ao RabbitMQ (${process.env.AMQP_SERVER})...\n`)
			}, 500)

			const connection = await connect(process.env.AMQP_SERVER!)

			this.channel = await connection.createChannel()

			this.channel.assertQueue(process.env.QUEUE_NAME!)

			console.log('Channel criado!')
		} catch(e) {
			console.log('Erro ao conectar com RabbitMQ')
			console.log(e)
		}
	}

	async consumeMessages() {
		await this._createChannel()

		if(this.channel) {
			this.channel.consume(process.env.QUEUE_NAME!, async (msg: any) => {
				if(!msg?.content) {
					return
				}

				const msgData = JSON.parse(msg.content.toString()) as any

				console.log('Mensagem recebida', msgData)

				const { service, identifier, data, extension } = msgData

				this.channel?.ack(msg as any)
				
				try {
					if(service === 'report') {
						const generator = generators[identifier as DocumentGenerators]

						if(!generator) {
							console.error(`Gerador com o identificador ${identifier} não foi encontrado.`)

							return
						}

						const buffer = await generator(data)
						
						const link = await uploadToMinio(buffer, extension)

						console.log('link', link)

						await sequelize.models.Notification.create({
							title: 'Seu relatório está pronto!',
							user_id: data.person_id,
							content: `Link do relatório: ${link}`
						})
					}

					console.log('Notificação gerada!')

					io.emit('reload_notifications', {})

					console.log('Dados emitidos para frontend via socket')
				} catch(e) {
					console.error('Erro ao gerar relatório.', identifier)
				}
			})

			console.log('Consumidor iniciado')
		}
	}

	sendToQueue(params: any) {
		if(this.channel) {
			this.channel.sendToQueue(process.env.QUEUE_NAME!, Buffer.from(JSON.stringify(params)))

			console.log('Mensagem enfileirada com sucesso')
		}
	}
}
