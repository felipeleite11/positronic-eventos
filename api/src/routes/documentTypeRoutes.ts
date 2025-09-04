import { Router } from 'express'

import { documentTypeController } from '../controllers/DocumentTypeController'

export const documentTypeRoutes = Router()

documentTypeRoutes.get('/', documentTypeController.index)
documentTypeRoutes.get('/:id', documentTypeController.show)
documentTypeRoutes.post('/', documentTypeController.create)
documentTypeRoutes.put('/:id', documentTypeController.update)
documentTypeRoutes.delete('/:id', documentTypeController.delete)