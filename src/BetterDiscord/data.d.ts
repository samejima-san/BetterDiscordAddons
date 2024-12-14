export interface Data {
    save<T>(name: string, key: string, data: T): void;
    load<T>(name: string, key: string): T;
}