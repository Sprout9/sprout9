'use server'

import { PlusIcon } from "./icons";

export async function SmallAddPage({ action }: { action: () => void }) {
    return (
        <form action={action} className="small-add-page-button">
            <button>
                <PlusIcon />
            </button>
        </form>
    )
}