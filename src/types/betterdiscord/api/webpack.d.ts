/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Module {
    id: number;
    loaded: true;
    exports: any;
}

export type FilterFunction = (exports: any, module?: Module, id?: string) => boolean;

export interface FilterOptions {
    defaultExport?: boolean;
    searchExports?: boolean;
}

export interface Webpack {
    Filters: Filters;
    getModule<T>(filter: FilterFunction, options?: FilterOptions): T | undefined;
    getByKeys<T>(...keys: string[]): T | undefined;
    getByPrototypeKeys<T>(...keys: string[] | [...string[], FilterOptions]): T | undefined;
    getStore<T>(name: string): T | undefined;
}

export interface Filters {
    byKeys(...keys: string[]): FilterFunction;
    byPrototypeKeys(...prototypes: string[]): FilterFunction;
    byStrings(...strings: string[]): FilterFunction;
    byStoreName(name: string): FilterFunction;
    combine(...filters: FilterFunction[]): FilterFunction;
}