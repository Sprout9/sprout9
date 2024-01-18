import SwitchButton from "@/app/components/switch-button"

export default function ToggleConfig({
    value,
    onToggle,
    id
}: {
    value: boolean,
    onToggle: () => void,
    id: string
}) {
    return (
        <div className="toggle-config">
            <SwitchButton
                value={value ? true : false}
                onToggle={onToggle}
                id={id}
            />
            {id.replaceAll("-", " ")}
        </div>
    )
}