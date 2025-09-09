'use client'

import { ReactNode } from "react"
import { redirect } from 'next/navigation'
import MainMenu from "@/components/MainMenu"
import NavbarAuth from "@/components/NavbarAuth"
import { authClient } from "@/lib/auth"

export default function PrivateLayout({ children }: { children: ReactNode }) {
	const { 
        data: session,
		isPending
    } = authClient.useSession() 

	// const { data: session, error } = await authClient.getSession()

	console.log('session', session)

	if(!isPending && !session) {
		redirect('/signin')
	}

	return (
		<div className="grid grid-cols-[14rem_auto] grid-rows-[auto_1fr] min-h-screen">
			<NavbarAuth />

			<MainMenu />

			<main className="flex flex-col pl-10 pt-8 pr-8 pb-8">
				{children}
			</main>
		</div>
	)
}
