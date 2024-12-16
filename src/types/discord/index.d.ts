export interface User {
    avatar: string;
    avatarDecorationData: null | {
        asset: string;
        skuId: string;
    };
    banner: string | null;
    bot: boolean;
    clan: string | null;
    desktop: boolean;
    discriminator: string;
    displayName: string;
    email: string | null;
    flags: number;
    globalName: string;
    guildMemberAvatars: object;
    hasAnyStaffLevel(): boolean;
    hasBouncedEmail: boolean;
    hasFlag(f: number): boolean;
    id: string;
    isStaff(): boolean;
    isStaffPersonal(): boolean;
    mfaEnabled: boolean;
    mobile: boolean;
    nsfwAllowed: boolean | undefined;
    personalConnectionId: null | string;
    phone: string | null;
    premiumType: number | undefined;
    premiumUsageFlags: number;
    primaryGuild: string | null;
    publicFlags: number;
    purchasedFlags: number;
    system: boolean;
    username: string;
    verified: boolean;

    readonly avatarDecoration: null | {
        asset: string;
        skuId: string;
    };
    readonly createdAt: Date;
    readonly isProvisional: boolean;
    readonly tag: string;
}

export interface DMUser {
    avatar: string;
    avatar_decoration_data: {
        asset: string;
        expires_at: string | null;
        sku_id: string;
    };
    bot: boolean;
    clan: string | null;
    discriminator: string;
    display_name: string;
    global_name: string;
    id: string;
    primary_guild: string | null;
    public_flags: number;
    username: string;
}

export interface PermissionOverwrite {
    allow: bigint;
    deny: bigint;
    id: string;
    type: number;
}

export interface Channel {
    application_id: string | undefined;
    flags_: number;
    guild_id: string | null;
    icon: string | undefined;
    id: string;
    isMessageRequest: boolean;
    isMessageRequestTimestamp: boolean | null;
    isSpam: boolean;
    lastMessageId: string;
    lastPinTimestamp: string;
    name: string;
    nicks: {
        [key: string]: string;
    }
    ownerId: string;
    rawRecipients: User[];
    recipientFlags: number;
    recipients: string[];
    safetyWarnings: string[];
    type: number;

    readonly accessPermissions: bigint;
    readonly bitrate: number;
    readonly flags: number;
    readonly isHDStreamSplashed: boolean;
    readonly nsfw: boolean;
    readonly permissionOverwrites: {
        [id: string]: PermissionOverwrite;
    };
    readonly position: number;
    readonly rateLimitPerUser: number;
    readonly topic: string;
    readonly userLimit: number;
}

export interface DMChannel extends Channel {
    type: 1;
}

export interface GuildChannel extends Channel {
    defaultAutoArchiveDuration: number | undefined;
    defaultThreadRateLimitPerUser: number | undefined;
    hdStreamingBuyerId: string | undefined;
    hdStreamingUntil: Date | undefined;
    iconEmoji: undefined;
    linkedLobby: undefined;
    memberListId: undefined;
    parent_id: string;
    permissionOverwrites_: {
        [id: string]: PermissionOverwrite;
    };
    position_: number;
    rateLimitPerUser_: number;
    themeColor: string | undefined;
    topic_: string;
    type: 0;
    version: number;
}


export interface Message {
    activity: null;
    activityInstance: null;
    application: null;
    applicationId: null;
    attachments: [];
    author: User;
    blocked: boolean;
    bot: boolean;
    call: null;
    changelogId: null;
    channel_id: string;
    codedLinks: [];
    colorString: undefined;
    components: [];
    content: string;
    customRenderedContent: undefined;
    editedTimestamp: null;
    embeds: [];
    flags: 0;
    giftCodes: [];
    giftInfo: undefined;
    giftingPrompt: null;
    id: string;
    ignored: boolean;
    interaction: null;
    interactionData: null;
    interactionError: null;
    interactionMetadata: null;
    isSearchHit: boolean;
    isUnsupported: boolean;
    loggingName: null;
    mentionChannels: [];
    mentionEveryone: boolean;
    mentionRoles: [];
    mentioned: boolean;
    mentions: [];
    messageReference: null;
    messageSnapshots: [];
    nick: undefined;
    nonce: string;
    pinned: boolean;
    poll: undefined;
    purchaseNotification: undefined;
    reactions: [];
    referralTrialOfferId: null;
    roleSubscriptionData: undefined;
    soundboardSounds: undefined;
    state: "SENT";
    stickerItems: [];
    stickers: [];
    timestamp: Date;
    tts: boolean;
    type: 0;
    webhookId: null;
}