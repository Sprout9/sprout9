import FormsTable from "@/app/components/forms-table"
import Logo from "@/app/components/logo"
import { Cog6ToothIcon, PowerIcon } from "@/app/components/icons";
import { signOut } from "@/auth";
import Link from "next/link";
import { createForm, deleteForm, fetchFilteredForms, fetchFormsTotal } from "@/app/lib/data";

export default function Home({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {

    return (
        <main>
            <div className="sidebar">
                <Logo />
                <Link
                    href="/account"
                    className="logout-button"
                >
                    <Cog6ToothIcon />
                    <p>Account</p>
                </Link>
                <form
                    action={async () => {
                        'use server'
                        await signOut()
                    }}
                >
                    <button className="logout-button">
                        <PowerIcon />
                        <p>Log-out</p>
                    </button>
                </form>
            </div>

            <div className="main-grid">
                <FormsTable
                    searchParams={searchParams}
                    createForm={createForm}
                    deleteForm={deleteForm}
                    fetchFilteredForms={fetchFilteredForms}
                    fetchFormsTotal={fetchFormsTotal}
                />
            </div>
        </main >
    )
}
