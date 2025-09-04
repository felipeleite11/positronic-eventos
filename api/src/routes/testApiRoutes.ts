import { Router } from 'express'

import { testApiController } from '../controllers/TestAPIController'
import { uploadMinio } from '../config/multer'

export const testApiRoutes = Router()

testApiRoutes.post('/', testApiController.index)
testApiRoutes.post('/email', testApiController.testEmail)
testApiRoutes.post('/socket', testApiController.testSocket)
testApiRoutes.post('/upload_minio', uploadMinio.single('file'), testApiController.testUploadMinIO)