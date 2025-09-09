import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3333",
    fetchOptions: {
        credentials: "include"
    }
})