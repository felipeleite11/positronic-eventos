import { api } from "@/services/api"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: "E-mail", type: "text" },
        		password: { label: "Senha", type: "password" }
			},
			async authorize(credentials, request) {
				const { data } = await api.post('auth', credentials)

				return data
			}
		})
	],
	session: {
		strategy: 'jwt'
	}
})