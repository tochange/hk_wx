getApp();

Page({
    data: {
        qa: [],
        ishide: !0
    },
    onLoad: function(e) {
        var a = e.code;
        this.setData({
            code: a
        });
    },
    userinfo: function(e) {
        if (console.log(e), "getUserInfo:fail auth deny" == e.detail.errMsg) return !1;
        this.data.code, e.detail;
        wx.navigateBack({});
    }
});