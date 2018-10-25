var e = require("/pages/utils/config.js"), t = (require("/pages/utils/ald-stat.js"), 
wx.getUpdateManager());

App({
    data: {
        userInfo: []
    },
    globalData: {
        BASE_URL: "https://pro.jiahk.cn",
        API_AUTH_CODE: "gz7J1Mrfc4FJnXuSX232AowRlEa0mIwN",
        APP_CODE: "UK983676"
    },
    onLaunch: function() {
        var e = this;
        wx.checkSession({
            success: function() {
                e.getUserInfo();
            },
            fail: function() {
                e.getUserInfo();
            }
        }), e.checkUpdate();
    },
    getUserInfo: function() {
        wx.login({
            success: function(t) {
                wx.request({
                    url: e.BASE_URL + "/Api/WechatApi/login",
                    data: {
                        authcode: e.API_AUTH_CODE,
                        appcode: e.APP_CODE,
                        code: t.code
                    },
                    header: {
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    success: function(e) {
                        40001 == e.data.code ? (wx.setStorageSync("usertoken", e.data.data.userToken), wx.setStorageSync("userInfo", e.data.data.userInfo)) : wx.showToast({
                            title: "登录失败",
                            icon: "none"
                        });
                    }
                });
            }
        });
    },
    checkUpdate: function() {
        t.onCheckForUpdate(function(e) {
            console.log(e.hasUpdate), e.hasUpdate && wx.showToast({
                title: "发现新版本，正在更新中...",
                icon: "none"
            });
        }), t.onUpdateReady(function() {
            wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                success: function(e) {
                    e.confirm && t.applyUpdate();
                }
            });
        }), t.onUpdateFailed(function() {
            wx.showToast({
                title: "新版本下载失败",
                icon: "none"
            });
        });
    },
    isAuthWchatInfo: function() {
        var e = wx.getStorageSync("userInfo");
        "" != e.headimgurl && e.headimgurl || this.navigateTo("/pages/auth/auth");
    },
    navigateTo: function(e) {
        getCurrentPages().length >= 10 ? wx.redirectTo({
            url: e
        }) : wx.navigateTo({
            url: e
        });
    },
    redirectTo: function(e) {
        wx.redirectTo({
            url: e
        });
    },
    getStorageUserInfo: function() {
        return wx.getStorageSync("userInfo");
    },
    sendRequest: function(e, t) {
        var o = this, n = e.data || {}, a = e.header, c = void 0;
        c = t ? t + e.url : this.globalData.BASE_URL + e.url, e.method && ("post" == e.method.toLowerCase() && (a = a || {
            "Content-Type": "application/json"
        }), e.method = e.method.toUpperCase()), e.hideLoading || wx.showLoading({
            title: e.title || "加载中...",
            icon: "loading",
            mask: !0
        }), wx.request({
            url: c,
            data: n,
            method: e.method || "POST",
            header: a || {
                "content-type": "application/json"
            },
            success: function(t) {
                if (wx.hideLoading(), t.data.code = parseInt(t.data.code), console.log(e.url), console.log(t.data), 
                40020 == t.data.code) return console.log("登录失效，重新登录"), void o.getUserInfo();
                e.name && 40002 === t.data.code ? wx.showToast({
                    icon: "none",
                    title: e.name + "失败，" + t.data.message
                }) : "function" == typeof e.success && e.success(t.data);
            },
            fail: function(t) {
                "function" == typeof e.fail && e.fail(t);
            },
            complete: function(t) {
                "function" == typeof e.complete && e.complete(t);
            }
        });
    }
});