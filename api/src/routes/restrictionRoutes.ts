import { Router } from 'express'

import { restrictionController } from '../controllers/RestrictionController'

export const restrictionRoutes = Router()

restrictionRoutes.get('/', restrictionController.index)
restrictionRoutes.get('/:id', restrictionController.show)
restrictionRoutes.post('/', restrictionController.create)
restrictionRoutes.put('/:id', restrictionController.update)
restrictionRoutes.delete('/:id', restrictionController.delete)