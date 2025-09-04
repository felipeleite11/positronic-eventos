import { Router } from 'express'

import { permissionController } from '../controllers/PermissionController'

export const permissionRoutes = Router()

permissionRoutes.get('/', permissionController.index)
permissionRoutes.get('/:id', permissionController.show)
permissionRoutes.post('/', permissionController.create)
permissionRoutes.put('/:id', permissionController.update)
permissionRoutes.delete('/:id', permissionController.delete)