import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { HTTPStatusCodes } from '../utils/http-status-codes'

interface JWTPayloadProps {
    user_id: number
    person_id: number
    profile_id: number
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if(!authHeader) {
        return res.status(401).json({ msg: 'Token não enviado.' })
    }
	
    let [, token] = authHeader.split(' ')
    
    try {
        token = token.replace(/"/g, '')
    
		const decoded = jwt.verify(token, String(process.env.JWT_SECRET)) as JWTPayloadProps

        const { user_id, person_id, profile_id } = decoded

        req.user_id = user_id
        req.person_id = person_id
        req.profile_id = profile_id
    } catch(err) {
        // console.log(err)

        return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: 'Token inválido.' })
    }

    return next()
}
