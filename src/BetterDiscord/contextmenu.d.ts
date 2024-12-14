/* eslint-disable @typescript-eslint/no-explicit-any */
import {ReactElement} from "react";


export type ContextMenuCallback = (tree: ReactElement, props: any) => ReactElement | void;

export interface ContextMenuItemProps extends Record<string, any> {
    type?: "text" | "submenu" | "toggle" | "radio" | "control" | "custom" | "separator";
}

export interface ContextMenu {
    patch(navId: string, callback: ContextMenuCallback): () => void;
    buildItem(props: ContextMenuItemProps): ReactElement;
}