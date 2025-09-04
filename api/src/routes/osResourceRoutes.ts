import { Router } from 'express'

import { osResourceController } from '../controllers/OSResourceController'

export const osResourceRoutes = Router()

osResourceRoutes.get('/', osResourceController.index)
osResourceRoutes.get('/:id', osResourceController.show)
osResourceRoutes.post('/', osResourceController.create)
osResourceRoutes.put('/:id', osResourceController.update)
osResourceRoutes.delete('/:id', osResourceController.delete)