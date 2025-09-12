'use client'

import React, { useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { GlobalContext } from '@/contexts/GlobalContext'
import { signIn } from '@/lib/auth'

const loginSchema = z.object({
	email: z.email("Digite um e-mail válido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function SignIn() {
	const { setUser } = useContext(GlobalContext)

	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()

	const {
		register,
		handleSubmit
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: 'felipe@robot.rio.br',
			password: '12345678'
		}
	})

	async function handleSignIn(values: LoginFormValues) {
		try {
			const formData = new FormData()
			formData.append('email', values.email)
			formData.append('password', values.password)
			
			'use server'
			const response = await signIn('credentials', formData)

			console.log('response signin', response)
		} catch (e: any) {
			console.log('erro signin', e)

			toast.error(e.message)
		}
	}

	return (
		<div className="flex justify-center items-center h-[79vh]">
			<Card
				className="w-full h-fit max-w-md shadow-lg rounded-2xl border bg-white text-black dark:bg-slate-900 dark:text-white"
			>
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold">
						Login
					</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
						<Input
							placeholder="Seu email"
							type="email"
							{...register('email')}
							className="bg-white border-gray-300 dark:bg-slate-700 dark:border-slate-600"
						/>

						<Input
							placeholder="••••••••"
							type="password"
							{...register('password')}
							className="bg-white border-gray-300 dark:bg-slate-700 dark:border-slate-600"
						/>

						{/* Links */}
						<div className="flex justify-between text-sm">
							<Link
								href="/recover"
								className="hover:underline text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white"
							>
								Esqueci a senha
							</Link>

							<Link
								href="/signup"
								className="hover:underline text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white"
							>
								Cadastre-se
							</Link>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							Entrar
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
