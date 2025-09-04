import {
    Request, Response, NextFunction
} from 'express'
import multer from 'multer'
import { extname, resolve } from 'path'
import { v4 as uuid } from 'uuid'

function generateFileName(file: string) {
    const fileName = uuid()

    const extension = extname(file)

    return `${fileName}${extension}`
}

const uploader = multer({
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'static'),

        filename: (req, file, cb) => {
            const fileName = generateFileName(file.originalname)

            // @ts-ignore
            req[file.fieldname] = fileName

            cb(null, fileName)
        }
    })
})

export function handleUpload(fieldName: string|string[]) {
    let multerMiddleware

    if (Array.isArray(fieldName)) {
        const fields = fieldName.map((item) => ({
            name: item,
            maxCount: 1
        }))

        multerMiddleware = uploader.fields(fields)
    } else {
        multerMiddleware = uploader.fields([{ name: fieldName, maxCount: 1 }])
    }

    const middleware = async (req: Request, res: Response, next: NextFunction) => {
        if (typeof fieldName === 'string') {
            // @ts-ignore
            if (req[fieldName]) {
                // @ts-ignore
                req.body[fieldName] = req[fieldName]
            }
        } else {
            fieldName.forEach((item) => {
                // @ts-ignore
                req.body[item] = req[item]
            })
        }

        next()
    }

    return [
        multerMiddleware,
        middleware
    ]
}
