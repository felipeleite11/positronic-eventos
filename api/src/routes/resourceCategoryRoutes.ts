import { Router } from 'express'

import { resourceCategoryController } from '../controllers/ResourceCategoryController'

export const resourceCategoryRoutes = Router()

resourceCategoryRoutes.get('/', resourceCategoryController.index)
resourceCategoryRoutes.get('/:id', resourceCategoryController.show)
resourceCategoryRoutes.post('/', resourceCategoryController.create)
resourceCategoryRoutes.put('/:id', resourceCategoryController.update)
resourceCategoryRoutes.delete('/:id', resourceCategoryController.delete)