'use client'

import { ReactNode, useEffect } from "react"
import MainMenu from "@/components/MainMenu"
import NavbarAuth from "@/components/NavbarAuth"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function PrivateLayout({ children }: { children: ReactNode }) {
	const { data: session, status } = useSession()

	const router = useRouter()

	useEffect(() => {
		if(status === 'unauthenticated') {
			router.replace('/signin')
		}
	}, [session])

	if (status === 'loading' || status === 'unauthenticated') {
		return <p>Aguarde...</p>
	}
	
	return (
		<div className="grid grid-cols-[14rem_auto] grid-rows-[auto_1fr] min-h-screen dark:bg-[url(/images/bg.png)] dark:bg-cover">
			<NavbarAuth />

			<MainMenu />

			<main className="flex flex-col pl-10 pt-8 pr-8 pb-8">
				{children}
			</main>
		</div>
	)
}
