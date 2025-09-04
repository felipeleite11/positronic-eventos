import { Router } from 'express'

import { fontController } from '../controllers/FontController'

export const fontRoutes = Router()

fontRoutes.get('/', fontController.index)
fontRoutes.post('/', fontController.create)
fontRoutes.put('/:id', fontController.update)
fontRoutes.delete('/:id', fontController.delete)
