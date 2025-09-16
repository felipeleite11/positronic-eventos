import { api } from "@/services/api"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z, ZodError } from "zod"

export const signInSchema = z.object({
	email: z.email('E-mail inválido.').min(1, 'E-mail não informado.'),
	password: z.string()
		.min(1, 'Senha não informada.')
		.min(8, "A senha informada não contém menos de 8 caracteres.")
})

export const handler = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: { label: "E-mail", type: "text" },
				password: { label: "Senha", type: "password" }
			},
			async authorize(credentials, request) {
				try {
					const { email, password } = await signInSchema.parseAsync(credentials)

					const { data } = await api.post('auth', {
						email,
						password
					})

					if (!data) {
						throw new Error('Credenciais inválidas.')
					}

					return data
				} catch (error) {
					if (error instanceof ZodError) {
						console.log('ZodError')
					}

					return null
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.name = user.name
				token.email = user.email
				token.picture = user.image
				token.person_id = user.person_id
			}

			return token
		},
		async session({ session, token }) {
			session.user = {
				name: token.name,
				image: token.picture,
				email: token.email,
				person_id: token.person_id
			}

			return session
		}
	}
})