export type ClassModule = Record<string, string>;


export interface Dispatcher {
    register<T>(callback: (payload: T) => void): string;
    unregister(id: string): void;
    waitFor(IDs: string[]): void;
    dispatch<T>(payload: T): void;
    isDispatching(): boolean;
}

export type StoreChangeListener = () => void;

export interface FluxStore {
    addChangeListener(fn: StoreChangeListener): void;
    removeChangeListener(fn: StoreChangeListener): void;

    emitChange(): void;
    getDispatchToken(): string;
    getName(): string;
    initialize(): void;
    _dispatchToken: string;
    _isInitialized: boolean;
}