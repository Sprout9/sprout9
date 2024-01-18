export const PAGE_TYPES = ["cover", "inputs", "textarea", "multiple_choice", "submit"]

export const INPUT_TYPES = ["text", "email", "phone_number"]

export type Text = {
    text: string,
    color: string | undefined,
}

export type User = {
    id: string
    email: string
    password: string
    first_name: string
    last_name: string
}

export type CoverPage = {
    type: "cover",
    id: number | undefined,
    attributes: {
        title: Text,
        description: Text | undefined,
        button_text: string | undefined,
        background_url: string | undefined,
        background_color: string | undefined,
        logo_url: string | undefined,
    }
}

export type SubmitPage = {
    type: "submit",
    id: number | undefined,
    attributes: {
        title: Text,
        description: Text | undefined,
        background_url: string | undefined,
        background_color: string | undefined,
        logo_url: string | undefined,
        redirect_url: string | undefined,
        button_text: string | undefined,
    }
}

export type InputsPageInput = {
    type: "text" | "email" | "phone_number",
    label: Text | undefined,
    placeholder: string | undefined,
    required: boolean | undefined,
    input_color: string | undefined,
    response: string | undefined,
}

export type InputsPage = {
    type: "inputs",
    id: number | undefined,
    attributes: {
        title: Text,
        description: Text | undefined,
        inputs: InputsPageInput[],
        background_url: string | undefined,
        background_color: string | undefined,
    }
}

export type TextAreaPage = {
    type: "textarea",
    id: number | undefined,
    attributes: {
        title: Text,
        description: Text | undefined,
        background_url: string | undefined,
        background_color: string | undefined,
        placeholder: string | undefined,
        required: boolean | undefined,
        input_color: string | undefined,
        response: string | undefined,
    }
}

export type MultipleChoicePageOption = {
    text: Text,
    checked: boolean,
}

export type MultipleChoicePage = {
    type: "multiple_choice",
    id: number | undefined,
    attributes: {
        title: Text,
        description: Text | undefined,
        choose_min: number,
        choose_max: number,
        columns: number,
        options: MultipleChoicePageOption[],
        background_url: string | undefined,
        background_color: string | undefined,
    }
}

export type Page = CoverPage | InputsPage | TextAreaPage | MultipleChoicePage | SubmitPage

export type FormConfig = {
    title: string,
    published: boolean,
    send_email: boolean,
    background_url: string | undefined,
    background_color: string | undefined,
    webhook_url: string | undefined,
}

export type Form = FormConfig & {
    id: string
    user_id: string
    pages: Page[]
}

export type UserWithForm = User & {
    form: Form
}

export type UserWithForms = User & {
    forms: Form[]
}

export type InputResponse = {
    page: number,
    input: number,
    question: string,
    label: string,
    response: string,
}

export type Response = {
    title: string,
    user_id: string,
    form_id: string,
    timestamp: number,
    responses: InputResponse[]
}

export type ResponseWithId = {
    id: string,
    title: string,
    timestamp: number,
    responses: InputResponse[]
}

export const isCoverPage = (page: Page): page is CoverPage => page.type === "cover";
export const isInputsPage = (page: Page): page is InputsPage => page.type === "inputs";
export const isTextAreaPage = (page: Page): page is TextAreaPage => page.type === "textarea";
export const isMultipleChoicePage = (page: Page): page is MultipleChoicePage =>
    page.type === "multiple_choice";
export const isSubmitPage = (page: Page): page is SubmitPage => page.type === "submit";