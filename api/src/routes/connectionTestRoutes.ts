import { Router } from 'express'

import { connectionTestController } from '../controllers/ConnectionTestController'

export const connectionTestRoutes = Router()

connectionTestRoutes.get('/', connectionTestController.index)