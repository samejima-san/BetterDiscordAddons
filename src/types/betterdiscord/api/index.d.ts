import React from "react";
import {ContextMenu} from "./contextmenu";
import {Data} from "./data";
import {DOM} from "./dom";
import {Logger} from "./logger";
import {Patcher} from "./patcher";
import {UI} from "./ui";
import {Utils} from "./utils";
import {Webpack} from "./webpack";

export interface BetterDiscordAPI {
    version: string;

    Logger: Logger;
    Data: Data;
    Webpack: Webpack;
    Utils: Utils;
    UI: UI;
    Patcher: Patcher;
    ContextMenu: ContextMenu;
    DOM: DOM;

    React: typeof React;
}

