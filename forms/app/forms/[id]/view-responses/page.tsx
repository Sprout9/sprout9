import ResponsesTable from "@/app/components/responses-table"
import Logo from "@/app/components/logo"
import { PowerIcon } from "@/app/components/icons";
import { signOut } from "@/auth";

export default function Page({
    searchParams,
    params,
}: {
    searchParams?: {
        page?: string
    }
    params?: {
        id?: string
    }
}) {

    const formId = params?.id || ""

    return (
        <main>
            <div className="sidebar">
                <Logo />
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

            <div className="main-grid">
                <ResponsesTable formId={formId} searchParams={searchParams} />
            </div>
        </main >
    )
}
