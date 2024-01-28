import FormEditor from "@/app/components/form-editor"
import { fetchForm } from "@/app/lib/data"
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic'
export default async function Page({
    params,
}: {
    params?: {
        id?: string
    }
}) {
    noStore()
    const formId = params?.id || ""
    const form = await fetchForm(formId)

    if (!form) {
        notFound()
    }

    form.pages.forEach((page, index) => page.id = index)

    return (
        < main >
            <FormEditor form={form} />
        </main >
    )
}