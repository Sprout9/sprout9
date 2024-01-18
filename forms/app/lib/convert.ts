import capitalize from "./capitalize";
import { Response } from "./types";
import { getSanitizingConverter } from "pagedown"

export function responseToCsv(response: Response, sep = ",", quote = `"`): string {
    return [
        Object.keys(response.responses.at(0) || {})
            .map(key => `${quote}${capitalize(key)}${quote}`)
            .join(sep),
        ...response.responses.map(
            resp => Object.values(resp)
                .map(val => `${quote}${val}${quote}`)
                .join(sep)),
    ].join("\n")
}


export function responseToText(response: Response): string {
    return `New Form Response For Form '${response.title}'
    ${responseToCsv(response, " ", "")}`
}

export function responseToHtml(response: Response): string {
    return `
    <div>
        <h2>${response.title}</h2>
        <table>
            <thead>
                <tr>${Object.keys(response.responses.at(0) || {}).map(key => `
                    <th> ${capitalize(key)} </th>`).join("")}
                </tr>
            </thead>
            <tbody>${response.responses.map(resp => `
                <tr>${Object.values(resp).map(value => `
                    <td> ${value} </td>`).join("")}
                </tr>`).join("")}
            </tbody>
        </table>
    </div>`
}

const MarkdownConverter = getSanitizingConverter()
export default MarkdownConverter