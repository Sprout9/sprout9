import { InputsPage } from "@/app/lib/types";
import FormattedText, { FormattedTextConfig } from "@/app/components/formatted-text"
import NullableConfig from "../nullable-config";
import ConfigInput from "@/app/components/config-input";
import { MinusIcon, PlusIcon } from "@/app/components/icons";
import ToggleConfig from "@/app/components/toggle-config";

export default function InputsPage({
    attributes,
    setAttributes,
    label,
    pageButtons,
}: {
    attributes: InputsPage["attributes"],
    setAttributes: (attributes: InputsPage["attributes"]) => void,
    label: string,
    pageButtons: (text: string | undefined) => JSX.Element,
}) {

    const setResponse = (index: number, response: string) => {
        setAttributes({
            ...attributes,
            inputs: [
                ...attributes.inputs.slice(0, index),
                { ...attributes.inputs[index], response: response },
                ...attributes.inputs.slice(index + 1)
            ]
        })
    }

    return (
        <div className={`form-page`}>
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

            {
                attributes.inputs.map((inp, index) => (
                    <div key={index} className="form-control">
                        <label className="label" style={{ color: inp.label?.color }}>
                            <span
                                className={`label-text`}>
                                {`${inp.label?.text || ""}`}</span>
                            <span
                                className={`label-text`}>
                                {`${inp.required ? "*" : ""}`}</span>
                        </label>
                        <input
                            id={`${label}-input-${index}-${inp.type}`}
                            name={`${label}-input-${index}-${inp.type}`}
                            type={inp.type}
                            step="0.01"
                            placeholder={inp.placeholder}
                            value={inp.response || ""}
                            onChange={event => setResponse(index, event.target.value)}
                            className={`input`}
                            required={inp.required}
                            style={{ color: inp.input_color, borderColor: inp.input_color }}
                        />
                    </div>
                ))
            }
            {pageButtons(undefined)}
        </div>
    )
};


export function InputsPageConfig({
    attributes,
    setAttributes,
}: {
    attributes: InputsPage["attributes"],
    setAttributes: (attributes: InputsPage["attributes"]) => void,
}) {
    const toggleDescription = () => setAttributes({
        ...attributes,
        description: attributes.description ? undefined : {
            text: "",
            color: undefined
        }
    })

    const updateInput = (index: number, key: string, val: any) => setAttributes({
        ...attributes,
        inputs: [
            ...attributes.inputs.slice(0, index),
            {
                ...attributes.inputs[index],
                [key]: val
            },
            ...attributes.inputs.slice(index + 1)
        ]
    })

    const toggleBackgroundUrl = () => setAttributes({
        ...attributes,
        background_url: attributes.background_url?.padEnd(1) ? undefined : ""
    })

    const toggleBackgroundColor = () => setAttributes({
        ...attributes,
        background_color: attributes.background_color?.padEnd(1) ? undefined : ""
    })

    const addInput = () => setAttributes({
        ...attributes,
        inputs: [
            ...attributes.inputs,
            {
                type: "text",
                label: undefined,
                placeholder: undefined,
                required: undefined,
                input_color: undefined,
                response: undefined,
            }
        ]
    })

    const removeInput = () => setAttributes({
        ...attributes,
        inputs: [
            ...attributes.inputs.slice(0, -1)
        ]
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
            {attributes.inputs.map((inp, index) => (
                <div key={index} className="join inputs-config">
                    <NullableConfig
                        nullableConfig={inp.placeholder?.padEnd(1)}
                        onToggle={() => updateInput(
                            index, "placeholder", inp.placeholder?.padEnd(1) ? undefined : "")}
                        id={`input-${index}-placeholder`}
                    >
                        <ConfigInput
                            value={inp.placeholder || ""}
                            setValue={(val) => updateInput(index, "placeholder", val)}
                            label={`input-${index}-placeholder`}
                            placeholder="Placeholder..."
                        />
                    </NullableConfig>
                    <NullableConfig
                        nullableConfig={inp.label}
                        onToggle={() => updateInput(
                            index, "label", inp.label ? undefined : { text: "", color: undefined })}
                        id={`input-${index}-label`}
                    >
                        <FormattedTextConfig
                            text={inp.label!}
                            setText={(text) => updateInput(index, "label", text)}
                            label={`input-${index}-label`}
                        />
                    </NullableConfig>
                    <ConfigInput
                        value={inp.input_color || ""}
                        setValue={(val) => updateInput(index, "input_color", val.split(";")[0])}
                        label={`input-${index}-color`}
                        placeholder="Choose input CSS color..."
                    />
                    <ToggleConfig
                        value={inp.required || false}
                        onToggle={() => updateInput(index, "required", !inp.required)}
                        id={`input-${index}-is-required`}
                    />
                </div>
            ))}
            <div className="join-row">
                <button
                    className="btn join-item"
                    onClick={addInput}
                ><PlusIcon /></button>
                <button
                    className="btn join-item"
                    onClick={removeInput}
                ><MinusIcon /></button>
            </div>
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