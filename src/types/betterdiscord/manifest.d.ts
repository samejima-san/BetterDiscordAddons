import {Meta} from "./meta";
import {SettingsPanelDefinition} from "./api/ui";

export interface Author {
    name: string;
    link?: string;
    id?: string;
    discord_id?: string;
    github_username?: string;
    twitter_username?: string;
}

export interface Info extends Partial<Meta> {
    name: string;
    author?: string;
    authors?: Author[];
    version: string;
    description: string;
    github?: string;
    github_raw?: string;
}


export interface Changes {
    title: string;
    type: "fixed" | "added" | "progress" | "changed";
    items: Array<string>;
    blurb?: string;
}

export interface Changelog {
    title: string;
    subtitle: string;
    banner: string;
    blurb: string;
    video: string;
    poster: string;
    changes: Changes[];
}


export interface Localization {
    [locale: string]: Record<string, string>;
}

export interface Manifest {
    info: Info;
    changelog?: Partial<Changelog> | Changes[];
    config?: SettingsPanelDefinition;
    strings?: Localization;
    main?: string;
}