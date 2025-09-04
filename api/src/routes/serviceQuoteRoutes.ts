import { Router } from 'express'

import { serviceQuoteController } from '../controllers/ServiceQuoteController'

export const serviceQuoteRoutes = Router()

serviceQuoteRoutes.get('/', serviceQuoteController.index)
serviceQuoteRoutes.get('/:id', serviceQuoteController.show)
serviceQuoteRoutes.post('/', serviceQuoteController.create)
serviceQuoteRoutes.put('/:id', serviceQuoteController.update)
serviceQuoteRoutes.delete('/:id', serviceQuoteController.delete)