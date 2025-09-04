import { Request, Response } from 'express'

import { OSAttribute } from '../models/OSAttribute'

class OSAttributeController {
	async index(req: Request, res: Response) {
		const response = await OSAttribute.scope('full').findAll()

		return res.json(response)
	}
}

export const oSAttributeController = new OSAttributeController()