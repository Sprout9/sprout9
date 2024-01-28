import Link from "next/link";
import Logo from "@/app/components/logo"
import { PowerIcon } from "@/app/components/icons";
import { signOut } from "@/auth";
import AccountForm from "../components/account-form";
import { getUser } from "../lib/data";
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic'
export default async function Page() {
    noStore()

    const user = await getUser()

    return (
        <main>
            <div className="sidebar">
                <Logo />
                <Link href="/forms" className="logout-button"><p>Go To Forms</p></Link>
                <form
                    action={async () => {
                        'use server';
                        await signOut();
                    }}
                >
                    <button className="logout-button">
                        <PowerIcon />
                        <p>Log-out</p>
                    </button>
                </form>
            </div>

            <AccountForm user={user} />
        </main >
    )
}
