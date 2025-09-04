export interface IBaseError {
	code: number
	name: string
	message: string
}

class BaseError extends Error implements IBaseError {
	code: number = 400
	name: string = 'Error'
	message: string = 'Ocorreu um erro'
}

class NotFoundError extends BaseError {
	name: string = 'NotFoundError'
	message: string = 'Item não encontrado.'
	code = 404

	constructor(msg?: string) {
		super()

		if (msg) {
			this.message = msg
		}
	}
}

export class AlreadyExistsError extends BaseError {
	name: string = 'AlreadyExistsError'
	message: string = 'O item já existe.'
	code = 409

	constructor(msg?: string) {
		super()

		if (msg) {
			this.message = msg
		}
	}
}

class FileNotAllowedError extends BaseError {
	name: string = 'FileNotAllowedError'
	message: string = 'Este tipo de arquivo não é permitido.'
	code = 400

	constructor(msg?: string) {
		super()

		if (msg) {
			this.message = msg
		}
	}
}

class InsuficientDataError extends BaseError {
	name: string = 'InsuficientDataError'
	message: string = 'Dados insuficientes para concluir a operação.'
	code = 400

	constructor(msg?: string) {
		super()

		if (msg) {
			this.message = msg
		}
	}
}

class FilterRequiredError extends BaseError {
	name: string = 'FilterRequiredError'
	message: string = 'É obrigatório passar pelo menos um filtro para a busca.'
	code = 401

	constructor(msg?: string) {
		super()

		if (msg) {
			this.message = msg
		}
	}
}

class InvalidDataError extends BaseError {
	name: string = 'InvalidDataError'
	message: string = 'Os dados passados são inválidos.'
	code = 400

	constructor(msg?: string) {
		super()

		if (msg) {
			this.message = msg
		}
	}
}

class RestrictionError extends BaseError {
	name: string = 'RestrictionError'
	message: string = 'Não é possível realizar esta operação.'
	code = 400

	constructor(msg?: string) {
		super()

		if (msg) {
			this.message = msg
		}
	}
}

class NotAllowedError extends BaseError {
	name: string = 'NotAllowedError'
	message: string = 'Não é permitido realizar esta operação.'
	code = 401

	constructor(msg?: string) {
		super()

		if (msg) {
			this.message = msg
		}
	}
}

class ArrayError extends BaseError {
	name: string = 'ArrayError'
	message: string = 'Erro relacionado a array.'
	code = 700

	constructor(msg?: string) {
		super()

		if (msg) {
			this.message = msg
		}
	}
}

export const errors = {
	NOT_FOUND: NotFoundError,
	CONFLICT: AlreadyExistsError,
	FILE_NOT_ALLOWED: FileNotAllowedError,
	INSUFICIENT_DATA: InsuficientDataError,
	FILTER_REQUIRED: FilterRequiredError,
	INVALID_DATA: InvalidDataError,
	RESTRICTION: RestrictionError,
	NOT_ALLOWED: NotAllowedError,
	ARRAY: ArrayError
}