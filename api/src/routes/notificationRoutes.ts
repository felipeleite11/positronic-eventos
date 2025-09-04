import { Router } from 'express'

import { notificationController } from '../controllers/NotificationController'

export const notificationRoutes = Router()

notificationRoutes.get('/', notificationController.index)
notificationRoutes.get('/:id', notificationController.show)
notificationRoutes.post('/', notificationController.create)
notificationRoutes.patch('/:id/read', notificationController.read)