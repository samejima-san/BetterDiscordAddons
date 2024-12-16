export interface Logger {
    info(module: string, ...message: unknown[]): void;
    warn(module: string, ...message: unknown[]): void;
    debug(module: string, ...message: unknown[]): void;
    error(module: string, ...message: unknown[]): void;
    log(module: string, ...message: unknown[]): void;
    stacktrace(module: string, message: string, err: Error): void;
}