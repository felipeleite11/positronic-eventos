import { Router } from 'express'

import { contractController } from '../controllers/ContractController'
import { uploadMinio } from '../config/multer'

export const contractRoutes = Router()

contractRoutes.get('/', contractController.index)
contractRoutes.get('/:id', contractController.show)
contractRoutes.post('/', contractController.create)
contractRoutes.put('/:id', contractController.update)
contractRoutes.delete('/:id', contractController.delete)
contractRoutes.post('/load_services_sheet', uploadMinio.single('file'), contractController.loadServicesSheet)