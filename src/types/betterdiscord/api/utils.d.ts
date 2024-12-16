export interface FindInTreeOptions {
    walkable?: string[] | null;
    ignore?: string[];
}

export interface Utils {
    extend(extendee: unknown, ...extenders: unknown[]): unknown;
    escapeHTML(html: string): string;
    findInTree<T = unknown>(tree: unknown, searchFilter: (node: unknown) => boolean, options?: FindInTreeOptions): T;
}