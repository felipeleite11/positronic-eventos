import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'

// export const s3Client = new S3Client({
// 	endpoint: 'https://nyc3.digitaloceanspaces.com',
// 	forcePathStyle: false,
// 	region: 'nyc3',
// 	credentials: {
// 		accessKeyId: process.env.FILE_STORAGE_KEY || '',
// 		secretAccessKey: process.env.FILE_STORAGE_SECRET || ''
// 	}
// })

export const minioClient = new S3Client({
	endpoint: process.env.STORAGE_ENDPOINT as string,
	forcePathStyle: true,
	region: process.env.STORAGE_REGION,
	credentials: {
		accessKeyId: process.env.STORAGE_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY as string
	}
})

export async function uploadToMinio(buffer: any, extension: string) {
	const filename = `${uuid()}.${extension}`

	const uploadCommand = new PutObjectCommand({
		ACL: 'public-read',
		Bucket: process.env.STORAGE_BUCKET,
		Key: filename,
		Body: buffer
	})

	await minioClient.send(uploadCommand)

	return `${process.env.STORAGE_ENDPOINT}/${process.env.STORAGE_BUCKET}/${filename}`
}