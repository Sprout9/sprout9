'use client'

import { AtSymbolIcon, KeyIcon, UserCircleIcon } from "@/app/components/icons";
import { User } from "@/app/lib/types";
import { useFormState } from "react-dom";

export default function AccountForm({
    user,
    updateUser
}: {
    user: User,
    updateUser: (prevState: string | undefined, formData: FormData) => Promise<"parsing-error" | "wrong-password" | "new-password-not-matching" | undefined>
}) {
    const [state, action] = useFormState(updateUser, undefined)
    return (
        <main className="login-page">
            <form action={action} noValidate className="login-form">
                <input type="radio" name="submitted" id="submitted" className="submitted" />
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
                            defaultValue={user.email}
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
                            defaultValue={user.first_name}
                        />
                        <UserCircleIcon />
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
                            defaultValue={user.last_name}
                        />
                        <UserCircleIcon />
                    </div>
                </div>
                <div className="icon-input-control">
                    <label htmlFor="new-password">
                        <span>New Password</span>
                    </label>
                    <div>
                        <input
                            type="password"
                            name="new_password"
                            id="new-password"
                            placeholder="Enter your new password"
                        />
                        <KeyIcon />
                    </div>
                </div>
                <div className="icon-input-control">
                    <label htmlFor="new-password-check">
                        <span>New Password Check</span>
                    </label>
                    <div>
                        <input
                            type="password"
                            name="new_password_check"
                            id="new-password-check"
                            placeholder="Enter your new password"
                        />
                        <KeyIcon />
                    </div>
                </div>
                <div className="icon-input-control">
                    <label htmlFor="current-password">
                        <span>Current Password</span>
                    </label>
                    <div>
                        <input
                            type="password"
                            name="current_password"
                            id="current-password"
                            placeholder="Enter your current password before saving"
                            required
                        />
                        <KeyIcon />
                    </div>
                </div>


                {state === 'parsing-error' && <p className="error">Email invalid or current password contains less than 6 characters</p>}
                {state === 'wrong-password' && <p className="error">Invalid current password</p>}
                {state === 'new-password-not-matching' && <p className="error">New passwords do not match</p>}
                <button type="submit">
                    <label htmlFor="submitted">Save</label>
                </button>
            </form>
        </main>
    )
}
