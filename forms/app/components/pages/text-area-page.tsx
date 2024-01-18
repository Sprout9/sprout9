import { TextAreaPage } from "@/app/lib/types";
import FormattedText, { FormattedTextConfig } from "@/app/components/formatted-text"
import NullableConfig from "../nullable-config";
import ConfigInput from "@/app/components/config-input";
import ToggleConfig from "../toggle-config";

export default function TextAreaPage({
    attributes,
    setAttributes,
    label,
    pageButtons
}: {
    attributes: TextAreaPage["attributes"],
    setAttributes: (attributes: TextAreaPage["attributes"]) => void,
    label: string,
    pageButtons: (text: string | undefined) => JSX.Element
}) {
    return (
        <div className={`form-page`}>
            <div className="form-page-text">
                <FormattedText
                    text={attributes.title}
                    cls="form-page-text-title"
                    required={attributes.required} />
                {attributes.description && <FormattedText
                    text={attributes.description}
                    cls="form-page-text-description"
                    required={false} />}
            </div>
            <textarea
                className={`textarea`}
                placeholder={attributes.placeholder || ""}
                name={label}
                value={attributes.response || ""}
                onChange={event => setAttributes({ ...attributes, response: event.target.value })}
                required={attributes.required}
                style={{ color: attributes.input_color }}
            />
            {pageButtons(undefined)}
        </div>
    )
};


export function TextAreaPageConfig({
    attributes,
    setAttributes,
}: {
    attributes: TextAreaPage["attributes"],
    setAttributes: (attributes: TextAreaPage["attributes"]) => void,
}) {
    const toggleDescription = () => setAttributes({
        ...attributes,
        description: attributes.description ? undefined : {
            text: "",
            color: undefined
        }
    })

    const togglePlaceholder = () => setAttributes({
        ...attributes,
        placeholder: attributes.placeholder?.padEnd(1) ? undefined : ""
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
            <ToggleConfig
                value={attributes.required || false}
                onToggle={() => setAttributes({ ...attributes, required: !attributes.required })}
                id="is-required"
            />
            <NullableConfig
                nullableConfig={attributes.placeholder?.padEnd(1)}
                onToggle={togglePlaceholder}
                id="placeholder"
            >
                <ConfigInput
                    value={attributes.placeholder || ""}
                    setValue={(val) => setAttributes({ ...attributes, placeholder: val })}
                    label="placeholder"
                    placeholder="Placeholder..."
                />
            </NullableConfig>
            <ConfigInput
                value={attributes.input_color || ""}
                setValue={(val) => setAttributes({ ...attributes, input_color: val.split(";")[0] })}
                label={`input-color`}
                placeholder="Choose input CSS color..."
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