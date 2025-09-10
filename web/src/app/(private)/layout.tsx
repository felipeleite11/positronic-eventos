// 'use client'

import { ReactNode } from "react"
import MainMenu from "@/components/MainMenu"
import NavbarAuth from "@/components/NavbarAuth"
// import { authClient } from "@/lib/auth"

export default function PrivateLayout({ children }: { children: ReactNode }) {
	// const { data: session, error } = await authClient.getSession()

	// const {
	// 	data: session,
	// 	isPending
	// } = authClient.useSession()

	// const router = useRouter()

	// console.log('useSession', session)

	// useEffect(() => {
	// 	if (!isPending && !session) {
	// 		router.replace('/signin')
	// 	}
	// }, [isPending, session, router])

	// if (isPending) {
	// 	return <p className="text-yellow-500 text-2xl font-bold">Aguarde...</p>
	// }

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
