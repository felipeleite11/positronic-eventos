import { Router } from 'express'

import { documentGeneratorTestController } from '../controllers/DocumentGeneratorTestController'

export const documentGeneratorTestRoutes = Router()

documentGeneratorTestRoutes.post('/pdf', documentGeneratorTestController.pdf)
documentGeneratorTestRoutes.post('/sheet', documentGeneratorTestController.xlsx)
