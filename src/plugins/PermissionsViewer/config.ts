import {Manifest} from "@betterdiscord/manifest";

const manifest: Manifest = {
    info: {
        name: "PermissionsViewer",
        authors: [{
            name: "Zerebos",
            discord_id: "249746236008169473",
            github_username: "zerebos",
            twitter_username: "IAmZerebos"
        }],
        version: "0.3.0",
        description: "Allows you to view a user's permissions. Thanks to Noodlebox for the idea!",
        github: "https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/PermissionsViewer",
        github_raw: "https://raw.githubusercontent.com/zerebos/BetterDiscordAddons/master/Plugins/PermissionsViewer/PermissionsViewer.plugin.js"
    },
    changelog: [
        {
            title: "What's New?",
            type: "added",
            items: [
                "Plugin no longer depends on ZeresPluginLibrary!",
                "Popout permissions updated to match Discord's new style."
            ]
        },
        {
            title: "Fixes",
            type: "fixed",
            items: [
                "The main startup error has finally been fixed!",
                "Fixed an issue where localization wouldn't process correctly.",
                "Permissions should now show properly on the new user popouts.",
                "Modals should now close when pressing Escape."
            ]
        }
    ],
    config: [
        {
            type: "switch",
            id: "contextMenus",
            name: "Context Menus",
            value: true
        },
        {
            type: "switch",
            id: "popouts",
            name: "Popouts",
            value: true
        },
        {
            type: "radio",
            id: "displayMode",
            name: "Modal Display Mode",
            value: "compact",
            options: [
                {name: "Cozy", value: "cozy"},
                {name: "Compact", value: "compact"}
            ]
        }
    ],
    strings: {
        es: {
            contextMenuLabel: "Permisos",
            popoutLabel: "Permisos",
            modal: {
                header: "Permisos de {{name}}",
                rolesLabel: "Roles",
                permissionsLabel: "Permisos",
                owner: "@propietario"
            },
            settings: {
                popouts: {
                    name: "Mostrar en Popouts",
                    note: "Mostrar los permisos de usuario en popouts como los roles."
                },
                contextMenus: {
                    name: "Botón de menú contextual",
                    note: "Añadir un botón para ver permisos en los menús contextuales."
                }
            }
        },
        pt: {
            contextMenuLabel: "Permissões",
            popoutLabel: "Permissões",
            modal: {
                header: "Permissões de {{name}}",
                rolesLabel: "Cargos",
                permissionsLabel: "Permissões",
                owner: "@dono"
            },
            settings: {
                popouts: {
                    name: "Mostrar em Popouts",
                    note: "Mostrar as permissões em popouts como os cargos."
                },
                contextMenus: {
                    name: "Botão do menu de contexto",
                    note: "Adicionar um botão parar ver permissões ao menu de contexto."
                }
            }
        },
        de: {
            contextMenuLabel: "Berechtigungen",
            popoutLabel: "Berechtigungen",
            modal: {
                header: "{{name}}s Berechtigungen",
                rolesLabel: "Rollen",
                permissionsLabel: "Berechtigungen",
                owner: "@eigentümer"
            },
            settings: {
                popouts: {
                    name: "In Popouts anzeigen",
                    note: "Zeigt die Gesamtberechtigungen eines Benutzers in seinem Popup ähnlich den Rollen an."
                },
                contextMenus: {
                    name: "Kontextmenü-Schaltfläche",
                    note: "Fügt eine Schaltfläche hinzu, um die Berechtigungen mithilfe von Kontextmenüs anzuzeigen."
                }
            }
        },
        en: {
            contextMenuLabel: "Permissions",
            popoutLabel: "Permissions",
            modal: {
                header: "{{name}}'s Permissions",
                rolesLabel: "Roles",
                permissionsLabel: "Permissions",
                owner: "@owner"
            },
            settings: {
                popouts: {
                    name: "Show In Popouts",
                    note: "Shows a user's total permissions in their popout similar to roles."
                },
                contextMenus: {
                    name: "Context Menu Button",
                    note: "Adds a button to view the permissions modal to select context menus."
                },
                displayMode: {
                    name: "Modal Display Mode"
                }
            }
        },
        ru: {
            contextMenuLabel: "Полномочия",
            popoutLabel: "Полномочия",
            modal: {
                header: "Полномочия {{name}}",
                rolesLabel: "Роли",
                permissionsLabel: "Полномочия",
                owner: "Владелец"
            },
            settings: {
                popouts: {
                    name: "Показать во всплывающих окнах", 
                    note: "Отображает полномочия пользователя в их всплывающем окне, аналогичном ролям."
                },
                contextMenus: {
                    name: "Кнопка контекстного меню",
                    note: "Добавить кнопку для отображения полномочий с помощью контекстных меню."
                }
            }
        }
    },
    main: "index.ts"
};

export default manifest;