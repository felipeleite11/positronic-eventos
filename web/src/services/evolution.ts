import axios from 'axios'

export const evolution = axios.create({
	baseURL: 'https://sindmepa-evolution.nyr4mj.easypanel.host',
	headers: {
		apikey: '3b94c0cd192d3787ced6997528afe500'
	}
})
