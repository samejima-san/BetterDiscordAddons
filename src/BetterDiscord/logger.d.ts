export interface Logger {
    info(module: string, ...message: string[]): void;
    warn(module: string, ...message: string[]): void;
    debug(module: string, ...message: string[]): void;
    error(module: string, ...message: string[]): void;
    log(module: string, ...message: string[]): void;
    stacktrace(module: string, message: string, err: Error): void;
}