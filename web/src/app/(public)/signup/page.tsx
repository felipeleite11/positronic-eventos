'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth'
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

const signupSchema = z.object({
	name: z.string("Digite seu nome"),
	phone: z.string("Digite seu celular"),
	email: z.email("Digite um e-mail válido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignUp() {
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()

	const {
		register,
		handleSubmit
	} = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: 'Felipe Leite',
			email: 'felipe@robot.rio.br',
			phone: '(91) 98129-3338',
			password: '12345678'
		}
	})

	async function handleSignUp(values: SignupFormValues) {
		try {
			const data = await authClient.signUp.email(values, {
				onRequest: () => {
					setIsLoading(true)
				},
				onSuccess: ctx => {
					setIsLoading(false)

					router.replace('/')
				},
				onError: ctx => {
					setIsLoading(false)

					toast.error(ctx.error.error)
				}
			})

			console.log('data', data)
		} catch (e: any) {
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
					<form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
						<Input
							placeholder="Seu nome"
							{...register('name')}
							className="bg-white border-gray-300 dark:bg-slate-700 dark:border-slate-600"
						/>

						<Input
							placeholder="Seu celular"
							{...register('phone')}
							className="bg-white border-gray-300 dark:bg-slate-700 dark:border-slate-600"
						/>

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
						<div className="flex justify-center text-sm">
							<Link
								href="/signin"
								className="hover:underline text-slate-600 hover:text-black dark:text-slate-300 dark:hover:text-white"
							>
								Já tenho conta
							</Link>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							Criar minha conta
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
