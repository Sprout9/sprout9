'use client'

import {
    PAGE_TYPES,
    Page,
    isCoverPage,
    isInputsPage,
    isTextAreaPage,
    isMultipleChoicePage,
    isSubmitPage,
} from "@/app/lib/types"
import {
    DEFAULT_INPUTS_PAGE,
    DEFAULT_TEXT_AREA_PAGE,
    DEFAULT_MULTIPLE_CHOICE_PAGE,
    DEFAULT_COVER_PAGE,
    DEFAULT_SUBMIT_PAGE,
} from "@/app/lib/default"
import { CoverPageConfig } from "@/app/components/pages/cover-page"
import { InputsPageConfig } from "@/app/components/pages/inputs-page"
import { TextAreaPageConfig } from "@/app/components/pages/text-area-page"
import { MultipleChoicePageConfig } from "@/app/components/pages/multiple-choice-page"
import { SubmitPageConfig } from "@/app/components/pages/submit-page"
import Dropdown from "@/app/components/dropdown"

export default function PageConfig({
    page,
    setPageState,
}: {
    page: Page,
    setPageState: (page: Page) => void,
}) {

    const setPage = (newPage: Page, attributes: Page["attributes"]) => {
        isCoverPage(newPage) &&
            setPageState({ ...newPage, id: page.id, attributes: { ...newPage.attributes, ...attributes } })
        isInputsPage(newPage) &&
            setPageState({ ...newPage, id: page.id, attributes: { ...newPage.attributes, ...attributes } })
        isTextAreaPage(newPage) &&
            setPageState({ ...newPage, id: page.id, attributes: { ...newPage.attributes, ...attributes } })
        isMultipleChoicePage(newPage) &&
            setPageState({ ...newPage, id: page.id, attributes: { ...newPage.attributes, ...attributes } })
        isSubmitPage(newPage) &&
            setPageState({ ...newPage, id: page.id, attributes: { ...newPage.attributes, ...attributes } })
    }

    const setPageType = (type: string) => {
        const setDefault = (defaultPage: Page) => type === defaultPage.type &&
            setPage(defaultPage, {
                ...defaultPage.attributes,
                title: page.attributes.title,
                description: page.attributes.description,
                background_url: page.attributes.background_url,
                background_color: page.attributes.background_color,
            })

        setDefault(DEFAULT_COVER_PAGE)
        setDefault(DEFAULT_INPUTS_PAGE)
        setDefault(DEFAULT_TEXT_AREA_PAGE)
        setDefault(DEFAULT_MULTIPLE_CHOICE_PAGE)
        setDefault(DEFAULT_SUBMIT_PAGE)
    }

    return (
        <>
            <div className="page-config">
                <Dropdown
                    value={page.type}
                    setValue={setPageType}
                    options={PAGE_TYPES}
                    label="page-type"
                    placeholder="Choose page type..."
                />
                {isCoverPage(page) && <CoverPageConfig
                    attributes={page.attributes}
                    setAttributes={attr => setPageState({ ...page, attributes: attr })}
                />}
                {isInputsPage(page) && <InputsPageConfig
                    attributes={page.attributes}
                    setAttributes={attr => setPageState({ ...page, attributes: attr })}
                />}
                {isTextAreaPage(page) && <TextAreaPageConfig
                    attributes={page.attributes}
                    setAttributes={attr => setPageState({ ...page, attributes: attr })}
                />}
                {isMultipleChoicePage(page) && <MultipleChoicePageConfig
                    attributes={page.attributes}
                    setAttributes={attr => setPageState({ ...page, attributes: attr })}
                />}
                {isSubmitPage(page) && <SubmitPageConfig
                    attributes={page.attributes}
                    setAttributes={attr => setPageState({ ...page, attributes: attr })}
                />}
            </div>
        </>
    )
}