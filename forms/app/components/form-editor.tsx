'use client'

import Logo from "@/app/components/logo"
import FormPageSelector from "@/app/components/form-page-selector"
import { Form, Page, FormConfig, isInputsPage, isTextAreaPage, isMultipleChoicePage } from "@/app/lib/types"
import PageView from "@/app/components/page-view"
import PageConfig from "@/app/components/page-config"
import FormConfiguration from "@/app/components/form-config"
import { useState, useEffect, useCallback } from "react"
import PageActions from "@/app/components/page-actions"
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { DEFAULT_INPUTS_PAGE } from "@/app/lib/default"
import { updateForm } from "@/app/lib/data"
import { PageButtons } from "@/app/components/buttons"
import { ArrowLeftIcon } from "./icons"
import Link from "next/link"
import debounce from "../lib/debounce"

export const dynamic = 'force-dynamic' // defaults to auto

function clearResponses(form: Form): Form {
    return {
        ...form, pages: form.pages.map(page => {
            if (isInputsPage(page)) {
                return {
                    ...page, attributes: {
                        ...page.attributes,
                        inputs: page.attributes.inputs.map(inp => {
                            return { ...inp, response: undefined }
                        })
                    }
                }
            }
            else if (isTextAreaPage(page)) {
                return {
                    ...page, attributes: {
                        ...page.attributes,
                        response: undefined
                    }
                }
            }
            else if (isMultipleChoicePage(page)) {
                return {
                    ...page, attributes: {
                        ...page.attributes,
                        options: page.attributes.options.map(inp => {
                            return { ...inp, checked: false }
                        })
                    }
                }

            }
            return page
        })
    }
}


export default function FormEditor({ form }: { form: Form }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const currentPageIndex = (Number(searchParams.get("page")) || 1) - 1

    const [formState, setFormState] = useState(form)

    const saveForm = useCallback(
        debounce((newForm: Form) => {
            updateForm(newForm)
        }, 600),
        []
    )

    useEffect(() => {
        // npm build will call this useEffect for prerendering, 
        // accessing the MONGODB_URI which is not yet availabel at build time.
        // if (typeof window !== 'undefined') {
        saveForm(clearResponses(formState));
        // }
    }, [formState]);


    useEffect(() => {
        if (currentPageIndex < 0 ||
            (formState.pages.length && currentPageIndex >= formState.pages.length)) {
            replace(`${pathname}`);
        }
    }, [searchParams, formState, pathname])

    const currentPage = formState.pages[currentPageIndex]
    const setPageState = (pageState: Page) => {
        setFormState(prev => {
            return {
                ...prev,
                pages: [
                    ...prev.pages.slice(0, currentPageIndex),
                    pageState,
                    ...prev.pages.slice(currentPageIndex + 1)
                ]
            }
        })
    }

    const formConfig: FormConfig = {
        ...formState
    }

    const setFormConfig = (formConfig: FormConfig) => {
        setFormState(prev => {
            return {
                ...prev,
                ...formConfig,
            }
        })
    }

    const deletePage = () => {
        setFormState(prev => {
            return {
                ...prev,
                pages: [
                    ...prev.pages.slice(0, currentPageIndex),
                    ...prev.pages.slice(currentPageIndex + 1)
                ]
            }
        })

        if (currentPageIndex >= formState.pages.length) {
            const params = new URLSearchParams(searchParams)
            if (currentPageIndex > 0) {
                params.set("page", `${currentPageIndex}`)
                replace(`${pathname}?${params.toString()}`)
            } else {
                params.delete("page")
                replace(`${pathname}`)
            }
        }
    }

    const addPage = (page: Page, position: number) => {

        setFormState(prev => {
            let maxPageId = prev.pages
                .map(p => p.id || -1)
                .reduce((prev, curr) => prev < curr ? curr : prev, 0)

            return {
                ...prev,
                pages: [
                    ...prev.pages.slice(0, position),
                    {
                        ...page,
                        id: maxPageId + 1
                    },
                    ...prev.pages.slice(position),
                ]
            }
        })

        const params = new URLSearchParams(searchParams)
        params.set("page", `${position + 1}`)
        replace(`${pathname}?${params.toString()}`)
    }

    const defaultPage = DEFAULT_INPUTS_PAGE

    return (
        <div className="form-editor">
            <div className="sidebar">
                <Logo />

                <FormPageSelector
                    form={formState}
                    addPage={addPage}
                    defaultPage={defaultPage} />
            </div>

            <div className="v-divider" />

            <div className="page-view-wrapper"
                style={{ background: formConfig.background_color }}>
                <Link href="/forms" className="back-form-button btn">
                    <ArrowLeftIcon />
                </Link>
                <PageView
                    page={currentPage}
                    setPageState={setPageState}
                    formConfig={formConfig}
                    label="editor"
                    pageButtons={(text) => <PageButtons
                        pageNumber={currentPageIndex + 1}
                        totalPages={formState.pages.length}
                        text={text} />}
                    handleSubmit={() => { }}
                />
            </div>

            <div className="v-divider" />

            <div className="sidebar">
                <div className="configs">
                    <FormConfiguration
                        formConfig={formConfig}
                        setFormConfig={setFormConfig} />

                    {currentPage && <PageConfig
                        page={currentPage}
                        setPageState={setPageState} />}

                    {currentPage && <PageActions
                        deletePage={deletePage} />}
                </div>
            </div>
        </div >
    )
}