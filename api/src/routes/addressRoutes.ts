import { Router } from 'express'

import { addressController } from '../controllers/AddressController'

export const addressRoutes = Router()

addressRoutes.get('/', addressController.index)
addressRoutes.get('/:id', addressController.show)
addressRoutes.post('/', addressController.create)
addressRoutes.put('/:id', addressController.update)
addressRoutes.delete('/:id', addressController.delete)