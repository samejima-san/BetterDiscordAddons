export interface Utils {
    extend(extendee: unknown, ...extenders: unknown[]): unknown;
    escapeHTML(html: string): string;
}