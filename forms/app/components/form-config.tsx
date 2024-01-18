import ConfigInput from "@/app/components/config-input"
import { FormConfig } from "@/app/lib/types"
import ToggleConfig from "@/app/components/toggle-config"
import NullableConfig from "@/app/components/nullable-config"
import { usePathname } from "next/navigation"

export default function FormConfig({
    formConfig,
    setFormConfig,
}: {
    formConfig: FormConfig,
    setFormConfig: (formConfig: FormConfig) => void
}) {
    const pathname = usePathname()

    const setTitle = (title: string) => setFormConfig({
        ...formConfig,
        title: title,
    })
    const setPublished = () => setFormConfig({
        ...formConfig,
        published: !formConfig.published
    })
    const setSendEmail = () => setFormConfig({
        ...formConfig,
        send_email: !formConfig.send_email
    })
    const setBackgroundUrl = (url?: string) => setFormConfig({
        ...formConfig,
        background_url: url
    })
    const setWebhookUrl = (url?: string) => setFormConfig({
        ...formConfig,
        webhook_url: url
    })
    const setBackgroundColor = (color?: string) => setFormConfig({
        ...formConfig,
        background_color: color
    })

    return (
        <div className="form-config">
            <ConfigInput
                value={formConfig.title}
                setValue={setTitle}
                label="form-name"
                placeholder=""
            />
            <ToggleConfig
                value={formConfig.published}
                onToggle={setPublished}
                id="is-published"
            />
            <ToggleConfig
                value={formConfig.send_email}
                onToggle={setSendEmail}
                id="send-new-response-email"
            />
            <NullableConfig
                nullableConfig={formConfig.background_url?.padEnd(1)}
                onToggle={() => setBackgroundUrl(formConfig.background_url?.padEnd(1) ? undefined : "")}
                id="form-background-url"
            >
                <ConfigInput
                    value={formConfig.background_url || ""}
                    setValue={setBackgroundUrl}
                    label="default-background-url"
                    placeholder="Choose default background image URL..."
                />
            </NullableConfig>
            <NullableConfig
                nullableConfig={formConfig.background_color?.padEnd(1)}
                onToggle={() => setBackgroundColor(formConfig.background_color?.padEnd(1) ? undefined : "")}
                id="form-fixed-background-color"
            >
                <ConfigInput
                    value={formConfig.background_color || ""}
                    setValue={setBackgroundColor}
                    label="default-background-color"
                    placeholder="Choose default background CSS color..."
                />
            </NullableConfig>
            <NullableConfig
                nullableConfig={formConfig.webhook_url?.padEnd(1)}
                onToggle={() => setWebhookUrl(formConfig.webhook_url?.padEnd(1) ? undefined : "")}
                id="form-webhook-url"
            >
                <ConfigInput
                    value={formConfig.webhook_url || ""}
                    setValue={setWebhookUrl}
                    label="default-webhook-url"
                    placeholder="Set response webhook URL..."
                />
            </NullableConfig>
            <a href={pathname.replace("edit", "response")} target="_blank" className="wide-button">
                View Result
            </a>
        </div>
    )
}