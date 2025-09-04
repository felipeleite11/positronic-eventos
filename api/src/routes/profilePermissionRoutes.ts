import { Router } from 'express'

import { profilePermissionController } from '../controllers/ProfilePermissionController'

export const profilePermissionRoutes = Router()

profilePermissionRoutes.post('/:profile_id/:permission_id', profilePermissionController.create)
profilePermissionRoutes.delete('/:profile_id/:permission_id', profilePermissionController.delete)