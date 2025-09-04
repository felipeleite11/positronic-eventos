import { Request, Response } from "express"

class UploadController {
	async create(req: Request, res: Response) {
		console.log((req.file as any).location)
		
		return res.json({
			link: (req.file as any).location
		})
	}
}

export const uploadController = new UploadController()