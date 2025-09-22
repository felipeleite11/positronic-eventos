'use client'

import { api } from "@/services/api"
import { Subscription } from "@/types/Subscription"
import { useQuery } from "@tanstack/react-query"
import { redirect, useParams } from "next/navigation"

export default function Overview() {
	const { id } = useParams()

	const { data: subscription } = useQuery<Subscription>({
		queryKey: ['get-certificate-link'],
		queryFn: async () => {
			const { data } = await api.get<Subscription>(`subscription/${id}`)

			return data
		}
	})

	if(!subscription?.certificateLink) {
		redirect('/signin')
	}

	return (
		<div>
			Overview: {subscription.certificateLink}
		</div>
	)
}