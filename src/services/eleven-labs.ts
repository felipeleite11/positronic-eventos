import axios from 'axios'

export const elevenlabs = axios.create({
	baseURL: 'https://n8n.robot.rio.br/webhook'
})
