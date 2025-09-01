'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Add() {
	async function handleAdd() {
		try {

		} catch(e) {

		}
	}

	return (
		<div className="flex flex-col gap-6">
			<Input placeholder="Nome do evento" defaultValue="Palestra Prof. Dr. Carlos Nogueira" />

			<Button onClick={handleAdd}>
				Criar evento
			</Button>
		</div>
	)
}