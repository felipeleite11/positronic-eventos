import { evolution } from "@/services/evolution"

export async function notify(text: string, number: string) {
	await evolution.post(`message/sendText/positronic-instance`, {
		number,
		text
	})
} 