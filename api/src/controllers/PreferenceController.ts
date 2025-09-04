import { Request, Response } from 'express'

import connection from '../models/_connection'
import { prepareErrorResponse } from '../utils/express-response-prepare'
import { UserPreference } from '../models/UserPreference'
import { Preference } from '../models/Preference'
import { HTTPStatusCodes } from '../utils/http-status-codes'

class PreferenceController {
	async index(req: Request, res: Response) {
		try {
			const response = await connection.transaction(async transaction => {
				const preferences = await Preference.findAll({ transaction })

				const currentUserPreferences = await UserPreference.scope('full').findAll({
					where: {
						user_id: req.user_id
					},
					transaction
				})

				const missingPreferences = preferences.filter(pref => !currentUserPreferences.map(userPref => userPref.preference.id).includes(pref.id))
				const remainingPreferences = currentUserPreferences.filter(userPref => !preferences.map(pref => pref.id).includes(userPref.preference.id))

				if (missingPreferences.length) {
					await UserPreference.bulkCreate(missingPreferences.map(pref => ({
						preference_id: pref.id,
						user_id: Number(req.user_id),
						value: pref.default_value
					})), { transaction })
				}

				if (remainingPreferences.length) {
					for (const pref of remainingPreferences) {
						await UserPreference.destroy({
							where: {
								preference_id: pref.id
							},
							force: true,
							transaction
						})
					}
				}

				const userPreferences = await UserPreference.scope('full').findAll({
					where: {
						user_id: req.user_id
					},
					transaction
				})

				return userPreferences
			})

			return res.json(response)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async show(req: Request, res: Response) {
		try {
			const preference = await UserPreference.findOne({
				where: {
					preference_id: req.params.id,
					user_id: req.user_id
				}
			})

			const value = preference?.value ? JSON.parse(preference.value) : ''

			return res.json(value)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const preference = await Preference.findOne({
				where: {
					id: req.params.id
				}
			})

			await UserPreference.update({
				value: preference?.default_value
			}, {
				where: {
					user_id: req.user_id,
					preference_id: Number(req.params.id)
				}
			})

			return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			if(Array.isArray(req.body.value)) {
				req.body.value = JSON.stringify(req.body.value)
			}
			
			await UserPreference.update({
				value: req.body.value
			}, {
				where: {
					user_id: req.user_id,
					preference_id: Number(req.params.id)
				}
			})

			const preferences = await UserPreference.scope('full').findAll({
				where: {
					user_id: req.user_id
				}
			})

			return res.json(preferences)
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const preferenceController = new PreferenceController()