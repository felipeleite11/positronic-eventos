'use client'

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { elevenlabs } from "@/services/eleven-labs"

export default function Draw() {
	const [isAudioPlaying, setIsAudioPlaying] = useState(false)

	const { id } = useParams()

	async function playAudio() {
		try {
			setIsAudioPlaying(true)

			const { data: { data: base64Audio } } = await elevenlabs.post('/generate-voice', {
				text: 'ATENÇÃO BT lovers! Vamos iniciar o sorteio!'
			})

			const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`)
			
			audio.onended = () => { setIsAudioPlaying(false) }

			audio.play()
		} catch(e) {
			console.log(e)
		}
	}
	
	return (
		<div>
			SORTEIO do torneio {id}

			<Button onClick={playAudio} isWaiting={isAudioPlaying}>
				Test voice
			</Button>

			{/* Incluir musica e tambores de suspense  */}
		</div>
	)
}