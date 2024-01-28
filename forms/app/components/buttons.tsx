'use client'

import Link from 'next/link'
import { DocumentArrowDownIcon, PencilIcon, PlusIcon, TrashIcon } from '@/app/components/icons'
import { join } from '@/app/lib/clsx'
import { useState } from 'react'

export function PageButtons({
    pageNumber,
    totalPages,
    text,
}: {
    pageNumber: number,
    totalPages: number,
    text: string | undefined,
}) {
    return (
        <>
            {pageNumber < totalPages && <a href={`#page-${pageNumber + 1}`} className="page-button">{text ?? "Ok"}</a>}
            {pageNumber > 1 && <a href={`#page-${pageNumber - 1}`} className="page-button bottom-left">{text ?? "Terug"}</a>}
            {pageNumber === 1 && <div className="bottom-left form-page-hint">Hint: Gebruik ↹ Tab en ↵ Enter om te switchen tussen input velden.</div>}
        </>
    )
}

export function ViewResponses({ id, responses }: { id: string, responses: number }) {
    return (
        <Link
            href={`/forms/${id}/view-responses`}
            className={`table-button ${responses <= 0 ? "disabled" : ""}`}
            aria-disabled={responses <= 0}
        >
            <div>{responses}</div>
        </Link>
    );
}

export function DownloadUserData() {
    return (
        <a href="/api/userdata" download className="create-form-button">
            <DocumentArrowDownIcon />
        </a>
    );
}

export function UpdateForm({ id }: { id: string }) {
    return (
        <Link
            href={`/forms/${id}/edit`}
            className="table-button"
        >
            <PencilIcon />
        </Link>
    );
}

export function CreateForm({
    createForm
}: {
    createForm: () => Promise<void>
}) {
    return (
        <form action={() => {
            createForm()
        }}>
            <button className="create-form-button">
                <span>Create Form</span>
                <PlusIcon />
            </button>
        </form>
    )
}

export function DeleteForm({
    id,
    deleteForm
}: {
    id: string,
    deleteForm: (id: string) => Promise<void>
}) {
    let [isFocused, setIsFocused] = useState(false)
    if (isFocused) {
        setTimeout(() => setIsFocused(false), 1000)
    }

    return (
        <form action={() => isFocused ? deleteForm(id) : setIsFocused(true)}>
            <button className={`table-button ${isFocused ? "focused" : ""}`}>
                <TrashIcon />
            </button>
        </form>
    );
}

export function AddPage({ action }: { action: () => void }) {
    return (
        <form action={action} className="add-page-button">
            <button>
                Add Page
                <PlusIcon />
            </button>
        </form>
    )
}

export function SmallAddPage({ action }: { action: () => void }) {
    return (
        <form action={action} className="small-add-page-button">
            <button>
                <PlusIcon />
            </button>
        </form>
    )
}

export function DeletePage({ action }: { action: () => void }) {
    return (
        <form action={action} className="delete-page-button">
            <button>
                <TrashIcon />
            </button>
        </form>
    )
}

export function TextButton({
    text,
    classes,
    fn
}: {
    text: string,
    classes: string[],
    fn: () => void,
}) {
    return (
        <form action={fn}>
            <button className={join("text-button", classes)}>
                {text}
            </button>
        </form>
    )
}
