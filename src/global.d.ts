import {BetterDiscordAPI} from "@betterdiscord/api";
import {DiscordNativeAPI} from "@discord/native";


declare global {
    /** BetterDiscord's global plugin API. */
    const BdApi: BetterDiscordAPI;
    const DiscordNative: DiscordNativeAPI;

    interface Window {
        __SENTRY__: {
            logger?: {disable(): void}
            globalEventProcessors?: unknown[];
        };

        DiscordSentry: {
            getCurrentHub?(): {
                bindClient(): void;
                withScope(): void;
                getClient(): {close?(code: number): void};
                getScope(): {clear?(): void, setFingerprint?(a: unknown): void};
                getIsolationScope(): void;
                captureException(): void;
                captureMessage(): void;
                captureEvent(): void;
                addBreadcrumb(): void;
                setUser(u: unknown): void;
                setTags(t: object): void;
                setTag(): void;
                setExtra(): void;
                setExtras(e: object): void;
                setContext(): void;
                getIntegration(): void;
                startSession(): void;
                endSession(): void;
                captureSession(): void;
            }
        }
    }
}