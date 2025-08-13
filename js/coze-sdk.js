// Coze SDK 配置

// 初始化Coze SDK
const cozeWebSDKForCactus = new CozeWebSDK.WebChatClient({
    config: {
        bot_id: '7527964134026674216',
    },
    componentProps: {
        title: '仙人掌陪伴助手',
    },
    ui: {
        base: {
            icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
            layout: 'pc',
            zIndex: 1000,
        },
        asstBtn: {
            isNeed: false,
        },
    },
    auth: {
        type: 'token',
        token: (window.APP_CONFIG && window.APP_CONFIG.COZE_PAT_TOKEN) || 'REPLACE_WITH_YOUR_COZE_PAT_TOKEN',
        onRefreshToken: function () {
            return (window.APP_CONFIG && window.APP_CONFIG.COZE_PAT_TOKEN) || 'REPLACE_WITH_YOUR_COZE_PAT_TOKEN'
        }
    },
});

const cozeWebSDKForMoss = new CozeWebSDK.WebChatClient({
    config: {
        bot_id: '7528782354861604904',
    },
    componentProps: {
        title: '苔藓陪伴助手',
    },
    ui: {
        base: {
            icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
            layout: 'pc',
            zIndex: 1000,
        },
        asstBtn: {
            isNeed: false,
        },
    },
    auth: {
        type: 'token',
        token: (window.APP_CONFIG && window.APP_CONFIG.COZE_PAT_TOKEN) || 'REPLACE_WITH_YOUR_COZE_PAT_TOKEN',
        onRefreshToken: function () {
            return (window.APP_CONFIG && window.APP_CONFIG.COZE_PAT_TOKEN) || 'REPLACE_WITH_YOUR_COZE_PAT_TOKEN'
        }
    },
});

const cozeWebSDKForRose = new CozeWebSDK.WebChatClient({
    config: {
        bot_id: '7528794618294059042',
    },
    componentProps: {
        title: '玫瑰陪伴助手',
    },
    ui: {
        base: {
            icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
            layout: 'pc',
            zIndex: 1000,
        },
        asstBtn: {
            isNeed: false,
        },
    },
    auth: {
        type: 'token',
        token: (window.APP_CONFIG && window.APP_CONFIG.COZE_PAT_TOKEN) || 'REPLACE_WITH_YOUR_COZE_PAT_TOKEN',
        onRefreshToken: function () {
            return (window.APP_CONFIG && window.APP_CONFIG.COZE_PAT_TOKEN) || 'REPLACE_WITH_YOUR_COZE_PAT_TOKEN'
        }
    },
});

const cozeWebSDKForLuckyBamboo = new CozeWebSDK.WebChatClient({
    config: {
        bot_id: '7528634187600347178',
    },
    componentProps: {
        title: '富贵竹陪伴助手',
    },
    ui: {
        base: {
            icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
            layout: 'pc',
            zIndex: 1000,
        },
        asstBtn: {
            isNeed: false,
        },
    },
    auth: {
        type: 'token',
        token: (window.APP_CONFIG && window.APP_CONFIG.COZE_PAT_TOKEN) || 'REPLACE_WITH_YOUR_COZE_PAT_TOKEN',
        onRefreshToken: function () {
            return (window.APP_CONFIG && window.APP_CONFIG.COZE_PAT_TOKEN) || 'REPLACE_WITH_YOUR_COZE_PAT_TOKEN'
        }
    },
});
