import { Router } from 'express'

import { osPriorityController } from '../controllers/OSPriorityController'

export const osPriorityRoutes = Router()

osPriorityRoutes.get('/', osPriorityController.index)
osPriorityRoutes.get('/:id', osPriorityController.show)
osPriorityRoutes.post('/', osPriorityController.create)
osPriorityRoutes.put('/:id', osPriorityController.update)
osPriorityRoutes.delete('/:id', osPriorityController.delete)
