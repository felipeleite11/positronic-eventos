import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { uploadToMinio } from "../config/file-storage"
import { MultipartFile } from "@fastify/multipart"
import { readSheet } from "../utils/sheet"
import { z } from "zod"
import { evolution } from "../config/evolution"
import { extractNumbers } from "../utils/string"
import { publisher } from "../config/queue"

interface SheetDataProps {
	nome: string
	whatsapp: string
	email: string
	cpf: string
}

const personSchema = z.object({
	cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Formato esperado: 000.000.000-00'),
	whatsapp: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'WhatsApp inválido. Formato esperado: (00) 00000-0000'),
	email: z.email('Email inválido'),
	nome: z
		.string()
		.min(1, { message: "Nome não pode ser vazio" })
		.regex(/^[^\d]+$/, 'Nome não pode conter números'),
})

export async function inviteRoutes(app: FastifyInstance) {
	app.post(
		'/sheet_data',
		async (request, reply) => {
			try {
				const parts = request.parts()

				let result: SheetDataProps[] = []
				let sheetLink: string
				const errors: { index: number, error: string }[] = []

				for await (const part of parts) {
					sheetLink = await uploadToMinio(part as MultipartFile)

					result = await readSheet<SheetDataProps[]>(part as MultipartFile)
				}

				result.forEach((guest, index) => {
					const parseResult = personSchema.safeParse(guest)

					if(!parseResult.success) {
						errors.push({
							index,
							error: parseResult.error.issues[0].message
						})
					}
				})

				return {
					link: sheetLink!,
					data: result.map(item => ({
						...item,
						name: item.nome
					})),
					errors
				}
			} catch (e: any) {
				console.log('Carga convidados:', e)

				return {
					message: `Error: ${e.message}`
				}
			}
		}
	)

	app.post<{ Params: { meetup_id: string } }>(
		'/:meetup_id',
		async (request, reply) => {
			try {
				const { meetup_id } = request.params
				const { data, link } = request.body as { data: SheetDataProps[], link: string }

				const response = await prisma.$transaction(async tx => {
					await tx.meetupInviteSheet.create({
						data: {
							link,
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
							link: `${process.env.WEB_URL}/meetup/${meetup_id}/invite?p=${person.id}`,
							meetupId: meetup_id,
							personId: person.id
						})),
						skipDuplicates: true
					})

					return people
				})

				return response
			} catch (e: any) {
				console.log('Carga convidados:', e)

				return {
					message: `Error: ${e.message}`
				}
			}
		}
	)

	app.post<{ Params: { meetup_id: string } }>(
		'/:meetup_id/send_invitations',
		async (request, reply) => {
			const { meetup_id } = request.params

			try {
				const meetup = await prisma.meetup.findUnique({
					where: {
						id: meetup_id
					},
					include: {
						subscriptions: {
							include: {
								person: true
							}
						},
						invites: {
							include: {
								person: true
							},
							where: {
								person: {
									phone: {
										not: null
									}
								}
							}
						}
					}
				})

				const peopleToInvite = meetup?.invites.filter(invite => invite.person.phone && !meetup.subscriptions.some(subs => subs.personId === invite.personId))

				const dataToQueue = peopleToInvite?.map(item => ({
					number: `55${extractNumbers(item.person.phone!)}`,
					text: `Olá ${item.person.name},\n\nVocê está convidado para ${meetup?.title}.\n\nConfirme sua presença na página do evento:\n${process.env.WEB_URL}/meetup/${meetup_id}/invite?p=${item.person.id}`
				}))

				if (dataToQueue) {
					for(const item of dataToQueue) {
						publisher.send(process.env.QUEUE_NAME!, {
							type: 'invitation_send',
							data: item
						})
					}
				}

				return {
					message: 'Invitations were sent to queue.'
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