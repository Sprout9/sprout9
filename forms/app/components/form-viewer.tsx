'use client'

import { Form, Page } from "@/app/lib/types";
import PageView from "@/app/components/page-view";
import { FormConfig } from "@/app/lib/types";
import { PageButtons } from "@/app/components/buttons";
import { useState } from "react";
import { handleResponse } from "@/app/lib/data";
import { usePathname } from "next/navigation";

export default function FormViewer({ form }: { form: Form }) {

    const [formState, setFormState] = useState(form)
    const setPageState = (index: number) => (pageState: Page) => setFormState(prev => {
        return {
            ...prev,
            pages: [
                ...prev.pages.slice(0, index),
                pageState,
                ...prev.pages.slice(index + 1)
            ]
        }
    })

    const formConfig: FormConfig = {
        ...formState
    }
    const pathname = usePathname()

    return (
        <form
            className="full-page-scroll-snap scrollbar-hide"
            style={{ background: formConfig.background_color }}
        >
            {formState.pages.map((page, index) => (
                <div id={`page-${index + 1}`} key={index} className={`full-page-scroll-snap-child`} >
                    <PageView
                        page={page}
                        setPageState={setPageState(index)}
                        formConfig={formConfig}
                        label={`${index}-response`}
                        pageButtons={(text) => <PageButtons
                            pageNumber={index + 1}
                            totalPages={formState.pages.length}
                            text={text} />}
                        handleSubmit={() => {
                            handleResponse(formState)
                        }}
                    />
                </div>
            ))}
        </form>
    )
}