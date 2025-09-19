import axios from "axios"
import { extname } from "path"

export async function urlToFile(url: string | undefined): Promise<File | null> {
	if (!url) {
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

export function formatFileSize(bytes: number) {
	if (bytes < 1024) {
		return bytes + " B";
	} else if (bytes < 1024 * 1024) {
		return (bytes / 1024).toFixed(2) + " KB";
	} else {
		return (bytes / (1024 * 1024)).toFixed(2) + " MB";
	}
}

export const IMAGE_FORMATS = [
	'.jpg',
	'.jpeg',
	'.png',
	'.webp'
]