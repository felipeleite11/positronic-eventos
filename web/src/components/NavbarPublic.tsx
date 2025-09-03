import React from 'react'
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Image from "next/image";
import Link from 'next/link';

export default function NavbarPublic() {
	return (
		<nav className="col-span-2 flex gap-6 justify-between items-center bg-white dark:bg-slate-950 border-b border-b-slate-300 dark:border-b-slate-700 px-4 h-fit">
			<div className="flex gap-8 items-center">
				<Link href="/">
					<Image alt="" width={200} height={100} src="/images/positronic.png" className="h-13 object-contain my-1" />
				</Link>

				<span className="text-lg font-semibold">Gestor de Eventos</span>
			</div>

			<div className="flex gap-6 items-center">
				<ThemeSwitcher />
			</div>
		</nav>
	)
}
