import { CoverPage } from "@/app/lib/types"
import FormattedText, { FormattedTextConfig } from "@/app/components/formatted-text"
import NullableConfig from "@/app/components/nullable-config"
import ConfigInput from "@/app/components/config-input"

export default function CoverPage({
    attributes,
    pageButtons
}: {
    attributes: CoverPage["attributes"],
    pageButtons: (text: string | undefined) => JSX.Element
}) {
    return (
        <div className={`form-page`}>
            {attributes.logo_url &&
                <img
                    src={attributes.logo_url}
                    className="form-page-logo"
                    alt="form-page-logo"
                />
            }
            <div className="form-page-text">
                <FormattedText
                    text={attributes.title}
                    cls="form-page-text-title"
                    required={false} />
                {attributes.description && <FormattedText
                    text={attributes.description}
                    cls="form-page-text-description"
                    required={false} />}
            </div>
            {pageButtons(attributes.button_text)}
        </div>
    );
};

export function CoverPageConfig({
    attributes,
    setAttributes,
}: {
    attributes: CoverPage["attributes"],
    setAttributes: (attributes: CoverPage["attributes"]) => void,
}) {
    const toggleDescription = () => setAttributes({
        ...attributes,
        description: attributes.description ? undefined : {
            text: "",
            color: undefined
        }
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

    return (
        <>
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
            <ConfigInput
                value={attributes.button_text || "Next"}
                setValue={(val) => setAttributes({ ...attributes, button_text: val })}
                label="button"
                placeholder="Next"
            />
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
        </>
    )
}