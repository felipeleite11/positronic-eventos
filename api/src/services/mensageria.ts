import axios from 'axios'
import * as Yup from 'yup'
import fs from 'fs'
import Handlebars from 'handlebars'

export const mensageria = axios.create({
	baseURL: 'https://mensageria.robot.rio.br',
	headers: {
		'Api-Key': process.env.MENSAGERIA_KEY,
		'Content-Type': 'application/json'
	}
})

interface SendEmailProps<T> {
	recipient: string
	channel?: 'email'
	sender?: string
	sendgrid_template_id?: string
	data: {
		title: string
		content?: string
		template?: {
			path: string
			data: T
		}
		action: string
		link: string
	}
}

const sendValidation = Yup.object({
	recipient: Yup.string().required(''),
	sender: Yup.string().required(''),
	sendgrid_template_id: Yup.string().required(''),
	data: Yup.object({
		title: Yup.string().required('Informe um titulo.'),
		action: Yup.string().required('Informe a ação.'),
		link: Yup.string().required('Informe o link.')
	})
})

export async function sendEmail<T = any>({ 
		recipient,
		sender = 'no-reply@robot.rio.br',
		sendgrid_template_id = String(process.env.MENSAGERIA_TEMPLATE_ID),
		channel = 'email',
		data
	}: SendEmailProps<T>) {
	
	sendValidation.validateSync({
		recipient,
		sender,
		sendgrid_template_id,
		channel,
		data
	})

	let { action, link, title, content, template } = data

	if(template?.path) {
		const templateContent = fs.readFileSync(template.path, { encoding: 'utf-8' })
		const render = Handlebars.compile(templateContent)

		content = render(template.data)
	}

	await mensageria.post('send_detached', {
		dynamic_template_data: {
			title,
			content,
			action,
			link
		},
		to: recipient,
		channel,
		from: sender,
		sendgrid_template_id
	})
}