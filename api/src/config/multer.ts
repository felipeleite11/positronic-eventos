import multer from 'multer'
import multerS3 from 'multer-s3'
import { extname } from 'path'
import { v4 } from 'uuid'
// @ts-ignore
import { getMIMEType } from 'node-mime-types'
import { NextFunction, Request, Response } from 'express'

import { errors } from '../utils/errors'

// import { s3Client } from './file-storage'
import { minioClient } from './file-storage'

import { prepareErrorResponse } from '../utils/express-response-prepare'

const deniedExtensions = ['.exe', '.bat', '.ps1', '.sh']

export const uploadLocal = multer({
    storage: multer.diskStorage({
        destination: './static/',
        filename: function (req, file, cb) {
            const name = v4()
            let extension = extname(file.originalname)

            if(!extension) {
                const [_, ext] = file.mimetype?.split('/')
                extension = ext || ''
            }

            cb(null, `${name}${extension}`)
        }
    }),
    fileFilter(req, file, callback) {
        const extension = extname(file.originalname)

        if (deniedExtensions.includes(extension)) {
            return callback(new errors.FILE_NOT_ALLOWED)
        }

        return callback(null, true)
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 30MB max
    }
})

// const s3Storage = multerS3({
//     s3: s3Client,
//     bucket: String(process.env.FILE_STORAGE_BUCKET),
//     acl: 'public-read',
//     key: (req, file, cb) => {
//         let extension = extname(file.originalname)

//         if(!extension) {
//             const [_, ext] = file.mimetype?.split('/')
//             extension = ext || ''
//         }

//         const fileName = `${process.env.FILE_STORAGE_FOLDER}/${v4()}.${extension}`

//         cb(null, fileName)
//     },
//     contentType: (req, file, callback) => {
//         const mime = getMIMEType(file.originalname)

//         return callback(null, mime)
//     }
// })

const minioStorage = multerS3({
    s3: minioClient,
    bucket: String(process.env.STORAGE_BUCKET),
    acl: 'public-read',
    key: (req, file, cb) => {
        let extension = extname(file.originalname)

        if(!extension) {
            const [_, ext] = file.mimetype?.split('/')
            extension = ext || ''
        }

        const isDevelopment = process.env.NODE_ENV === 'development'
        const devPrefix = '' // 'dev/'

        const fileName = `${isDevelopment ? devPrefix : ''}${v4()}.${extension}`

        cb(null, fileName)
    },
    contentType: (req, file, callback) => {
        const mime = getMIMEType(file.originalname)

        return callback(null, mime)
    }
})

// export const uploadS3 = multer({
//     storage: s3Storage,
//     fileFilter: (req, file, callback) => {
//         const extension = extname(file.originalname)

//         if (deniedExtensions.includes(extension)) {
//             return callback(new errors.FILE_NOT_ALLOWED)
//         }

//         return callback(null, true)
//     },
//     limits: {
//         fileSize: 1024 * 1024 * 30 // 30 mb file size
//     }
// })

export const uploadMinio = multer({
    storage: minioStorage,
    fileFilter: (req, file, callback) => {
        const extension = extname(file.originalname)

        if (deniedExtensions.includes(extension)) {
            return callback(new errors.FILE_NOT_ALLOWED)
        }

        return callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024 * 30 // 30 mb file size
    }
})

export function checkUpload(error: Error | undefined, req: Request, res: Response, next: NextFunction) {
    if (error) {
        return prepareErrorResponse(error, res)
    }

    return next()
}
