import { Router } from 'express'

import { osExecutionTempDataController } from '../controllers/OSExecutionTempDataController'

export const osExecutionTempDataRoutes = Router()

osExecutionTempDataRoutes.post('/:id/initialize', osExecutionTempDataController.initialize)
osExecutionTempDataRoutes.put('/:id', osExecutionTempDataController.update)