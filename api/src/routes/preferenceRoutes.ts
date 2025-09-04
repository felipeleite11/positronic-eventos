import { Router } from 'express'

import { preferenceController } from '../controllers/PreferenceController'

export const preferenceRoutes = Router()

preferenceRoutes.get('/', preferenceController.index)
preferenceRoutes.get('/:id', preferenceController.show)
preferenceRoutes.put('/:id', preferenceController.update)
preferenceRoutes.delete('/:id', preferenceController.delete)