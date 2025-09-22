import pdfMake from 'pdfmake/build/pdfmake.js'
import * as pdfFonts from "pdfmake/build/vfs_fonts.js"
import { CertificateModel, Meetup, MeetupRole, Person, Subscription } from "../prisma/generated"
import { fillTemplateForPDFMake } from '../utils/string'
import { differenceInHours, format } from 'date-fns'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import { urlToBase64 } from '../utils/file'

pdfMake.vfs = pdfFonts?.pdfMake?.vfs

interface CertificateProps {
	person: Person
	meetup: Meetup & {
		certificateModel?: CertificateModel
		subscriptions: (Subscription & {
			meetupRole: MeetupRole
		})[]
	}
}

export async function generateCertificate({ meetup, person }: CertificateProps): Promise<Buffer<ArrayBuffer>> {
	// obter o link do modelo e o conteúdo de texto, disponiveis na tabela MEETUP_CERTIFICATE_MODEL
	// prencher os parametros do texto
	// inserir texto final no modelo
	// gerar o pdf

	const subscription = meetup.subscriptions[0]
	const role = subscription.meetupRole
	const backgroundImageLink = meetup.certificateModel?.imageLink

	const certificateParts = fillTemplateForPDFMake(meetup.certificateModel?.content!, {
		name: person.name,
		meetup: meetup.title,
		date: meetup.start ? format(meetup.start, 'dd/MM/yyyy') : '',
		role: role.name,
		workload: meetup.workload!
	})
	
	const backgroundImageBase64 = await urlToBase64(backgroundImageLink)
	
	const docDefinition: TDocumentDefinitions = {
		content: [
			{
				text: certificateParts,
				style: 'text'
			},
			[
				{
					text: 'Escaneie para validar este certificado:',
					color: '#424242',
					fontSize: 11,
					absolutePosition: { 
						x: 60,
						y: 390
					}
				},
				{ 
					qr: `${process.env.WEB_URL}/certificate/${subscription.id}/validate`, 
					fit: 70,
					absolutePosition: { 
						x: 60,
						y: 412
					}
				},
				{
					fontSize: 11,
					text: [
						'ou ',
						{
							text: 'CLIQUE AQUI',
							link: `${process.env.WEB_URL}/certificate/${subscription.id}/validate`,
						}
					],
					absolutePosition: { 
						x: 60,
						y: 484
					}
				}
			]
			
		],
		pageSize: 'A4',
  		pageOrientation: 'landscape',
		pageMargins: [100, 220, 100, 80],
		background: function(_, pageSize) {
			if(!backgroundImageBase64) {
				return undefined
			}

			return {
				image: backgroundImageBase64!,
				width: pageSize.width,
				height: pageSize.height
			}
		},
		styles: {
			text: {
				lineHeight: 1.5,
				fontSize: 18
			}
		}
	}

	const buffer = new Promise(async (resolve, reject) => {
		const doc = pdfMake.createPdf(docDefinition)

		doc.getBuffer((buff: Buffer) => {
			if (buff) {
				resolve(buff)
			} else {
				reject(new Error("Falha ao gerar buffer do PDF"))
			}
   	 	})
	}) as Promise<Buffer<ArrayBufferLike>>

	const pdfBuffer = await buffer

	const bufferResult = Buffer.from(pdfBuffer)

	return bufferResult
}