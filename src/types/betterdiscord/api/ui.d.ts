import {ReactElement, ReactNode} from "react";
import {Changelog} from "../manifest"; // TODO: move type here and have manifest import it


export type HexString = `#${string}`;

interface SettingItem<T> {
    type: "dropdown" | "number" | "switch" | "text" | "slider" | "radio" | "keybind" | "color" | "file" | "custom";
    id: string;
    name: string;
    note: string;
    value: T;
    children?: ReactElement[];
    onChange?(value: T): void;
    disabled?: boolean;
    inline?: boolean;
}


export interface ColorItem extends SettingItem<string> {
    type: "color";
    colors?: HexString[] | number[] | null;
    defaultValue?: HexString;
}

export interface DropdownOption<K> {
    label: string;
    value: K;
}
export interface DropdownItem<K> extends SettingItem<K> {
    type: "dropdown";
    options: DropdownOption<K>[];
    style?: "default" | "transparent";
}

export interface FilepickerItem extends SettingItem<string | string[]> {
    type: "file";
    multiple?: boolean;
    clearable?: boolean;
    accept?: string;
}

export interface KeybindItem extends SettingItem<string[]> {
    type: "keybind";
    max?: number;
    clearable?: boolean;
}

export interface NumberInput extends SettingItem<number> {
    type: "number";
    min?: number;
    max?: number;
    step?: number;
}

export interface RadioItem<K> {
    name: string;
    value: K;
    description?: string;
    color?: HexString;
}
export interface RadioInput<K> extends SettingItem<K> {
    type: "radio";
    options: RadioItem<K>[];
}

export interface SliderInput extends SettingItem<number> {
    type: "slider";
    min?: number;
    max?: number;
    step?: number;
    units?: string;
    markers?: number[];
}

export interface SwitchItem extends SettingItem<boolean> {
    type: "switch";
}

export interface TextInput extends SettingItem<string> {
    type: "text";
    placeholder?: string;
    maxLength?: number;
}


export type SettingDefinition = ColorItem | DropdownItem<unknown> | FilepickerItem | KeybindItem | NumberInput | RadioInput<unknown> | SliderInput | SwitchItem | TextInput;

export interface SettingGroup {
    type: "category";
    id: string;
    name: string;
    collapsible?: boolean;
    shown?: boolean;
    settings: SettingDefinition[];
}

export type SettingsPanelDefinition = (SettingDefinition | SettingGroup)[];

export interface PanelOptions {
    onChange(groupId: string, settingId: string, value: unknown): void;
    onDrawerToggle(groupId: string, shown: boolean): void;
    getDrawerState(groupId: string, shownByDefault: boolean): boolean;
    settings: SettingsPanelDefinition;
}

export interface ToastOptions {
    type?: "" | "info" | "success" | "danger" | "error" | "warning" | "warn";
    icon?: boolean;
    timeout?: number;
    forceShow?: boolean;
}

export interface ConfirmationModalOptions {
    danger?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
}

export interface UI {
    alert(title: string, content: ReactNode): void;
    showChangelogModal(options: Partial<Changelog>): void;
    buildSettingsPanel(options: Partial<PanelOptions>): ReactElement;
    showToast(content: string, options?: ToastOptions): void;
    showConfirmationModal(title: string, content: ReactNode, options?: ConfirmationModalOptions): string;
}