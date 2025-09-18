'use client'

import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { GlobalContextProvider } from "@/contexts/GlobalContext"
import { SessionProvider } from "next-auth/react"
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<GlobalContextProvider>
					<NuqsAdapter>
						{children}
					</NuqsAdapter>
				</GlobalContextProvider>
			</SessionProvider>
    	</QueryClientProvider>
	</ThemeProvider>
  )
}
