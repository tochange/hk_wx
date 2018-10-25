var e = getApp();

Page({
    data: {
        qa: [],
        ishide: !0,
        code: ""
    },
    onShow: function(e) {
        var a = this;
        wx.login({
            success: function(e) {
                e.code ? a.setData({
                    code: e.code
                }) : console.log("登录失败！" + e.errMsg);
            }
        });
    },
    userinfo: function(a) {
        if (console.log(a), "getUserInfo:fail auth deny" == a.detail.errMsg) return !1;
        var o = this.data.code, t = a.detail;
        e.sendRequest({
            url: "/Api/WechatApi/saveWechatInfo",
            data: {
                code: o,
                iv: t.iv,
                encryptedData: t.encryptedData,
                authcode: e.globalData.API_AUTH_CODE,
                appcode: e.globalData.APP_CODE
            },
            success: function(e) {
                if (console.log(e), 40001 == e.code) {
                    wx.showToast({
                        title: "授权成功",
                        icon: "none"
                    });
                    var a = e.data.userInfo;
                    wx.setStorageSync("userInfo", a), wx.downloadFile({
                        url: a.headimgurl,
                        success: function(e) {
                            if (200 === e.statusCode) {
                                var a = e.tempFilePath;
                                wx.setStorageSync("cut_img", a), wx.redirectTo({
                                    url: "/pages/addframe/addframe"
                                });
                            }
                        }
                    });
                } else wx.showToast({
                    title: "授权失败",
                    icon: "none"
                });
            }
        });
    }
});