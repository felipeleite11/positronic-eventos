import axios from "axios"
import { extname } from "path"

export async function urlToFile(url: string | undefined): Promise<File | null> {
	if(!url) {
		return null
	}

	const extension = extname(url)

	const fileName = `file${extension}`

	const { data } = await axios.get<Blob>(url, {
		responseType: 'blob'
	})

	return new File([data], fileName, {
		type: data.type
	})
}
