import { Router } from 'express'

import { resourceDimensionController } from '../controllers/ResourceDimensionController'

export const resourceDimensionRoutes = Router()

resourceDimensionRoutes.get('/', resourceDimensionController.index)
resourceDimensionRoutes.get('/:id', resourceDimensionController.show)
resourceDimensionRoutes.post('/', resourceDimensionController.create)
resourceDimensionRoutes.put('/:id', resourceDimensionController.update)
resourceDimensionRoutes.delete('/:id', resourceDimensionController.delete)