import { Router } from 'express'

import { documentController } from '../controllers/DocumentController'

export const documentRoutes = Router()

documentRoutes.get('/', documentController.index)
documentRoutes.get('/:id', documentController.show)
documentRoutes.post('/', documentController.create)
documentRoutes.put('/:id', documentController.update)
documentRoutes.delete('/:id', documentController.delete)