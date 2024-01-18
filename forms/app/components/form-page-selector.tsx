'use client'

import { Form, Page } from '@/app/lib/types';
import { Bars3CenterLeftIcon, HeartIcon, QuestionMarkCircleIcon, RectangleStackIcon, Squares2x2Icon } from '@/app/components/icons';
import { usePathname, useSearchParams } from 'next/navigation'
import { SmallAddPage, AddPage } from "@/app/components/buttons"
import Link from 'next/link';

const ICON_MAP = {
    cover: RectangleStackIcon(),
    inputs: QuestionMarkCircleIcon(),
    textarea: Bars3CenterLeftIcon(),
    multiple_choice: Squares2x2Icon(),
    submit: HeartIcon(),
}

export default function FormPageSelector({
    form,
    addPage,
    defaultPage,
}: {
    form: Form,
    addPage: (page: Page, position: number) => void,
    defaultPage: Page,
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get("page"))

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    return (
        <div className="form-page-selector">
            {form.pages.map((page, index) => (
                <div
                    key={page.id}>
                    <Link
                        href={createPageUrl(index + 1)}
                        className={`page ${index + 1 === currentPage ? "active" : ""}`}
                    >
                        <div className="icon">
                            {ICON_MAP[page.type]}
                            {index + 1}.
                        </div>
                        <div className="text">
                            {page.attributes.title.text}
                        </div>
                    </Link>
                    {index < form.pages.length - 1 && <SmallAddPage action={() => {
                        addPage(defaultPage, index + 1)
                    }} />}
                </div>
            ))}
            <AddPage action={() => addPage(defaultPage, form.pages.length)} />
        </div>
    )
}