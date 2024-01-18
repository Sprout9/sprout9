declare module 'pagedown' {
    export default class Converter {
        constructor()
        makeHtml(text: string): string;
    }
    export function getSanitizingConverter(): Converter;
}