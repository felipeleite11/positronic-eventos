import { Router } from 'express'

import { resourceController } from '../controllers/ResourceController'

export const resourceRoutes = Router()

resourceRoutes.get('/', resourceController.index)
resourceRoutes.get('/:id', resourceController.show)
resourceRoutes.post('/', resourceController.create)
resourceRoutes.put('/:id', resourceController.update)
resourceRoutes.delete('/:id', resourceController.delete)