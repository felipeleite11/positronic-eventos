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
	secret: '12345678',
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		async jwt({ token, user, account }) {
			// console.log(account?.access_token)
			
			if (user) {
				token.id = user.id
				token.name = user.name
				token.email = user.email
				token.picture = user.image
				token.person_id = user.person_id
				token.person = user.person
				// token.token = account?.access_token
			}

			return token
		},
		async session({ session, token }) {
			session.user = {
				id: token.id as string,
				name: token.name!,
				image: token.picture,
				email: token.email!,
				person_id: token.person_id as string,
				person: token.person as Person
			}
			// session.token = token.token as string

			return session
		}
	}
})