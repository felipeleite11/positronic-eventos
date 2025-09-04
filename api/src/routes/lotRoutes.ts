import { Router } from 'express'

import { lotController } from '../controllers/LotController'

export const lotRoutes = Router()

lotRoutes.get('/', lotController.index)
lotRoutes.post('/', lotController.create)
lotRoutes.put('/:id', lotController.update)
lotRoutes.delete('/:id', lotController.delete)
lotRoutes.get('/check_delete/:contract_id/:lot_id', lotController.checkDelete)