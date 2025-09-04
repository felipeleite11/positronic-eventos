import { Router } from 'express'

import { teamController } from '../controllers/TeamController'

export const teamRoutes = Router()

teamRoutes.get('/', teamController.index)
teamRoutes.get('/:id', teamController.show)
teamRoutes.post('/', teamController.create)
teamRoutes.put('/:id', teamController.update)
teamRoutes.delete('/:id', teamController.delete)