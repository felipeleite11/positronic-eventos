import { Request, Response } from "express"

import { Unit } from "../models/Unit"

class UnitController {
	async index(req: Request, res: Response) {
		const units = await Unit.scope('full').findAll() 

		return res.json(units)
	}
}

export const unitController = new UnitController()