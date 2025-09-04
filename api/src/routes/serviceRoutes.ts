import { Router } from 'express'

import { serviceController } from '../controllers/ServiceController'

export const serviceRoutes = Router()

serviceRoutes.get('/', serviceController.index)
serviceRoutes.get('/:id', serviceController.show)
serviceRoutes.post('/', serviceController.create)
serviceRoutes.put('/:id', serviceController.update)
serviceRoutes.delete('/:id', serviceController.delete)