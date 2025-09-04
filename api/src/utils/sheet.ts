import axios from "axios"
import xlsx from "xlsx"
import fs from "fs"

import { trim } from "./object"
import { errors } from "./errors"

interface ReadSheetOptions {
	validation?: {
		columns: string[]
	}
}

export async function readSheet<T>(path: string, options: ReadSheetOptions): Promise<T[]> {
	const isRemote = path.startsWith('http')
	let data: T[] = []
	let buffer

	if(isRemote) {
		const result = await axios.get(path, {
			responseType: 'arraybuffer'
		})

		buffer = Buffer.from(result.data, 'binary')
	} else {
		buffer = fs.readFileSync(path)
	}

	const fileContent = xlsx.read(buffer)

	const tabs = fileContent.SheetNames

	for (let i = 0; i < tabs.length; i++) {
		data = xlsx.utils.sheet_to_json(fileContent.Sheets[fileContent.SheetNames[i]])
	}

	if(data.length) {
		if(options.validation?.columns) {
			const sheetKeys = Object.keys(data[0] as object)

			if(!options.validation.columns.every(column => sheetKeys.includes(column))) {
				throw new errors.INSUFICIENT_DATA('A planilha está em formato incompatível.')
			}
		}
	}

	data = trim(data)

	return data
}