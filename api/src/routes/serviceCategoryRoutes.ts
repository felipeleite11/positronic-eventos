import { Router } from 'express'

import { serviceCategoryController } from '../controllers/ServiceCategoryController'

export const serviceCategoryRoutes = Router()

serviceCategoryRoutes.get('/', serviceCategoryController.index)
serviceCategoryRoutes.get('/:id', serviceCategoryController.show)
serviceCategoryRoutes.post('/', serviceCategoryController.create)
serviceCategoryRoutes.put('/:id', serviceCategoryController.update)
serviceCategoryRoutes.delete('/:id', serviceCategoryController.delete)