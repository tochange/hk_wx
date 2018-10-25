var e = wx.getSystemInfoSync(), o = e.windowWidth, t = e.windowHeight - 120, a = require("../../vendor/welCropper/welCropper.js");

Page({
    data: {},
    onLoad: function() {
        var e = this;
        a.init.apply(e, [ o, t ]), this.selectTap();
    },
    selectTap: function() {
        var e = this, o = wx.getStorageSync("tempFilePaths");
        console.log("tem9999"), console.log(o), e.showCropper({
            src: o,
            mode: "rectangle",
            sizeType: [ "original" ],
            callback: function(e) {
                return console.log("crop callback:" + e), wx.setStorageSync("cut_img", e), wx.navigateTo({
                    url: "/pages/addframe/addframe"
                }), !1;
            }
        });
    }
});