import FormViewer from "@/app/components/form-viewer";
import { fetchForm } from "@/app/lib/data"
import { notFound } from "next/navigation";


export default async function Page({
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
    const form = await fetchForm(formId)

    if (!form) {
        notFound()
    }

    return (
        <FormViewer form={form} />
    )
}

