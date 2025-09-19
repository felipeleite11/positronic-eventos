import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { uploadToMinio } from "../config/file-storage"
import { MultipartFile } from "@fastify/multipart"
import { readSheet } from "../utils/sheet"

interface SheetDataProps {
	nome: string
	whatsapp: string
	email: string
	cpf: string
}

export async function inviteRoutes(app: FastifyInstance) {
	app.post<{Params: { meetup_id: string }}>(
		'/:meetup_id', 
		async (request, reply) => {
			try {
				const { meetup_id } = request.params
				const parts = request.parts()

				let result: any

				for await (const part of parts) {
					const sheetLink = await uploadToMinio(part as MultipartFile)

					const data = await readSheet<SheetDataProps[]>(part as MultipartFile)

					// console.log('planilha', data)

					result = await prisma.$transaction(async tx => {
						await tx.meetupInviteSheet.create({
							data: {
								link: sheetLink,
								meetupId: meetup_id
							}
						})

						await tx.person.createMany({
							data: data.map(item => ({
								name: item.nome,
								cpf: item.cpf,
								phone: item.whatsapp,
								email: item.email
							}))
						})

						const people = await tx.person.findMany({
							where: {
								phone: {
									in: data.map(item => item.whatsapp)
								}
							}
						}) 

						await tx.invite.createMany({
							data: people.map(person => ({
								link: `${process.env.WEB_URL}/meetup/${meetup_id}/confirmation?p=${123}`,
								meetupId: meetup_id,
								personId: person.id
							})),
							skipDuplicates: true
						})

						return people
					})

					return result
				}
			} catch(e: any) {
				console.log(e)

				return {
					message: `Error: ${e.message}`
				}
			}
		}
	)
}