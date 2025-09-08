import { FastifyInstance } from 'fastify'
import { uploadToMinio } from '../config/file-storage'

export async function uploadRoutes(app: FastifyInstance) {
	app.post(
		'/single',
		async (request, reply) => {
			try {
				const file = await request.file()

				if (!file) {
					return reply.status(404).send({ error: 'Arquivo não enviado' });
				}

				const response = await uploadToMinio(file)

				return {
					message: 'File was sent to MinIO.',
					link: response
				}
			} catch (e) {
				return {
					message: 'Error: Item was NOT sent to MinIO.'
				}
			}
		}
	)

	app.post(
		'/multiple',
		async (request, reply) => {
			try {
				const files = request.files()

				if (!files) {
					return reply.status(404).send({ error: 'Arquivos não enviados' });
				}

				const links: string[] = []

				for await (const file of files) {
					const link = await uploadToMinio(file)

					// Implementação alternativa (recomendada para arquivos gerados no backend)
					// const buffer = await file.toBuffer()
					// const extension = extname(file.filename)
					// const mimetype = file.mimetype
					// const response = await uploadToMinio(buffer, extension, mimetype)

					links.push(link)
				}

				return {
					message: 'Files were sent to MinIO.',
					links
				}
			} catch (e) {
				return {
					message: 'Error: Items were NOT sent to MinIO.'
				}
			}

		}
	)
}
