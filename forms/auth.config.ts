import type { NextAuthConfig } from 'next-auth'

const isRespondingRegex = /\/forms\/[a-z0-9]+\/response(#page-[0-9]+)?/i

export const authConfig = {
    providers: [],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnForms = nextUrl.pathname.startsWith('/forms')
            const isResponding = isRespondingRegex.test(nextUrl.pathname)
            const isOnAccount = nextUrl.pathname === '/account'

            if (isOnForms || isOnAccount) {
                if (isResponding || isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/forms', nextUrl));
            }
            return true
        },
    },
} satisfies NextAuthConfig