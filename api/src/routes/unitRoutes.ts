import { Router } from 'express'

import { unitController } from '../controllers/UnitController'

export const unitRoutes = Router()

unitRoutes.get('/', unitController.index)
