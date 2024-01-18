
import { SubmitPage } from "@/app/lib/types"
import FormattedText, { FormattedTextConfig } from "@/app/components/formatted-text"
import NullableConfig from "@/app/components/nullable-config"
import ConfigInput from "@/app/components/config-input"
import { usePathname } from "next/navigation"
import { useCallback, useState } from "react"
import debounce from "@/app/lib/debounce"
import { useRouter } from 'next/navigation';

export default function SubmitPage({
    attributes,
    handleSubmit,
    pageButtons,
}: {
    attributes: SubmitPage["attributes"],
    handleSubmit: () => void,
    pageButtons: (text: string | undefined) => JSX.Element
}) {

    const [submitted, setSubmitted] = useState(false)
    const pathname = usePathname()
    const { push } = useRouter()

    const timeout = useCallback(debounce(() => {
        const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/;

        const isResponding = pathname.endsWith("response")
        const validRedirectUrl = attributes.redirect_url
            && attributes.redirect_url.length < 512
            && urlRegex.test(attributes.redirect_url)

        if (isResponding && validRedirectUrl) {
            attributes.redirect_url && push(attributes.redirect_url)
        }
    }, 3000), [])


    return (
        <div className={`form-page`}>

            {!submitted && <button id="submit-button" type="button" className="page-button" onClick={() => {
                handleSubmit()
                setSubmitted(true)
                timeout()
            }}>{attributes.button_text ?? "Verstuur"}</button>}

            {submitted && attributes.logo_url &&
                <img
                    src={attributes.logo_url}
                    className="form-page-logo"
                    alt="form-page-logo"
                />
            }
            {submitted && <div className="form-page-text">
                <FormattedText
                    text={attributes.title}
                    cls="form-page-text-title"
                    required={false} />
                {attributes.description && <FormattedText
                    text={attributes.description}
                    cls="form-page-text-description"
                    required={false} />}
            </div>}
            {!submitted && pageButtons(undefined)}
        </div>
    );
};

export function SubmitPageConfig({
    attributes,
    setAttributes,
}: {
    attributes: SubmitPage["attributes"],
    setAttributes: (attributes: SubmitPage["attributes"]) => void,
}) {
    const toggleDescription = () => setAttributes({
        ...attributes,
        description: attributes.description ? undefined : {
            text: "",
            color: undefined
        }
    })

    const toggleRedirectUrl = () => setAttributes({
        ...attributes,
        redirect_url: attributes.redirect_url?.padEnd(1) ? undefined : ""
    })

    const toggleLogoUrl = () => setAttributes({
        ...attributes,
        logo_url: attributes.logo_url?.padEnd(1) ? undefined : ""
    })

    const toggleBackgroundUrl = () => setAttributes({
        ...attributes,
        background_url: attributes.background_url?.padEnd(1) ? undefined : ""
    })

    const toggleBackgroundColor = () => setAttributes({
        ...attributes,
        background_color: attributes.background_color?.padEnd(1) ? undefined : ""
    })

    const toggleButtonText = () => setAttributes({
        ...attributes,
        button_text: attributes.button_text?.padEnd(1) ? undefined : ""
    })

    return (
        <>
            <NullableConfig
                nullableConfig={attributes.redirect_url?.padEnd(1)}
                onToggle={toggleRedirectUrl}
                id="page-redirect-url"
            >
                <ConfigInput
                    value={attributes.redirect_url || ""}
                    setValue={(val) => setAttributes({ ...attributes, redirect_url: val })}
                    label="redirect-url"
                    placeholder="URL Redirect after 3 sec..."
                />
            </NullableConfig>
            <NullableConfig
                nullableConfig={attributes.logo_url?.padEnd(1)}
                onToggle={toggleLogoUrl}
                id="page-logo-url"
            >
                <ConfigInput
                    value={attributes.logo_url || ""}
                    setValue={(val) => setAttributes({ ...attributes, logo_url: val })}
                    label="logo-url"
                    placeholder="Choose logo URL..."
                />
            </NullableConfig>
            <FormattedTextConfig
                text={attributes.title}
                setText={(text) => setAttributes({ ...attributes, title: text })}
                label="title"
            />
            <NullableConfig
                nullableConfig={attributes.description}
                onToggle={toggleDescription}
                id="description"
            >
                <FormattedTextConfig
                    text={attributes.description!}
                    setText={(text) => setAttributes({ ...attributes, description: text })}
                    label="description"
                />
            </NullableConfig>
            <NullableConfig
                nullableConfig={attributes.background_url?.padEnd(1)}
                onToggle={toggleBackgroundUrl}
                id="page-background-url"
            >
                <ConfigInput
                    value={attributes.background_url || ""}
                    setValue={(val) => setAttributes({ ...attributes, background_url: val })}
                    label="background-url"
                    placeholder="Choose background image URL..."
                />
            </NullableConfig>
            <NullableConfig
                nullableConfig={attributes.background_color?.padEnd(1)}
                onToggle={toggleBackgroundColor}
                id="page-background-color"
            >
                <ConfigInput
                    value={attributes.background_color || ""}
                    setValue={(val) => setAttributes({ ...attributes, background_color: val })}
                    label="background-color"
                    placeholder="Choose background CSS color..."
                />
            </NullableConfig>
            <NullableConfig
                nullableConfig={attributes.button_text?.padEnd(1)}
                onToggle={toggleButtonText}
                id="page-button-text"
            >
                <ConfigInput
                    value={attributes.button_text || ""}
                    setValue={(val) => setAttributes({ ...attributes, button_text: val })}
                    label="button-text"
                    placeholder="Choose button text..."
                />
            </NullableConfig>
        </>
    )
}