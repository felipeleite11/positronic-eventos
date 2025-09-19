import { MultipartFile } from "@fastify/multipart";
import * as XLSX from "xlsx";

export async function readSheet<T>(file: MultipartFile): Promise<T> {
	const buffer = await file.toBuffer()

	const workbook = XLSX.read(buffer, { type: "array" })

	const sheetName = workbook.SheetNames[0]

	const worksheet = workbook.Sheets[sheetName]

	return XLSX.utils.sheet_to_json(worksheet) as T
}