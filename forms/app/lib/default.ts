import { CoverPage, InputsPage, TextAreaPage, MultipleChoicePage, SubmitPage } from "@/app/lib/types"

export const DEFAULT_FORM = {
    // user_id, responses, id
    title: "New Form",
    published: false,
    send_email: true,
    pages: [],
    background_url: undefined,
    background_color: undefined,
    webhook_url: undefined,
}

export const DEFAULT_COVER_PAGE: CoverPage = {
    type: "cover",
    id: undefined,
    attributes: {
        title: {
            text: "",
            color: undefined
        },
        description: undefined,
        button_text: undefined,
        background_url: undefined,
        background_color: undefined,
        logo_url: undefined
    },
}

export const DEFAULT_INPUTS_PAGE: InputsPage = {
    type: "inputs",
    id: undefined,
    attributes: {
        title: {
            text: "",
            color: undefined
        },
        description: undefined,
        inputs: [],
        background_url: undefined,
        background_color: undefined,
    }
}

export const DEFAULT_TEXT_AREA_PAGE: TextAreaPage = {
    type: "textarea",
    id: undefined,
    attributes: {
        title: {
            text: "",
            color: undefined
        },
        description: undefined,
        background_url: undefined,
        background_color: undefined,
        placeholder: undefined,
        required: undefined,
        input_color: undefined,
        response: undefined,
    }
}

export const DEFAULT_MULTIPLE_CHOICE_PAGE: MultipleChoicePage = {
    type: "multiple_choice",
    id: undefined,
    attributes: {
        title: {
            text: "",
            color: undefined
        },
        description: undefined,
        choose_min: 1,
        choose_max: 1,
        columns: 2,
        options: [],
        background_url: undefined,
        background_color: undefined
    }
}

export const DEFAULT_SUBMIT_PAGE: SubmitPage = {
    type: "submit",
    id: undefined,
    attributes: {
        title: {
            text: "",
            color: undefined
        },
        description: undefined,
        background_url: undefined,
        background_color: undefined,
        logo_url: undefined,
        redirect_url: undefined,
        button_text: undefined
    }
}