import { Router } from 'express'

import { contactController } from '../controllers/ContactController'

export const contactRoutes = Router()

contactRoutes.get('/', contactController.index)
contactRoutes.get('/:id', contactController.show)
contactRoutes.post('/', contactController.create)
contactRoutes.put('/:id', contactController.update)
contactRoutes.delete('/:id', contactController.delete)