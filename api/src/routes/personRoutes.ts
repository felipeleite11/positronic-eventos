import { Router } from 'express'

import { personController } from '../controllers/PersonController'
import { checkUpload, uploadMinio } from '../config/multer'

export const personRoutes = Router()

personRoutes.get('/', personController.index)
personRoutes.get('/:id', personController.show)
personRoutes.post('/', uploadMinio.single('file'), checkUpload, personController.create)
personRoutes.put('/:id', uploadMinio.single('file'), checkUpload, personController.update)
personRoutes.delete('/:id', personController.delete)