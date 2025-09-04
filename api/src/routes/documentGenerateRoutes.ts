import { Router } from 'express'

import { documentGenerateController } from '../controllers/DocumentGenerateController'

export const documentGenerateRoutes = Router()

documentGenerateRoutes.post('/', documentGenerateController.generate)
documentGenerateRoutes.post('/queue', documentGenerateController.generate2)
