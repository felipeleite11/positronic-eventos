import React from 'react'
import { LogOut, Settings, User, User2Icon, UserCircle } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function ProfileContainer() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<div className="flex items-center gap-2 dark:hover:bg-slate-900 h-13 px-3 cursor-pointer">
					<Avatar className="w-7 h-7">
						<AvatarImage src="/images/boy.jpg" />
						<AvatarFallback>FL</AvatarFallback>
					</Avatar>

					<span>Felipe Leite</span>
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuLabel>
					<Link href="/" className="hover:opacity-80 w-full flex gap-2 items-center">
						<User2Icon size={16} />
						Minha conta
					</Link>
				</DropdownMenuLabel>

				<DropdownMenuItem>
					<Link href="/" className="hover:opacity-80 w-full flex gap-2 items-center">
						<Settings size={16} />
						Configurações
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<Link href="/" className="hover:opacity-80 w-full flex gap-2 items-center">
						<LogOut size={16} />
						Sair
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
