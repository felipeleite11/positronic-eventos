import React from 'react'
import ProfileContainer from "@/components/ProfileContainer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Image from "next/image";
import Link from 'next/link';

export default function NavbarAuth() {
	return (
		<nav className="col-span-2 flex gap-6 justify-between items-center bg-white dark:bg-slate-950 border-b border-b-slate-300 dark:border-b-slate-700 px-4 h-fit">
			<Link href="/">
				<Image alt="" width={200} height={100} src="/images/logo.png" className="h-13 object-contain my-1" />
			</Link>

			<div className="flex gap-6 items-center">
				<ProfileContainer />

				<ThemeSwitcher />
			</div>
		</nav>
	)
}
