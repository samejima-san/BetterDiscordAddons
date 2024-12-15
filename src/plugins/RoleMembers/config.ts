import {Manifest} from "@betterdiscord/manifest";

const manifest: Manifest = {
    info: {
        name: "RoleMembers",
        authors: [{
            name: "Zerebos",
            discord_id: "249746236008169473",
            github_username: "zerebos",
            twitter_username: "IAmZerebos"
        }],
        version: "0.1.24",
        description: "Allows you to see the members of each role on a server.",
        github: "https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/RoleMembers",
        github_raw: "https://raw.githubusercontent.com/zerebos/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"
    },
    changelog: [
        {title: "Hot Fix", type: "fixed", items: ["The settings panel will now reflect your actual settings!"]},
    ],
    config: [
        {
            type: "switch",
            id: "showCounts",
            name: "Show Member Counts",
            note: "Enabling this shows the members counts of each role in the context menu",
            value: false
        }
    ],
    main: "index.ts"
};

export default manifest;