import { Request, Response } from 'express'
import fs from 'fs'
import OpenAI from 'openai'
import axios from 'axios'

import { prepareErrorResponse } from '../utils/express-response-prepare'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_KEY
})

class VoiceCommandController {
	async recognize(req: Request, res: Response) {
		try {
			console.log('\n======================\n')

			const audioURL = `${process.env.FILE_STORAGE_BASE_URL}/${(req.file as any).key}`

			const response = await axios.get(audioURL, { responseType: 'arraybuffer' })

			console.log('Áudio carregado do Digital Ocean Storage: ', audioURL)

			const audioBuffer = Buffer.from(response.data, 'utf-8')

			const filePath = 'static/audio.wav'

			if (fs.existsSync(filePath)) {
				fs.rmSync(filePath)
			}

			fs.writeFile(filePath, audioBuffer, () => { })

			console.log('Áudio criado em disco')

			const readStream = fs.createReadStream(filePath)

			console.log('Transcrevendo...')

			const transcription = await openai.audio.transcriptions.create({
				model: 'whisper-1',
				file: readStream,
				response_format: 'text',
				language: 'pt'
			})

			if (!transcription) {
				throw new Error('Erro ao processar o comando de voz.')
			}

			console.log('Transcrição: ', transcription)

			fs.rmSync(filePath)

			console.log('======================\n')

			return res.json({ transcription })
		} catch (e) {
			console.log(e)
			console.log('======================\n')

			if((e as any).code) {
				return prepareErrorResponse(new Error('Clique e segure o botão enquanto grava seu comando de voz.'), res)
			}

			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const voiceCommandController = new VoiceCommandController()