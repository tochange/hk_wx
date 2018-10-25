var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../vendor/we-cropper/we-cropper.js")), t = require("./../utils/config.js"), a = wx.getSystemInfoSync(), o = a.windowWidth, r = a.windowHeight - 50;

Page({
    data: {
        from: "",
        cropperOpt: {
            id: "cropper",
            width: o,
            height: r,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: 0,
                y: (r - 300) / 2,
                width: o,
                height: 300
            }
        }
    },
    onLoad: function(t) {
        var a = this, o = t.from || "";
        a.setData({
            from: o
        }), a.data.from = t.from || "";
        var i = parseInt(t.height) || 500;
        a.data.cropperOpt.cut.height = i, a.data.cropperOpt.cut.y = (r - i) / 2;
        var n = a.data.cropperOpt;
        new e.default(n).on("ready", function(e) {
            var t = wx.getStorageSync("tempSceneFilePaths");
            a.wecropper.pushOrign(t);
        }).updateCanvas();
    },
    touchStart: function(e) {
        this.wecropper.touchStart(e);
    },
    touchMove: function(e) {
        this.wecropper.touchMove(e);
    },
    touchEnd: function(e) {
        this.wecropper.touchEnd(e);
    },
    chooseimage: function() {
        var e = this;
        wx.chooseImage({
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album" ],
            success: function(t) {
                e.setData({
                    cutImage: "show",
                    addtribeConShow: "hide"
                }), e.wecropper.pushOrign(t.tempFilePaths[0]);
            }
        });
    },
    finishCropperImage: function(e) {
        var a = this;
        a.wecropper.getCropperImage(function(e) {
            if (e) {
                wx.showLoading({
                    title: " 上传中...",
                    mask: !0
                });
                var o = wx.getStorageSync("usertoken");
                wx.uploadFile({
                    url: t.BASE_URL + "/Api/Upload/uploadImageNew",
                    filePath: e,
                    name: "file",
                    formData: {
                        usertoken: o,
                        authcode: t.API_AUTH_CODE,
                        appcode: t.APP_CODE
                    },
                    header: {
                        "Content-Type": "multipart/form-data"
                    },
                    success: function(e) {
                        var r = JSON.parse(e.data);
                        "40001" == r.code ? wx.request({
                            url: t.BASE_URL + "/Api/Index/addUserScene",
                            data: {
                                relativeUrl: r.data.relativeUrl,
                                usertoken: o,
                                authcode: t.API_AUTH_CODE,
                                appcode: t.APP_CODE
                            },
                            header: {
                                "Content-Type": "application/json"
                            },
                            method: "POST",
                            success: function(e) {
                                wx.hideLoading(), "40001" == e.data.code && (wx.showToast({
                                    title: "上传成功"
                                }), wx.setStorageSync("new_upload", 1), "file" == a.data.from ? wx.navigateBack({
                                    delta: 1
                                }) : wx.navigateBack({
                                    delta: 2
                                }));
                            }
                        }) : wx.showToast({
                            title: "上传失败"
                        });
                    }
                });
            }
        });
    }
});