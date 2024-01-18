import capitalize from "@/app/lib/capitalize"

export default function Dropdown({
    value,
    setValue,
    options,
    label,
    placeholder,
}: {
    value: string,
    setValue: (value: string) => void,
    options: string[],
    label: string,
    placeholder: string | undefined,
}) {
    return (
        <div className="dropdown-input">
            <label htmlFor={label}>{label.replaceAll("-", " ")}</label>
            <select
                id={label}
                name={label}
                value={value}
                onChange={event => setValue(event.target.value)}
            >
                {placeholder && <option value="" disabled>
                    {placeholder}
                </option>}
                {options.map(opt => (
                    <option key={opt} value={opt}>
                        {capitalize(opt.replaceAll(/-|_|bg-|text-/ig, " "))}
                    </option>
                ))}
            </select>
        </div>
    )
}