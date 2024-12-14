import {BetterDiscordAPI} from "./BetterDiscord";

declare module "*.html" {
    const value: string;
    export default value;
}

declare module "*.css" {
    const value: string;
    export default value;
}

declare global {
    /** BetterDiscord's global plugin API. */
    const BdApi: BetterDiscordAPI;
}