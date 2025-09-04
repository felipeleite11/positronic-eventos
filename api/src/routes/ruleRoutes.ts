import { Router } from 'express'

import { ruleController } from '../controllers/RuleController'

export const ruleRoutes = Router()

ruleRoutes.get('/', ruleController.index)
ruleRoutes.get('/:id', ruleController.show)
ruleRoutes.post('/', ruleController.create)
ruleRoutes.put('/:id', ruleController.update)
ruleRoutes.delete('/:id', ruleController.delete)