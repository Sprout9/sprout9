import NextAuth, { DefaultSession } from "next-auth"
import { authConfig } from '@/auth.config'
import CredentialsProvider from 'next-auth/providers/credentials'
import lazyClient, { getDbName } from '@/db/mongodb'
import { z } from 'zod'
import type { TemporaryPassword, User } from '@/app/lib/types'
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

export const FIVE_MINUTES_IN_MILLIS = 1000 * 60 * 5

export async function compareTemporaryPassword(password: string, temporary_password: TemporaryPassword | undefined): Promise<boolean> {
    if (!temporary_password) {
        return false
    }
    const now = new Date().getTime()
    if (temporary_password.deadline < now) {
        return false
    }
    if (temporary_password.deadline > now + FIVE_MINUTES_IN_MILLIS) {
        console.error("Temporary password deadline > 5 minutes in the future, this should not be possible.")
        return false
    }
    return await bcrypt.compare(password, temporary_password.password)
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
                    const temporaryPasswordMatch = await compareTemporaryPassword(password, user.temporary_password)

                    if (passwordsMatch || temporaryPasswordMatch) {
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