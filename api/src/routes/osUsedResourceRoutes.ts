import { Router } from 'express'

import { osUsedResourceController } from '../controllers/OSUsedResourceController'

export const osUsedResourceRoutes = Router()

osUsedResourceRoutes.get('/', osUsedResourceController.index)
osUsedResourceRoutes.get('/:id', osUsedResourceController.show)
osUsedResourceRoutes.post('/', osUsedResourceController.create)
osUsedResourceRoutes.put('/:id', osUsedResourceController.update)
osUsedResourceRoutes.delete('/:id', osUsedResourceController.delete)