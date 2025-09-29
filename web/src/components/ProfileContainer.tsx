'use client'

import React from 'react'
import { LogOut, Settings, User2Icon } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function ProfileContainer() {
	const { data: session } = useSession()

	async function handleSignout() {
		signOut({ 
			callbackUrl: '/signin', 
			redirect: true 
		})
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<div className="flex items-center gap-2 dark:hover:bg-slate-900 h-13 px-3 cursor-pointer">
					<Avatar className="w-10 h-10">
						{session?.user?.image && <AvatarImage src={session.user.image} className="object-cover" />}
						<AvatarFallback>{session?.user?.name?.[0].toUpperCase()}</AvatarFallback>
					</Avatar>

					<span className="text-sm">{session?.user?.name}</span>
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuItem>
					<Link href="/account" className="font-normal hover:opacity-80 w-full flex gap-2 items-center hover:bg-slate-800 rounded-md">
						<User2Icon size={16} />
						Minha conta
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Link href="/settings" className="font-normal hover:opacity-80 w-full flex gap-2 items-center">
						<Settings size={16} />
						Configurações
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<div className="font-normal hover:opacity-80 w-full flex gap-2 items-center cursor-pointer" onClick={handleSignout}>
						<LogOut size={16} />
						Sair
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
