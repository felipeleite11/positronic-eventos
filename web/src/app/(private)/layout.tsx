'use client'

import { ReactNode, useEffect } from "react"
import MainMenu from "@/components/MainMenu"
import NavbarAuth from "@/components/NavbarAuth"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function PrivateLayout({ children }: { children: ReactNode }) {
	const { data: session, status } = useSession()

	const router = useRouter()

	useEffect(() => {
		if(status === 'unauthenticated') {
			router.replace('/signin')
		}
	}, [session])

	if (status === 'loading' || status === 'unauthenticated') {
		return (
			<div className="w-full h-screen flex justify-center items-center flex-col gap-4 text-slate-300">
				<Image alt="" src="/images/positronic.png" width={700} height={200} className="w-48 animation-jump" />
				Aguarde...
			</div>
		)
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
