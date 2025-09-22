'use client'

import { useParams } from "next/navigation"

export default function Validate() {
	const { id } = useParams()

	return (
		<div>CERTIFICADO PIRATA!!!! {id}</div>
	)
}