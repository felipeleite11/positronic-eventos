import { useParams } from "next/navigation"

export default function Place() {
	const { id } = useParams()

	return (
		<div>Local {id}</div>
	)
}