import {Component, ComponentClass} from "react";
import {Fiber} from "react-reconciler";

export interface ReactUtils {
    getInternalInstance(node: HTMLElement): Fiber | undefined;
    getOwnerInstance<P = object>(node: HTMLElement, options?: GetOwnerInstanceOptions): Component<P> | null;
    wrapElement(element: HTMLElement): ComponentClass;
}

export interface GetOwnerInstanceOptions {
    include?: string[];
    exclude?: string[];
    filter?: (node: Component) => boolean;
}