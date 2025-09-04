import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { User } from '../models/User'

import { prepareErrorResponse } from '../utils/express-response-prepare'
import { errors } from '../utils/errors'

class SessionController {
	async create(req: Request, res: Response) {
		try {
			const { login, password } = req.body
			const now = new Date()

			if (!login || !password) {
				throw new errors.INSUFICIENT_DATA
			}

			const user = await User.scope('full').findOne({ where: { login } })

			if (!user) {
				throw new errors.NOT_FOUND('Usuário não encontrado')
			}

			// Check password
			const authenticated = await bcrypt.compare(String(password), user.password)

			if (!authenticated) {
				return res.status(401).json({ msg: 'Senha incorreta.' })
			}

			await User.update({
				last_login_at: now
			}, {
				where: {
					id: user.id
				}
			})

			// Generating auth token
			const token = jwt.sign({
				user_id: user.id,
				person_id: user.person.id,
				profile_id: user.profile.id,
			}, String(process.env.JWT_SECRET), {
				expiresIn: process.env.NODE_ENV === 'development' ? '1y' : '7d'
			})

			user.password = '***'

			return res.json({
				token,
				user
			})
		} catch (e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const sessionController = new SessionController()