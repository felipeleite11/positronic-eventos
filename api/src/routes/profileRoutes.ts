import { Router } from 'express'

import { profileController } from '../controllers/ProfileController'

export const profileRoutes = Router()

profileRoutes.get('/', profileController.index)
profileRoutes.get('/:id', profileController.show)
profileRoutes.post('/', profileController.create)
profileRoutes.put('/:id', profileController.update)
profileRoutes.delete('/:id', profileController.delete)