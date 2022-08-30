
module.exports = (Plugin, Api) => {
    const {DiscordSelectors, WebpackModules, DiscordModules, Patcher, ColorConverter, ReactComponents, Utilities, Logger} = Api;

    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const UserStore = DiscordModules.UserStore;
    const RelationshipStore = DiscordModules.RelationshipStore;
    const VoiceUser = WebpackModules.getByDisplayName("VoiceUser");

    const makeColoredDiscordTag = (makeParent) => function(props) {
        const returnValue = makeParent(props);
        const username = returnValue.props.children[0];
        const discriminator = returnValue.props.children[1];
        if (username) username.props.className = "username " + username.props.className;
        if (discriminator) discriminator.props.className = "discriminator " + (discriminator.props.className || "");
        const refFunc = (colorString) => (element) => {
            if (!element) return;
            element.style.setProperty("color", colorString, "important");
        };

        const userColor = props.colorUsername;
        const discrimColor = props.colorDiscriminator;

        if (username && userColor !== undefined) {
            username.props.style = {color: userColor};
            if (props.important && userColor) username.ref = refFunc(userColor);
        }
        if (discriminator && discrimColor !== undefined) {
            discriminator.props.style = {color: discrimColor};
            if (props.important && discrimColor) username.ref = refFunc(discrimColor);
        }
        return returnValue;
    };

    const makeFluxTag = WebpackModules.getByDisplayName("DiscordTag");
    const ColoredFluxTag = function(props) {
        const returnValue = makeFluxTag(props);
        if (!returnValue.type || typeof(returnValue.type) !== "function") return returnValue;
        returnValue.type = makeColoredDiscordTag(returnValue.type);
        return returnValue;
    };

    return class BetterRoleColors extends Plugin {

        onStart() {
            Utilities.suppressErrors(this.patchAccountDetails.bind(this), "account details patch")();
            Utilities.suppressErrors(this.patchVoiceUsers.bind(this), "voice users patch")();
            Utilities.suppressErrors(this.patchMentions.bind(this), "mentions patch")();
            Utilities.suppressErrors(this.patchEditorMentions.bind(this), "editor mentions patch")();
            Utilities.suppressErrors(this.patchUserPopouts.bind(this), "user popout patch")();
            Utilities.suppressErrors(this.patchMessageContent.bind(this), "user popout patch")();

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            Utilities.suppressErrors(this.patchAuditLog.bind(this), "audit log patch")(this.promises.state);
            Utilities.suppressErrors(this.patchTypingUsers.bind(this), "typing users patch")(this.promises.state);
            Utilities.suppressErrors(this.patchUserModals.bind(this), "user modal patch")(this.promises.state);
            Utilities.suppressErrors(this.patchMemberList.bind(this), "member list patch")(this.promises.state);
            Utilities.suppressErrors(this.patchThreadMemberList.bind(this), "thread member list patch")(this.promises.state);
        }

        onStop() {
            Patcher.unpatchAll();
            this.promises.cancel();
            if (this.unpatchAccountDetails) {
                this.unpatchAccountDetails();
                delete this.unpatchAccountDetails;
            }
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }

        getMember(userId, guild = "") {
            const guildId = guild || SelectedGuildStore.getGuildId();
            if (!guildId) return null;
            const member = GuildMemberStore.getMember(guildId, userId);
            if (!guildId) return null;
            return member;
        }

        patchAccountDetails() {
            const rawClasses = WebpackModules.getByProps("container", "avatar", "hasBuildOverride");

            const containerSelector = DiscordSelectors.AccountDetails.container || `.${rawClasses.container.split(" ").join(".")}`;
            const usernameSelector = `${containerSelector} .${rawClasses.usernameContainer.split(" ").join(".")} > div`;
            const discrimSelector = `${containerSelector} .${rawClasses.usernameContainer.split(" ").join(".")} + div`;

            const colorizeAccountDetails = (reset = false) => {
                let username = document.querySelector(usernameSelector);
                if (!username) username = document.querySelector(usernameSelector.replace(" > div", ""));
                const discrim = document.querySelector(discrimSelector);
                if (!username || !discrim) return Logger.info("Could not get account details username and discrim elements");
                let member = this.getMember(UserStore.getCurrentUser().id, SelectedGuildStore.getGuildId());
                if (!member || !member.colorString) member = {colorString: ""};
                const doImportant = this.settings.global.important ? "important" : undefined;

                username.style.setProperty("color", this.settings.account.username && !reset ? member.colorString : "", doImportant);
                discrim.style.setProperty("color", this.settings.account.discriminator && !reset ? member.colorString : "", doImportant);
            };

            this.onSwitch = colorizeAccountDetails;
            colorizeAccountDetails();
            this.unpatchAccountDetails = () => {
                delete this.onSwitch;
                colorizeAccountDetails(true);
            };
        }

        patchVoiceUsers() {
            Patcher.after(VoiceUser.prototype, "renderName", (thisObject, _, returnValue) => {
                if (!this.settings.modules.voice) return;
                if (!returnValue || !returnValue.props) return;
                const member = this.getMember(thisObject.props.user.id);
                if (!member || !member.colorString) return;
                returnValue.props.style = {color: member.colorString, backfaceVisibility: "hidden"};
                if (!this.settings.global.important) return;
                returnValue.ref = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member.colorString, "important");
                };
            });
        }

        patchMentions() {
            const UserMention = WebpackModules.getModule(m => m?.default?.toString().includes("inlinePreview") && m?.default?.toString().includes("getName"));
            Patcher.after(UserMention, "default", (_, args, ret) => {
                const props = args[0];
                const old = Utilities.getNestedProp(ret, "props.children");
                if (typeof old !== "function" || !this.settings.modules.mentions) return;
                ret.props.children = childProps => {
                    try {
                        const ret2 = old(childProps);
                        const userId = props.userId;
                        const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), userId);
                        if (!member || !member.colorString) return ret2;
                        ret2.props.color = ColorConverter.hex2int(member.colorString);
                        return ret2;
                    }
                    catch (err) {
                        try {
                            return old(childProps);
                        }
                        catch (error) {
                            Logger.stacktrace("Error in UserMention patch", error);
                            return null;
                            /*  null will make it simply draw nothing, at that point it's obvious
                                that something went horribly wrong somewhere deeper
                            */
                        }
                    }
                };
            });
        }

        patchEditorMentions() {
            const UserMention = WebpackModules.getByProps("UserMention");
            Patcher.after(UserMention, "UserMention", (_, args, ret) => {
                const props = args[0];
                const old = Utilities.getNestedProp(ret, "props.children");
                if (typeof old !== "function" || !this.settings.modules.mentions) return;
                ret.props.children = childProps => {
                    try {
                        const ret2 = old(childProps);
                        const userId = props.id;
                        const member = GuildMemberStore.getMember(props.guildId, userId);
                        if (!member || !member.colorString) return ret2;
                        // props.children.props
                        ret2.props.children.props.color = ColorConverter.hex2int(member.colorString);
                        return ret2;
                    }
                    catch (err) {
                        try {
                            return old(childProps);
                        }
                        catch (error) {
                            Logger.stacktrace("Error in Editor UserMention patch", error);
                            return null;
                            /*  null will make it simply draw nothing, at that point it's obvious
                                that something went horribly wrong somewhere deeper
                            */
                        }
                    }
                };
            });
        }

        patchMessageContent() {
            const MessageContent = WebpackModules.getModule(m => m.type && m.type.displayName === "MessageContent");
            Patcher.after(MessageContent, "type", (_, [props], returnValue) => {
                if (!this.settings.modules.chat) return;
                const channel = DiscordModules.ChannelStore.getChannel(props.message.channel_id);
                if (!channel || !channel.guild_id) return;
                const member = this.getMember(props.message.author.id, channel.guild_id);
                returnValue.props.style = {color: member?.colorString || ""};
            });
        }

        async patchAuditLog(promiseState) {
            const UserHook = await ReactComponents.getComponentByName("UserHook", DiscordSelectors.AuditLog.userHook);
            if (promiseState.cancelled) return;
            Patcher.after(UserHook.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.auditLog.username && !this.settings.auditLog.discriminator) return;
                const auditLogProps = Utilities.findInTree(thisObject._reactInternals, m => m && m.guildId, {walkable: ["return", "stateNode", "props"]});
                const member = this.getMember(thisObject.props.user.id, auditLogProps.guildId);
                if (!member || !member.colorString) return;
                const username = returnValue.props.children[0];
                const discriminator = returnValue.props.children[1];
                const refFunc = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member.colorString, "important");
                };

                if (username && this.settings.auditLog.username) {
                    username.props.style = {color: member.colorString};
                    if (this.settings.global.important) username.ref = refFunc;
                }
                if (discriminator && this.settings.auditLog.discriminator) {
                    discriminator.props.style = {color: member.colorString};
                    if (this.settings.global.important) discriminator.ref = refFunc;
                }
            });
            UserHook.forceUpdateAll();
        }

        filterTypingUsers(typingUsers) {
            if (!typingUsers) return [];
            return Object.keys(typingUsers).filter((e) => {
                return e != UserStore.getCurrentUser().id;
            }).filter((e) => {
                return !RelationshipStore.isBlocked(e);
            }).map((e) => {
                return UserStore.getUser(e);
            }).filter(function(e) {
                return e != null;
            });
        }

        async patchTypingUsers(promiseState) {
            const TypingUsers = await ReactComponents.getComponentByName("TypingUsers", DiscordSelectors.Typing.typing);
            if (promiseState.cancelled) return;
            Patcher.after(TypingUsers.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modules.typing) return;

                const typingUsers = this.filterTypingUsers(Object.assign({}, thisObject.props.typingUsers));
                for (let m = 0; m < typingUsers.length; m++) {
                    const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), typingUsers[m].id);
                    if (!member) continue;

                    const username = Utilities.getNestedProp(returnValue, `props.children.0.props.children.1.props.children.${m * 2}`);
                    if (!username || !username.props) return;
                    username.props.style = {color: member.colorString};
                    if (!this.settings.global.important) continue;
                    username.ref = (element) => {
                        if (!element) return;
                        element.style.setProperty("color", member.colorString, "important");
                    };
                }
            });
            TypingUsers.forceUpdateAll();
        }

        patchUserPopouts() {
            const UsernameSection = WebpackModules.getModule(m => m?.default?.displayName === "UsernameSection");
            Patcher.after(UsernameSection, "default", (_, args, returnValue) => {
                const containerProps = args[0];
                const member = this.getMember(containerProps.user.id);
                if (!member || !member.colorString) return;

                const tag = Utilities.findInTree(returnValue, m => m && m.type && m.type.displayName === "DiscordTag", {walkable: ["props", "children"]});
                if (!tag) return returnValue;
                const nickname = Utilities.findInTree(returnValue, m => m && m.type && m.type.displayName === "Heading", {walkable: ["props", "children"]});
                const shouldColorUsername = this.settings.popouts.username || (!nickname && this.settings.popouts.fallback);
                const shouldColorDiscriminator = this.settings.popouts.discriminator;
                const shouldColorNickname = this.settings.popouts.nickname && nickname;
                if (shouldColorNickname) nickname.props.style = {color: member.colorString};
                if ((!shouldColorUsername && !shouldColorDiscriminator) || !tag) return returnValue;
                if (shouldColorUsername) tag.props.colorUsername = member.colorString;
                if (shouldColorDiscriminator) tag.props.colorDiscriminator = member.colorString;
                if (this.settings.global.important) tag.props.important = true;
                tag.type = ColoredFluxTag;
                return returnValue;
            });
        }

        async patchUserModals(promiseState) {
            await ReactComponents.getComponentByName("UserProfileModalHeader", ".topSection-13QKHs > header");
            if (promiseState.cancelled) return;
            const ModalHeader = WebpackModules.getModule(m => m.default && m.default.displayName == "UserProfileModalHeader");
            Patcher.after(ModalHeader, "default", (_, [props], returnValue) => {
                if (!this.settings.modals.username && !this.settings.modals.discriminator) return;
                const member = this.getMember(props.user.id);
                if (!member || !member.colorString) return;
                const tag = Utilities.findInTree(returnValue, m => m && m.type && m.type.displayName === "DiscordTag", {walkable: ["props", "children"]});
                if (!tag) return;
                if (this.settings.modals.username) tag.props.colorUsername = member.colorString;
                if (this.settings.modals.discriminator) tag.props.colorDiscriminator = member.colorString;
                if (this.settings.global.important) tag.props.important = true;
                tag.type = ColoredFluxTag;
            });
        }

        async patchMemberList(promiseState) {
            const BRC = this;
            const MemberList = await ReactComponents.getComponentByName("ChannelMembers", DiscordSelectors.MemberList.membersWrap);
            if (promiseState.cancelled) return;
            Patcher.after(MemberList.component.prototype, "render", (memberList) => {
                if (!this.settings.modules.memberList) return;
                if (memberList.renderSection.__patched) return;
                const original = memberList.renderSection;
                memberList.renderSection = function() {
                    const section = Reflect.apply(original, this, arguments);
                    const guild = DiscordModules.GuildStore.getGuild(memberList.props.channel.guild_id);
                    if (!guild) return section;
                    const children = section.props.children ? section.props.children : section;
                    const roleId = children.props.id;
                    const roleColor = guild.roles[roleId] ? guild.roles[roleId].colorString : "";
                    if (!roleColor) return section;
                    const originalType = children.type.type;
                    const myRef = DiscordModules.React.createRef();
                    const ColoredRoleHeader = function() {
                        const label = originalType(...arguments);
                        const originalLabel = label.type;
                        const ColoredHeader = function() {
                            const final = originalLabel(...arguments);
                            final.props.style = {color: roleColor};
                            if (!BRC.settings.global.important) return final;
                            final.ref = (element) => {
                                if (!element) return;
                                element.style.setProperty("color", roleColor, "important");
                            };
                            return final;
                        };
                        label.type = ColoredHeader;
                        return label;
                    };
                    children.ref = myRef;
                    children.type = ColoredRoleHeader;
                    return section;
                };
                memberList.renderSection.__patched = true;
                memberList.forceUpdate();
            });
        }

        patchThreadMemberList() {
            const ThreadMembers = WebpackModules.getModule(m => m?.default?.displayName === "ThreadMembers");
            Patcher.after(ThreadMembers, "default", (thisObj, args, ret) => {
                if (!this.settings.modules.memberList) return;
                const children = ret.props.children.props.children;
                if (children.__patched) return ret;
                ret.props.children.props.children = function() {
                    const retVal = Reflect.apply(children, this, arguments);
                    const renderSection = retVal.props.children.props.renderSection;
                    if (renderSection.__patched) return retVal;
                    retVal.props.children.props.renderSection = function() {
                        const returnValue = Reflect.apply(renderSection, this, arguments);

                        const originalType = returnValue.type.type;
                        if (originalType.__patched) return returnValue;
                        returnValue.type.type = function(props) {
                            const typeReturn = Reflect.apply(originalType, this, arguments);
                            const guild = DiscordModules.GuildStore.getGuild(props.guildId);
                            if (!guild) return typeReturn;
                            const roleId = props.id;
                            const roleColor = guild.roles[roleId] ? guild.roles[roleId].colorString : "";
                            typeReturn.props.children[1].props.style = {color: roleColor};
                            return typeReturn;
                        };
                        returnValue.type.type.__patched = true;
                        return returnValue; 
                    };
                    retVal.props.children.props.renderSection.__patched = true;
                    return retVal;
                };
                ret.props.children.props.children.__patched = true;
            });
        }

    };
};