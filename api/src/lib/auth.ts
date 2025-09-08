
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
    // trustedOrigins: [process.env.WEB_URL || 'http://localhost:3000']
})