/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Module {
    id: number;
    loaded: true;
    exports: any;
}

export type FilterFunction = (exports: any, module?: Module, id?: string) => boolean;

export interface Webpack {
    getModule<T>(filter: FilterFunction): T | undefined;
    getByKeys<T>(...keys: string[]): T | undefined;
}