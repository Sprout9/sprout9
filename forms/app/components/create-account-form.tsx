'use client'

import { useFormState, useFormStatus } from "react-dom";
import { ArrowRightIcon, AtSymbolIcon, KeyIcon, UserCircleIcon } from "./icons";
import { createUser } from "@/app/lib/data";
import { redirect } from "next/navigation";

export default function CreateAccountForm() {
    const [state, action] = useFormState(createUser, undefined);

    const { pending } = useFormStatus()

    if (state === "success") {
        redirect(`/login`)
    }

    return (
        <form action={action} noValidate className="login-form">
            <input type="radio" name="submitted" id="submitted" className="submitted" />
            <h1 className="header">Create new user.</h1>
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
                <label htmlFor="first-name">
                    <span>First Name</span>
                </label>
                <div>
                    <input
                        type="text"
                        name="first_name"
                        id="first-name"
                        placeholder="John..."
                        required
                        minLength={2}
                    />
                    <UserCircleIcon />
                    <p className="error">
                        Name should have at least 2 characters.
                    </p>
                </div>
            </div>
            <div className="icon-input-control">
                <label htmlFor="last-name">
                    <span>Last Name</span>
                </label>
                <div>
                    <input
                        type="text"
                        name="last_name"
                        id="last-name"
                        placeholder="Doe..."
                        required
                        minLength={2}
                    />
                    <UserCircleIcon />
                    <p className="error">
                        Name should have at least 2 characters.
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
                    <p className="error">
                        Password should have at least 6 characters.
                    </p>
                </div>
            </div>


            {state === 'parsing-error' && <p className="error">Some fields are invalid</p>}
            {state === 'email-already-taken' && <p className="error">Email already taken</p>}
            <button type="submit" disabled={pending}>
                <label htmlFor="submitted">Create User</label>
                <ArrowRightIcon />
            </button>
            <a href="/login">
                <label>Login</label>
                <ArrowRightIcon />
            </a>
        </form>
    )
}