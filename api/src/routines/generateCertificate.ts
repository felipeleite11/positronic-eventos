import pdfMake from 'pdfmake/build/pdfmake.js'
import * as pdfFonts from "pdfmake/build/vfs_fonts.js"
import { Meetup, Person } from "../prisma/generated"

pdfMake.vfs = pdfFonts?.pdfMake?.vfs

interface CertificateProps {
	person: Person
	meetup: Meetup
}

export async function generateCertificate({ meetup, person }: CertificateProps): Promise<Buffer<ArrayBuffer>> {
	const docDefinition = {
		content: [
			{ text: "Hello World!", fontSize: 20, bold: true },
			person.name,
			{ text: meetup.title, fontSize: 14, bold: true },
		]
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