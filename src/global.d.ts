import {BetterDiscordAPI} from "./BetterDiscord";

declare module "*.html" {
    const value: string;
    export default value;
}

declare module "*.css" {
    const value: string;
    export default value;
}

export interface DiscordNativeAPI {
    isRenderer: unknown;
    setUncaughtExceptionHandler: unknown;
    nativeModules: unknown;
    process: unknown;
    os: unknown;
    app: unknown;
    clipboard: {
        copy(s: string): void;
        copyImage(b: Buffer): void;
        cut(): void;
        paste(): void;
        read(): void;
    };
    ipc: unknown;
    gpuSettings: unknown;
    window: unknown;
    powerMonitor: unknown;
    spellCheck: unknown;
    crashReporter: unknown;
    desktopCapture: unknown;
    fileManager: unknown;
    clips: unknown;
    processUtils: unknown;
    powerSaveBlocker: unknown;
    http: unknown;
    accessibility: unknown;
    features: unknown;
    settings: unknown;
    userDataCache: unknown;
    thumbar: unknown;
    safeStorage: unknown;
    globalOverlay: unknown;
    hardware: unknown;
    riotGames: unknown;
    remoteApp: unknown;
    remotePowerMonitor: unknown;
    webAuthn: unknown;
}

declare global {
    /** BetterDiscord's global plugin API. */
    const BdApi: BetterDiscordAPI;
    const DiscordNative: DiscordNativeAPI;
}