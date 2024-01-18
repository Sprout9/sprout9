import { MultipleChoicePage } from "@/app/lib/types";
import FormattedText, { FormattedTextConfig } from "../formatted-text";
import NullableConfig from "../nullable-config";
import { MinusIcon, PlusIcon } from "../icons";
import ConfigInput from "../config-input";
import Dropdown from "../dropdown";

function range(start: number, end: number): number[] {
    return Array.apply(0, Array(end - start)).map((_, ind) => ind + start)
}

export default function MultipleChoicePage({
    attributes,
    setAttributes,
    label,
    pageButtons,
}: {
    attributes: MultipleChoicePage["attributes"],
    setAttributes: (attributes: MultipleChoicePage["attributes"]) => void,
    label: string,
    pageButtons: (text: string | undefined) => JSX.Element
}) {
    const setResponse = (index: number) => {
        setAttributes({
            ...attributes,
            options: [
                ...attributes.options.slice(0, index),
                { ...attributes.options[index], checked: !attributes.options[index].checked },
                ...attributes.options.slice(index + 1)
            ]
        })
    }

    return (
        <div className="form-page">
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

            <div className="mc-options" style={{ "gridTemplateColumns": `repeat(${attributes.columns}, 1fr)` }}>
                {attributes.options.map((inp, index) => (
                    <div key={index} className={`mc-option`}>
                        <input
                            type="checkbox"
                            checked={inp.checked}
                            className={`checkbox`}
                            style={{ color: inp.text.color, background: inp.checked ? (inp.text.color ?? "white") : "transparent" }}
                            id={`${label}-${index}`}
                            onChange={() => setResponse(index)} />
                        <label
                            className={`label`}
                            htmlFor={`${label}-${index}`}
                            style={{ color: inp.text.color }}>
                            {inp.text.text}
                        </label>
                    </div>
                ))}
            </div>
            {pageButtons(undefined)}
        </div>
    )
};


export function MultipleChoicePageConfig({
    attributes,
    setAttributes,
}: {
    attributes: MultipleChoicePage["attributes"],
    setAttributes: (attributes: MultipleChoicePage["attributes"]) => void,
}) {
    const toggleDescription = () => setAttributes({
        ...attributes,
        description: attributes.description ? undefined : {
            text: "",
            color: undefined
        }
    })

    const updateOption = (index: number, key: string, val: any) => setAttributes({
        ...attributes,
        options: [
            ...attributes.options.slice(0, index),
            {
                ...attributes.options[index],
                [key]: val
            },
            ...attributes.options.slice(index + 1)
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

    const addOption = () => setAttributes({
        ...attributes,
        options: [
            ...attributes.options,
            {
                text: { text: "New option", color: undefined },
                checked: false,
            }
        ]
    })

    const removeOption = () => setAttributes({
        ...attributes,
        options: [
            ...attributes.options.slice(0, -1)
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

            <Dropdown
                value={String(attributes.columns)}
                setValue={(val) => setAttributes({ ...attributes, columns: Number(val) })}
                options={range(0, 6).map(num => String(num))}
                label="num-columns"
                placeholder="Choose num columns..."
            />
            {/* <Dropdown
                value={String(attributes.choose_min)}
                setValue={(val) => setAttributes({
                    ...attributes,
                    choose_min: Number(val),
                    choose_max: Math.max(Number(val), attributes.choose_max)
                })}
                options={range(0, 6).map(num => String(num))}
                label="choose-min"
                placeholder="Choose min..."
            />
            <Dropdown
                value={String(attributes.choose_max)}
                setValue={(val) => setAttributes({
                    ...attributes,
                    choose_min: Math.min(Number(val), attributes.choose_min),
                    choose_max: Number(val)
                })}
                options={range(1, 6).map(num => String(num))}
                label="choose-max"
                placeholder="Choose max..."
            /> */}

            {attributes.options.map((inp, index) => (
                <div key={index} className="join options-config">
                    <FormattedTextConfig
                        text={inp.text!}
                        setText={(text) => updateOption(index, "text", text)}
                        label={`option-${index}-text`}
                    />
                </div>
            ))}
            <div className="join-row">
                <button
                    className="btn join-item"
                    onClick={addOption}
                ><PlusIcon /></button>
                <button
                    className="btn join-item"
                    onClick={removeOption}
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