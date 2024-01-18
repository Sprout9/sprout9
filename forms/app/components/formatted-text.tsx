import { Text } from "@/app/lib/types"
import ConfigInput from "@/app/components/config-input"
import MarkdownConverter from "@/app/lib/convert"

export default function FormattedText({
    text,
    cls = "",
    required = false
}: {
    text: Text,
    cls: string,
    required: boolean | undefined
}) {
    const convertedText = MarkdownConverter.makeHtml(text.text + (required ? "\*" : ""))
        .replaceAll("<a href=", '<a target="_blank" href=')

    return (
        <div
            className={`markdown ${cls}`}
            style={{ color: text.color ?? "inherit" }}
            dangerouslySetInnerHTML={{ __html: convertedText }}>
        </div>
    )
}

export function FormattedTextConfig({
    text,
    setText,
    label
}: {
    text: Text,
    setText: (text: Text) => void,
    label: string
}) {
    return (
        <div className="join">
            <ConfigInput
                value={text.text}
                setValue={(val) => setText({ ...text, text: val })}
                label={`${label}-text`}
                placeholder="Enter text..."
            />
            <ConfigInput
                value={text.color || ""}
                setValue={(val) => setText({ ...text, color: val.split(";")[0] })}
                label={`${label}-color`}
                placeholder="Choose CSS color..."
            />
        </div>
    )
}