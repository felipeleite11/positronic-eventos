'use client'

import React from 'react'
import ProfileContainer from "@/components/ProfileContainer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Image from "next/image";
import Link from 'next/link';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function NavbarAuth() {
	const router = useRouter()

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.replace('/signin')
				}
			}
		})
	}

	return (
		<nav className="col-span-2 flex gap-6 justify-between items-center bg-white dark:bg-slate-950 border-b border-b-slate-300 dark:border-b-slate-700 px-4 h-fit">
			<div className="flex gap-8 items-center">
				<Link href="/">
					<Image alt="" width={200} height={100} src="/images/positronic.png" className="h-13 object-contain my-1" />
				</Link>

				<span className="text-lg font-semibold">Gestor de Eventos</span>
			</div>

			<div className="flex gap-6 items-center">
				<ProfileContainer />

				<ThemeSwitcher />

				<Button onClick={handleSignOut} className="w-12 h-12 bg-gray-200 hover:bg-gray-200 text-black dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
					<LogOut size={16} />
				</Button>
			</div>
		</nav>
	)
}
