import { Request, Response } from 'express'

import { Permission } from '../models/Permission'
import { Profile } from '../models/Profile'

import { errors } from '../utils/errors'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { HTTPStatusCodes } from '../utils/http-status-codes'

class ProfilePermissionController {
	async create(req: Request, res: Response) {
		try {
			const { profile_id, permission_id } = req.params

			const profile = await Profile.findByPk(profile_id)
			const permission = await Permission.findByPk(permission_id)

			if (!profile || !permission) {
				throw new errors.NOT_FOUND('Perfil ou permissão não encontrada.')
			}

			await profile.addPermission(permission)

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { profile_id, permission_id } = req.params

			const profile = await Profile.findByPk(profile_id)
			const permission = await Permission.findByPk(permission_id)

			if (!profile || !permission) {
				throw new errors.NOT_FOUND('Perfil ou permissão não encontrada.')
			}

			await profile.removePermission(permission)

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const profilePermissionController = new ProfilePermissionController()