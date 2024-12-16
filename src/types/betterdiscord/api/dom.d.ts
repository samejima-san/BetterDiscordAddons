import {Cancel} from "./common";

export interface AnimateOptions {
    timing?: (fraction: number) => number;
}

export interface CreateElementOptions {
    id?: string;
    className?: string;
    target?: HTMLElement;
}

export interface DOM {
    animate(update: (progress: number) => void, duration: number, options?: AnimateOptions): void;
    parseHTML<T extends boolean = false>(html: string, fragment?: T): T extends true ? DocumentFragment : NodeList | HTMLElement;
    addStyle(id: string, css: string): void;
    removeStyle(id: string): void;
    createElement(tag: string, options?: CreateElementOptions, child?: HTMLElement): HTMLElement;
    onRemoved(node: HTMLElement, callback: () => void): Cancel;
}