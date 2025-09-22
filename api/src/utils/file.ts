import axios from "axios"

export async function urlToBase64(url: string | undefined): Promise<string | null> {
	if (!url) {
		return null
	}

	const { data, headers } = await axios.get(url, { responseType: 'arraybuffer' })

	const contentType = headers['content-type']

  	const base64 = Buffer.from(data, 'binary').toString("base64")

	return `data:${contentType};base64,${base64}`;
}