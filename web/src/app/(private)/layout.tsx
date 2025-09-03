import { ReactNode } from "react"
import MainMenu from "@/components/MainMenu"
import NavbarAuth from "@/components/NavbarAuth"

export default async function PrivateLayout({ children }: { children: ReactNode }) {
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
