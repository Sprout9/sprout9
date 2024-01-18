import { Page, FormConfig, isCoverPage, isInputsPage, isTextAreaPage, isMultipleChoicePage, isSubmitPage } from "@/app/lib/types"
import CoverPageComponent from "@/app/components/pages/cover-page"
import InputsPageComponent from "@/app/components/pages/inputs-page"
import TextAreaPageComponent from "@/app/components/pages/text-area-page"
import MultipleChoicePageComponent from "@/app/components/pages/multiple-choice-page"
import SubmitPageComponent from "@/app/components/pages/submit-page"

export default function PageView({
    page,
    setPageState,
    formConfig,
    label,
    pageButtons,
    handleSubmit
}: {
    page: Page | undefined,
    setPageState: (page: Page) => void,
    formConfig: FormConfig,
    label: string,
    pageButtons: (text: string | undefined) => JSX.Element
    handleSubmit: () => void
}) {
    return (
        <div className={`page-view `} style={{ background: page?.attributes.background_color ?? "transparent" }}>
            {(page?.attributes.background_url || (formConfig.background_url && !page?.attributes.background_color)) &&
                <img
                    src={page?.attributes.background_url || formConfig.background_url}
                    alt="background image"
                    className="background-img"
                />}
            {page && isCoverPage(page) && <CoverPageComponent
                attributes={page.attributes}
                pageButtons={pageButtons}
            />}
            {page && isInputsPage(page) && <InputsPageComponent
                attributes={page.attributes}
                setAttributes={attributes => {
                    setPageState({
                        ...page,
                        attributes: attributes
                    })
                }}
                label={label}
                pageButtons={pageButtons}
            />}
            {page && isTextAreaPage(page) && <TextAreaPageComponent
                attributes={page.attributes}
                setAttributes={attributes => {
                    setPageState({
                        ...page,
                        attributes: attributes
                    })
                }}
                label={label}
                pageButtons={pageButtons}
            />}
            {page && isMultipleChoicePage(page) && <MultipleChoicePageComponent
                attributes={page.attributes}
                setAttributes={attributes => {
                    setPageState({
                        ...page,
                        attributes: attributes
                    })
                }}
                label={label}
                pageButtons={pageButtons}
            />}
            {page && isSubmitPage(page) && <SubmitPageComponent
                attributes={page.attributes}
                handleSubmit={handleSubmit}
                pageButtons={pageButtons}
            />}
        </div>
    );
}
