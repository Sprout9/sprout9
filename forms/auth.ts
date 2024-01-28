import NextAuth, { DefaultSession } from "next-auth"
import { authConfig } from './auth.config'
import CredentialsProvider from 'next-auth/providers/credentials'
import lazyClient, { getDbName } from '@/db/mongodb'
import { z } from 'zod'
import type { User } from './app/lib/types'
import bcrypt from 'bcrypt'


declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string
        } & DefaultSession["user"]
    }
}

async function getUser(email: string): Promise<User | undefined> {
    try {
        const client = await lazyClient
        const user = await client.db(getDbName()).collection("users").aggregate<User>([
            { $match: { email: email } },
            { $addFields: { id: { $toString: "$_id" } } },
            { $project: { _id: 0 } },
        ]).next()
        return user ? user : undefined
    } catch (error) {
        throw new Error('Failed to fetch user.')
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            async authorize(credentials, request) {

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await getUser(email)
                    if (!user) {
                        return null
                    }
                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) {
                        return user
                    }
                }

                return null
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        session({ session, token, user }) {
            session.user = {
                ...session.user,
                id: token.sub ?? "",
            }
            return session
        },
    }
})