import { Router } from 'express'

import { userController } from '../controllers/UserController'

export const userRoutes = Router()

// userRoutes.get('/', userController.index)
userRoutes.get('/:id', userController.show)
userRoutes.post('/', userController.create)
userRoutes.put('/password/change', userController.changePassword)
userRoutes.put('/:id', userController.update)
userRoutes.delete('/:id', userController.delete)
userRoutes.put('/:id/reset_password', userController.resetPassword)
userRoutes.put('/:id/toggle_disable', userController.toggleDisable)
