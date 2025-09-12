import { ReactNode } from "react"
import NavbarPublic from "@/components/NavbarPublic"

export default async function PrivateLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen bg-[url(/images/meetup.jpg)] bg-cover">
			<div className="flex flex-col min-h-screen bg-slate-900/80">
				<NavbarPublic />

				<main className="flex flex-col pl-10 pt-8 pr-8 pb-8">
					{children}
				</main>
			</div>
		</div>
	)
}
