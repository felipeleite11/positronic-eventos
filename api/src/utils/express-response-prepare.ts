import { Response } from 'express'

import { SequelizeErrors } from '../database/errors'
import { HTTPStatusCodes } from './http-status-codes'
import { IBaseError, errors } from './errors'

export function prepareErrorResponse(error: Error, res: Response): Response<any, Record<string, any>> {
	if (!error) {
		return res.sendStatus(HTTPStatusCodes.NO_CONTENT)
	}

	if (error.name === 'ArrayError') {
		const instance = new errors.ARRAY()

		return res.status(HTTPStatusCodes.BAD_REQUEST).json({
			msg: instance.message,
			code: instance.code
		})
	}
	
	if(error.name === 'TokenExpiredError') {
		return res.status(HTTPStatusCodes.UNAUTHORIZED).json({ msg: 'Por segurança, faça login novamente.' })
	}

	if (error.name === SequelizeErrors.GENERIC) {
		if (error.message.includes('violates not-null constraint')) {
			const column = error.message.split('"')[1]

			return res.status(HTTPStatusCodes.BAD_REQUEST).json({ msg: `${column} não foi enviado.` })
		}

		return res.status(HTTPStatusCodes.BAD_REQUEST).json({ msg: 'Ocorreu um erro relacionado ao DB.' })
	}

	if (error.name === SequelizeErrors.VALIDATION) {
		return res.status(HTTPStatusCodes.BAD_REQUEST).json({ msg: error.message?.replace('Validation error: ', '') || 'Um valor inválido foi passado.' })
	}

	if (error.name === SequelizeErrors.UNIQUE) {
		const uniqueCompositeKeys = getUniqueKeys((error as any)?.original?.detail)

		if (uniqueCompositeKeys) {
			return res.status(HTTPStatusCodes.CONFLICT).json({
				msg: uniqueCompositeKeys
					? `A chave ÚNICA [${uniqueCompositeKeys}] foi violada.`
					: 'Uma chave ÚNICA foi violada.'
			}
			)
		}

		return res.status(HTTPStatusCodes.CONFLICT).json({
			msg: (error as any).errors?.[0]?.path
				? `A chave ÚNICA ${(error as any).errors?.[0]?.path} foi violada.`
				: 'Uma chave ÚNICA foi violada.'
		}
		)
	}

	if (error.name === SequelizeErrors.FOREIGN_KEY) {
		return res.status(HTTPStatusCodes.CONFLICT).json({
			msg: (error as any).errors?.[0]?.path
				? `A chave estrangeira ${(error as any).errors?.[0]?.path} foi violada.`
				: 'Uma chave estrangeira foi violada.'
		}
		)
	}

	if (error.message === 'Invalid scope null called.') {
		return res.status(HTTPStatusCodes.NOT_FOUND).json({ msg: 'Escopo não encontrado.' })
	}

	return res.status((error as IBaseError).code || HTTPStatusCodes.BAD_REQUEST).json({ msg: error.message })
}

function getUniqueKeys(message: string) {
	if (!message) {
		return null
	}

	const handled = message.replace('Key (', '')

	const breakPosition = handled.indexOf(')=(')

	return handled.substring(0, breakPosition)
}
