var e = require("../utils/config.js"), t = {
    getSceneList: function(t) {
        wx.request({
            url: e.BASE_URL + "/Api/Index/userScene",
            data: {
                usertoken: wx.getStorageSync("usertoken"),
                authcode: e.API_AUTH_CODE,
                appcode: e.APP_CODE
            },
            header: {
                "Content-Type": "application/json"
            },
            method: "POST",
            success: function(e) {
                (e.data.code = "40001") && (t.data.userScene = e.data.data);
            }
        });
    },
    deleteUserScene: function(t, n) {
        wx.request({
            url: e.BASE_URL + "/Api/Index/deleteUserScene",
            data: {
                userSceneId: t,
                usertoken: wx.getStorageSync("usertoken"),
                authcode: e.API_AUTH_CODE,
                appcode: e.APP_CODE
            },
            header: {
                "Content-Type": "application/json"
            },
            method: "POST",
            success: function(e) {
                wx.hideLoading(), (e.data.code = "40001") && n && n();
            }
        });
    }
};

module.exports = t;