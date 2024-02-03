'use client'

import { useFormState, useFormStatus } from "react-dom";
import { ArrowRightIcon, AtSymbolIcon, KeyIcon } from "@/app/components/icons";
import { authenticate } from "@/app/lib/actions";
import { createTemporaryPassword } from "@/app/lib/data";
import { useState } from "react";

export default function LoginForm() {
    const [state, action] = useFormState(authenticate, undefined);

    const { pending } = useFormStatus()

    const [email, setEmail] = useState("")

    return (
        <form action={action} noValidate className="login-form">
            <input type="radio" name="submitted" id="submitted" className="submitted" />
            <input type="radio" name="forgot-password" id="forgot-password" className="forgot-password-submitted" />
            <h1 className="header">Please log in to continue.</h1>
            <div className="icon-input-control">
                <label htmlFor="email">
                    <span>Email</span>
                </label>
                <div>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <AtSymbolIcon />
                    <p className="error">
                        Please provide a valid email address.
                    </p>
                </div>
            </div>
            <div className="icon-input-control">
                <label htmlFor="password">
                    <span>Password</span>
                </label>
                <div>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                    />
                    <KeyIcon />
                </div>
            </div>

            <button type="submit" aria-disabled={pending} className="w-full">
                <label htmlFor="submitted" className="w-full">Log in</label>
                <ArrowRightIcon />
            </button>
            <a href="/create-account" className="w-full">
                <label className="w-full">Create account</label>
                <ArrowRightIcon />
            </a>
            <button type="button" className="w-full" onClick={() => {
                createTemporaryPassword(email)
            }}>
                <label htmlFor="forgot-password" className="w-full">Forgot password</label>
                <ArrowRightIcon />
            </button>

            {state === 'CredentialsSignin' && <p className="error">Invalid credentials</p>}
            {<p className="error forgot-password">Temporary password send to your email if an account exists</p>}
        </form>
    )
}