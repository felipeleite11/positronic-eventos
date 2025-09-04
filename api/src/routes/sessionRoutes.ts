import { Router } from 'express'

import { sessionController } from '../controllers/SessionController'

export const sessionRoutes = Router()

sessionRoutes.post('/', sessionController.create)