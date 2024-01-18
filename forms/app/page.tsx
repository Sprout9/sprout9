import Link from "next/link";
import Logo from "@/app/components/logo"
import { Cog6ToothIcon } from "@/app/components/icons";

export default function Home() {
    return (
        <main>
            <div className="sidebar">
                <Logo />
                <Link href="/forms" className="logout-button"><p>Go To Forms</p></Link>
                <Link
                    href="/account"
                    className="logout-button"
                >
                    <Cog6ToothIcon />
                    <p>Account</p>
                </Link>
            </div>
        </main >
    )
}
