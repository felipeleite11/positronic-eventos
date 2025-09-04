import { Request, Response } from "express"

import { Font } from "../models/Font"
import { prepareErrorResponse } from "../utils/express-response-prepare"
import { HTTPStatusCodes } from "../utils/http-status-codes"

class FontController {
	async index(req: Request, res: Response) {
		const fonts = await Font.findAll() 

		return res.json(fonts)
	}

	async create(req: Request, res: Response) {
		try {
			const { description } = req.body

			const response = await Font.create({
				description
			})

			return res.status(201).json(response)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params
			const { description } = req.body

			await Font.update({
				description
			}, {
				where: { id }
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) { 
		try {
			const { id } = req.params

			await Font.destroy({
				where: { id }
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const fontController = new FontController()