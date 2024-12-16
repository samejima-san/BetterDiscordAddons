import {FunctionComponent, MemoExoticComponent} from "react";

import Plugin from "@common/plugin";

import {Meta} from "@betterdiscord/meta";

import {Memo} from "@discord/modules";

import Config from "./config";


const {Patcher, Webpack, Logger, Utils} = BdApi;

const EmojiInfo = Webpack.getByKeys<{isEmojiFiltered(e: object): boolean; isEmojiDisabled(e: object): boolean;}>("isEmojiDisabled", "isEmojiFiltered");

export default class HideDisabledEmojis extends Plugin {
    constructor(meta: Meta) {super(meta, Config);}

    async onStart() {   
        if (!EmojiInfo) return Logger.error(this.meta.name, "Important modules needed not found");

        Patcher.after(this.meta.name, EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments: [object], returnValue) => {
            return returnValue || EmojiInfo.isEmojiDisabled(methodArguments[0]);
        });

        const [memoModule, key] = BdApi.Webpack.getWithKey(BdApi.Webpack.Filters.byStrings("topEmojis", "getDisambiguatedEmojiContext"));

        if (key && memoModule) {
            Patcher.before(this.meta.name, memoModule, key, (_, args) => {
                // arg 0 = picker intention
                // arg 1 = channel object
                // arg 2 = guild id
                // Create a fake channel object with a null guild id
                // This fake object forces the categories to check isEmojiFiltered
                if (args[1] == null) {
                    args[1] = {
                        getGuildId: () => null
                    };
                }
            });
        }

        interface Emoji {
            isDisabled: boolean;
            type: number;
        }

        interface RowProps {
            rowCountBySection: number[];
            sectionDescriptors: {count: number, sectionId: string}[];
            collapsedSections: Set<string>;
            emojiGrid: Emoji[][] & {filtered?: boolean};
        }

        const doFiltering = (props: RowProps) => {
            props.rowCountBySection = props.rowCountBySection.filter((c, i) => c || props.collapsedSections.has(props.sectionDescriptors[i].sectionId));
            props.sectionDescriptors = props.sectionDescriptors.filter(s => s.count || props.collapsedSections.has(s.sectionId));
            
            const wasFiltered = props.emojiGrid.filtered;
            props.emojiGrid = props.emojiGrid.filter(r => r.length);
            if (wasFiltered) props.emojiGrid.filtered = true; // Reassign
        };

        const PickerWrapMemo = Webpack.getModule<Memo>(m => m?.type?.render?.toString?.()?.includes("EMOJI_PICKER_POPOUT"));
        if (!PickerWrapMemo) return;

        Patcher.after(this.meta.name, PickerWrapMemo.type, "render", (_, [inputProps]: [{pickerIntention: number}], ret) => {
            const pickerChild = Utils.findInTree<MemoExoticComponent<MemoExoticComponent<FunctionComponent & {__patched?: boolean}>>>(ret, (m: {props: RowProps}) => !!m?.props?.emojiGrid, {walkable: ["props", "children"]});
            if (!pickerChild?.type?.type) return;
            ret.props.children.props.page = "DM Channel";
            if (pickerChild.type.type.__patched) return;

            Patcher.before(this.meta.name, pickerChild.type, "type", (__, [props]: [RowProps]) => {
                if (!props.rowCountBySection) return;
                if (props.emojiGrid.filtered) return doFiltering(props);
                props.emojiGrid.filtered = true;
                let row = 0;
                for (let s = 0; s < props.sectionDescriptors.length; s++) {
                    const section = props.sectionDescriptors[s];
                    const rowCount = props.rowCountBySection[s];
                    const rowEnd = row + rowCount - 1;
                    let countLeft = 0;
                    let rowsLeft = 0;
                    for (let r = row; r <= rowEnd; r++) {
                        // If it's not disabled or if it's the upload button in status picker
                        props.emojiGrid[r] = props.emojiGrid[r].filter(e => !e.isDisabled && (e.type !== 1 || inputProps?.pickerIntention !== 1));
                        const remaining = props.emojiGrid[r].length;
                        if (remaining) {
                            rowsLeft = rowsLeft + 1;
                            countLeft = countLeft + remaining;
                        }
                    }
                    section.count = countLeft;
                    props.rowCountBySection[s] = rowsLeft;

                    row = rowEnd + 1;
                }

                doFiltering(props);
            });
            pickerChild.type.type.__patched = true;
        });
    }
    
    onStop() {
        Patcher.unpatchAll(this.meta.name);
    }

};