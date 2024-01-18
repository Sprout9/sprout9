export default function clsx(init: string, cond: { [key: string]: boolean | undefined }) {
    return `${init} ${Object.entries(cond).map(([key, value]) => value ? key : "").join(" ")}`
}

export function join(init: string, opts: (string | undefined)[]) {
    return `${init} ${opts.filter(opt => opt).join(" ")}`
}