import {BetterDiscordAPI} from "@betterdiscord/api";
import {DiscordNativeAPI} from "@discord/native";


declare global {
    /** BetterDiscord's global plugin API. */
    const BdApi: BetterDiscordAPI;
    const DiscordNative: DiscordNativeAPI;
}