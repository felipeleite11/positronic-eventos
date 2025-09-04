import { Router } from 'express'

import { oSAttributeController } from '../controllers/OSAttributeController'

export const oSAttributeRoutes = Router()

oSAttributeRoutes.get('/', oSAttributeController.index)