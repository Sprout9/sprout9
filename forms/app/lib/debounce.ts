

export default function debounce(fn: (...args: any) => void, timeout: number = 300) {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timer)
        timer = setTimeout(() => { fn(...args) }, timeout)
    }
}
