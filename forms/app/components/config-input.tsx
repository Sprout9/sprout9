export default function ConfigInput({
    value,
    setValue,
    label,
    placeholder,
}: {
    value: string,
    setValue: (value: string) => void,
    label: string,
    placeholder: string,
}) {
    return (
        <div className="textarea-input">
            <label
                htmlFor={label}
                className={`text-input-label`}
            >{label.replaceAll("-", " ")}</label>
            <textarea
                id={label}
                name={label}
                placeholder={placeholder}
                value={value}
                onChange={event => setValue(event.target.value.split(";")[0])}
                className="text-input-input"
            />
        </div>
    )
}