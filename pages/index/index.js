var e = require("./../utils/config.js"), a = getApp();

Page({
    data: {
        imgUrls: [ "https://pro.jiahk.cn/Public/images/1.png", "https://pro.jiahk.cn/Public/images/2.png", "https://pro.jiahk.cn/Public/images/3.png", "https://pro.jiahk.cn/Public/images/4.png" ],
        indicatorDots: !1,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        img: [],
        loadComplete: !1,
        srcImagePath: "",
        defaultImagePath: "/pages/images/loading.gif"
    },
    onLoad: function() {
        this.getdata();
    },
    getdata: function() {
        var a = this;
        wx.request({
            url: e.BASE_URL + "/Api/Index/homepageImg",
            data: {
                authcode: e.API_AUTH_CODE,
                appcode: e.APP_CODE
            },
            header: {
                "Content-Type": "application/json"
            },
            method: "POST",
            success: function(e) {
                40001 == e.data.code ? setTimeout(function() {
                    a.setData({
                        img: e.data.data,
                        loadComplete: !0,
                        srcImagePath: e.data.data.img
                    });
                }, 100) : wx.showToast({
                    title: "获取图片失败",
                    icon: "none"
                });
            }
        });
    },
    imageLoad: function(e) {},
    previewImg: function() {
        this.clickAdd();
        var e = this.data.img;
        wx.previewImage({
            urls: [ e.img ]
        });
    },
    clickAdd: function() {
        var a = this.data.img;
        wx.request({
            url: e.BASE_URL + "/Api/Index/homepageImgClick",
            data: {
                authcode: e.API_AUTH_CODE,
                appcode: e.APP_CODE,
                homepage_paint_id: a.id
            },
            header: {
                "Content-Type": "application/json"
            },
            method: "POST",
            success: function(e) {
                e.data.code;
            }
        });
    },
    showIntro: function(e) {
        wx.navigateTo({
            url: "/pages/intro/intro?id=1"
        });
    },
    takephoto: function(e) {
        var t = this;
        return wx.showActionSheet({
            itemList: [ "拍照", "使用我的头像", "从手机相册选择" ],
            success: function(e) {
                console.log(e.tapIndex), t.clickLog(e.tapIndex), 0 == e.tapIndex ? a.navigateTo("/pages/camera/camera") : 2 == e.tapIndex ? t.choosePhoto() : 1 == e.tapIndex && (wx.showLoading({
                    title: "头像获取中...",
                    mask: !0
                }), t.chooseAvatar());
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        }), !1;
    },
    clickLog: function(a) {
        var t = wx.getStorageSync("usertoken");
        wx.request({
            url: e.BASE_URL + "/Api/Index/clickLog",
            data: {
                authcode: e.API_AUTH_CODE,
                appcode: e.APP_CODE,
                usertoken: t,
                clickType: a
            },
            header: {
                "Content-Type": "application/json"
            },
            method: "POST",
            success: function(e) {
                e.data.code;
            }
        });
    },
    choosePhoto: function() {
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album" ],
            success: function(e) {
                var a = e.tempFilePaths[0];
                console.log(a), wx.setStorageSync("tempFilePaths", a), wx.navigateTo({
                    url: "/pages/cut/cut"
                });
            }
        });
    },
    chooseAvatar: function() {
        var e = a.getStorageUserInfo();
        null !== e.headimgurl && void 0 != e.headimgurl && e.headimgurl ? wx.downloadFile({
            url: e.headimgurl,
            success: function(e) {
                if (wx.hideLoading(), 200 === e.statusCode) {
                    var a = e.tempFilePath;
                    wx.setStorageSync("cut_img", a), wx.navigateTo({
                        url: "/pages/addframe/addframe"
                    });
                }
            }
        }) : (wx.hideLoading(), wx.navigateTo({
            url: "/pages/auth/auth"
        }));
    },
    onShareAppMessage: function(e) {
        return "button" === e.from && console.log(e.target), {
            title: "好图配好框，就来加画框",
            path: "/pages/index/index",
            success: function(e) {},
            fail: function(e) {}
        };
    },
    open: function() {
        wx.navigateToMiniProgram({
            appId: "wx18a2ac992306a5a4",
            path: "pages/apps/largess/detail?accountId=2571553",
            extraData: {
                foo: "bar"
            },
            envVersion: "release",
            success: function(e) {}
        });
    },
    about_us: function(e) {
        wx.navigateTo({
            url: "/pages/feeback/feeback"
        });
    }
});