import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql"
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },
    
    advanced: {
        cookies: {
            session_token: {
                name: "better-auth.session_token",
                attributes: {
                    sameSite: "none",
                    secure: false,
                    httpOnly: true
                }
            }
        },
        useSecureCookies: false
    },

    trustedOrigins: [process.env.WEB_URL || 'http://localhost:3000']
})