import { resolve } from "equation-resolver"
import { parse } from "equation-parser"

export function formularResolver(formula: string, params?: object) {
	if(!params) {
		return resolve(parse(formula))
	}

	for(const [param, value] of Object.entries(params)) {
		formula = formula.replaceAll(param, value)
	}

	return resolve(parse(formula))
}