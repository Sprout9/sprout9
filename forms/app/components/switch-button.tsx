export default function SwitchButton({
    value,
    onToggle,
    id
}: {
    value: boolean,
    onToggle: () => void,
    id: string
}) {
    return (
        <div className="switch-button">
            <input type="checkbox" id={id} checked={value} onChange={onToggle} />
            <label htmlFor={id}></label>
        </div>
    )
}