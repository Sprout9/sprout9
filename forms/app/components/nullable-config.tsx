import ToggleConfig from "@/app/components/toggle-config"

// For Possibly Undefined Configs
export default function NullableConfig({
    nullableConfig,
    onToggle,
    children,
    id,
}: {
    nullableConfig: any | undefined,
    onToggle: () => void,
    children: React.ReactNode,
    id: string,
}) {
    return (
        <div className="join">
            <ToggleConfig
                value={nullableConfig}
                onToggle={onToggle}
                id={`${id}-${nullableConfig ? "enabled" : "disabled"}`}
            />
            {nullableConfig && children}
        </div>
    )
}