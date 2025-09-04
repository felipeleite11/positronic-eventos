import { Request, Response } from 'express'

class ConnectionTestController {
	async index(req: Request, res: Response) {
		return res.status(200).send(true)
	}
}

export const connectionTestController = new ConnectionTestController()