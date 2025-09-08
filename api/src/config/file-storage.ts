import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'
import { MultipartFile } from '@fastify/multipart'
import { extname } from 'path'

export const minioClient = new S3Client({
	endpoint: process.env.STORAGE_ENDPOINT as string,
	forcePathStyle: true,
	region: process.env.STORAGE_REGION,
	credentials: {
		accessKeyId: process.env.STORAGE_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY as string
	}
})

export function uploadToMinio(file: MultipartFile): Promise<string>
export function uploadToMinio(buffer: Buffer, extension?: string, mimetype?: string): Promise<string>

export async function uploadToMinio(content: MultipartFile | Buffer, extension?: string, mimetype?: string): Promise<string> {
	if(!content) {
		throw new Error('Arquivo não enviado.')
	}

	let uploadCommand: PutObjectCommand
	let filename: string

	// Assinatura 1
	if('file' in content && 'filename' in content) {
		const extension = extname(content.filename)
		const buffer = await content.toBuffer()
		const mimetype = content.mimetype

		filename = `${uuid()}${extension}`

		uploadCommand = new PutObjectCommand({
			ACL: 'public-read',
			Bucket: process.env.STORAGE_BUCKET,
			Key: filename,
			Body: buffer,
			ContentType: mimetype
		})
	}

	// Assinatura 2
	if(content instanceof Buffer && extension && mimetype) {
		extension = extension.replace('.', '')

		filename = `${uuid()}.${extension}`

		uploadCommand = new PutObjectCommand({
			ACL: 'public-read',
			Bucket: process.env.STORAGE_BUCKET,
			Key: filename,
			Body: content,
			ContentType: mimetype
		})
	}

	await minioClient.send(uploadCommand!)

	return `${process.env.STORAGE_ENDPOINT}/${process.env.STORAGE_BUCKET}/${filename!}`
}

// export async function uploadToMinio(buffer: Buffer, extension: string, mimetype: string) {
// 	extension = extension.replace('.', '')

// 	const filename = `${uuid()}.${extension}`

// 	const uploadCommand = new PutObjectCommand({
// 		ACL: 'public-read',
// 		Bucket: process.env.STORAGE_BUCKET,
// 		Key: filename,
// 		Body: buffer,
// 		ContentType: mimetype
// 	})

// 	await minioClient.send(uploadCommand)

// 	return `${process.env.STORAGE_ENDPOINT}/${process.env.STORAGE_BUCKET}/${filename}`
// }

// export async function uploadToMinio(file: MultipartFile) {
// 	const extension = extname(file.filename)
// 	const buffer = await file.toBuffer()
// 	const mimetype = file.mimetype

// 	const filename = `${uuid()}${extension}`

// 	const uploadCommand = new PutObjectCommand({
// 		ACL: 'public-read',
// 		Bucket: process.env.STORAGE_BUCKET,
// 		Key: filename,
// 		Body: buffer,
// 		ContentType: mimetype
// 	})

// 	await minioClient.send(uploadCommand)

// 	return `${process.env.STORAGE_ENDPOINT}/${process.env.STORAGE_BUCKET}/${filename}`
// }