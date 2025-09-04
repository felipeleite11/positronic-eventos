import { Router } from 'express'

import { contactTypeController } from '../controllers/ContactTypeController'

export const contactTypeRoutes = Router()

contactTypeRoutes.get('/', contactTypeController.index)
contactTypeRoutes.get('/:id', contactTypeController.show)
contactTypeRoutes.post('/', contactTypeController.create)
contactTypeRoutes.put('/:id', contactTypeController.update)
contactTypeRoutes.delete('/:id', contactTypeController.delete)