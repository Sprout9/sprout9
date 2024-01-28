'use client'

import { useFormState, useFormStatus } from "react-dom";
import { ArrowRightIcon, AtSymbolIcon, KeyIcon } from "./icons";
import { authenticate } from "../lib/actions";

export default function LoginForm() {
    const [state, action] = useFormState(authenticate, undefined);

    const { pending } = useFormStatus()

    return (
        <form action={action} noValidate className="login-form">
            <input type="radio" name="submitted" id="submitted" className="submitted" />
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

            <button type="submit" aria-disabled={pending}>
                <label htmlFor="submitted">Log in</label>
                <ArrowRightIcon />
            </button>
            <a href="/create-account">
                <label>Create account</label>
                <ArrowRightIcon />
            </a>

            {state === 'CredentialsSignin' && <p className="error">Invalid credentials</p>}
        </form>
    )
}