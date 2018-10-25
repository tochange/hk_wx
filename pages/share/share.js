var e = require("./../utils/config.js"), a = getApp(), t = wx.createCanvasContext("saveCanvas"), i = wx.createCanvasContext("shareCanvas");

Page({
    data: {
        width: 750,
        height: 400,
        cut_img: "",
        cut_img_addframe: "",
        canvas_ishide: !0,
        systeminfo: [],
        headimgtop: -1,
        img_box_height: 361,
        paint_id: 0,
        paintInfo: [],
        save_width: 750,
        save_height: 400,
        share_height: 400,
        share_width: 300,
        type: "open",
        img: "",
        saveType: 0
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
    onLoad: function(e) {
        var a = this, t = e.type || "default", i = (e.img, e.source || 0), s = wx.getStorageSync("share_img");
        this.setData({
            share_img: s,
            type: t,
            cut_img_addframe: s,
            source: i
        }), wx.getImageInfo({
            src: s,
            success: function(e) {
                console.log(e);
                var t = e.width, i = e.height;
                a.setData({
                    width: t,
                    height: i
                });
            }
        }), wx.getSystemInfo({
            success: function(e) {
                a.setData({
                    systeminfo: e,
                    img_box_height: e.windowHeight - 207,
                    windowBgHeight: e.windowHeight - 200
                });
            }
        });
        var n = e.id, o = wx.getStorageSync("share_img");
        this.setData({
            cut_img: o,
            cut_img_addframe: o,
            paint_id: n
        });
        a = this;
        wx.getImageInfo({
            src: o,
            success: function(e) {
                console.log(e);
                var t = e.width, i = e.height;
                a.setData({
                    width: t,
                    height: i
                });
            }
        }), wx.getSystemInfo({
            success: function(e) {
                a.setData({
                    systeminfo: e,
                    img_box_height: e.windowHeight - 207,
                    windowBgHeight: e.windowHeight - 200
                });
            }
        }), n > 0 && this.getdata(n), a.saveShareImage();
    },
    getdata: function(a) {
        var t = this, i = wx.getStorageSync("usertoken");
        wx.request({
            url: e.BASE_URL + "/Api/Index/paintInfo",
            data: {
                authcode: e.API_AUTH_CODE,
                appcode: e.APP_CODE,
                paint_id: a,
                usertoken: i
            },
            header: {
                "Content-Type": "application/json"
            },
            method: "POST",
            success: function(e) {
                console.log(e.data), 40001 == e.data.code && (t.setData({
                    paintInfo: e.data.data
                }), 1 == e.data.data.isme ? wx.setNavigationBarTitle({
                    title: "分享保存"
                }) : wx.setNavigationBarTitle({
                    title: "加画框"
                }));
            }
        });
    },
    preview_img: function() {
        var e = this.data.paintInfo.full_url;
        wx.previewImage({
            current: e,
            urls: [ e ]
        });
    },
    onShareAppMessage: function(e) {
        var a = this, t = a.data.paintInfo, i = a.data.paint_id;
        a.share();
        var s = a.data.cut_img_addframe, n = a.data.img || wx.getStorageSync("share_image_" + i) || t.full_url || s;
        return 1 != a.data.source && (n = t.full_url), {
            title: "点击查看我的作品吧~",
            path: "/pages/share/share?type=share&id=" + i + "&img=" + n,
            imageUrl: n,
            success: function(e) {
                wx.showToast({
                    title: "转发成功"
                });
            },
            fail: function(e) {
                wx.showToast({
                    title: "转发失败"
                });
            }
        };
    },
    canvasSize: function(e, a, t) {
        var i, s;
        e > a ? s = 3 * (i = e + 40 * t) / 4 : e == a ? s = i = e + 40 * t : i = 4 * (s = a + 40 * t) / 3, 
        s - 40 <= a ? this.canvasSize(e, a, t + 1) : this.setData({
            share_width: i,
            share_height: s
        });
    },
    saveShareImage: function() {
        var a = this;
        if (!wx.getStorageSync("share_image_" + a.data.paint_id)) {
            var t = wx.getStorageSync("share_data"), s = a.data.share_width, n = a.data.share_height;
            this.canvasSize(t.scale_width, t.scale_height, 1);
            var s = a.data.share_width, n = a.data.share_height;
            setTimeout(function() {
                i.setFillStyle("#F5F5F5"), i.fillRect(0, 0, s, n), i.drawImage(t.cut_img_addframe, (s - 1 * t.scale_width) / 2 - 4, (n - 1 * t.scale_height) / 2, 1 * t.scale_width, 1 * t.scale_height), 
                i.draw(!1, function() {
                    setTimeout(function() {
                        wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: s,
                            height: n,
                            destWidth: s,
                            destHeight: n,
                            quality: 1,
                            canvasId: "shareCanvas",
                            success: function(t) {
                                var i = wx.getStorageSync("usertoken");
                                wx.uploadFile({
                                    url: e.BASE_URL + "/Api/Upload/uploadImageNew",
                                    filePath: t.tempFilePath,
                                    name: "file",
                                    formData: {
                                        usertoken: i,
                                        authcode: e.API_AUTH_CODE
                                    },
                                    header: {
                                        "Content-Type": "multipart/form-data"
                                    },
                                    success: function(e) {
                                        wx.hideLoading(), "40001" == (e = JSON.parse(e.data)).code ? wx.setStorageSync("share_image_" + a.data.paint_id, e.data.fullUrl) : wx.showToast({
                                            title: "上传失败"
                                        });
                                    }
                                });
                            }
                        });
                    });
                }, 300);
            }, 500);
        }
    },
    saveablum: function() {
        var e = this, a = e.data.paintInfo, i = this.data.type;
        if (0 == a.isme || "share" == i) return wx.showLoading({
            title: "保存中...",
            mask: !0
        }), wx.downloadFile({
            url: a.full_url,
            success: function(a) {
                200 === a.statusCode && wx.saveImageToPhotosAlbum({
                    filePath: a.tempFilePath,
                    success: function(a) {
                        wx.hideLoading(), e.albumLog(), wx.showToast({
                            title: "已保存到相册",
                            icon: "success"
                        });
                    }
                });
            }
        }), !1;
        wx.showActionSheet({
            itemList: [ "标清（500k）", "高清（1M）", "超清（3M）", "加框图(无背景)" ],
            success: function(a) {
                wx.showLoading({
                    title: "保存中..."
                }), e.setData({
                    saveType: a.tapIndex
                });
                var i = wx.getStorageSync("share_data"), s = a.tapIndex + 2, n = i.width * s, o = i.height * s;
                3 == a.tapIndex && (s = 2, n = i.scale_width * s + 50, o = i.scale_height * s + 50), 
                e.setData({
                    save_width: n,
                    save_height: o
                }), setTimeout(function() {
                    3 == a.tapIndex ? t.drawImage(i.cut_img_addframe, 50, 50, i.scale_width * s, i.scale_height * s) : (i.bg_img ? t.drawImage(i.bg_img, 0, 0, n, o) : (t.setFillStyle(i.bg_color), 
                    t.fillRect(0, 0, n, o)), t.drawImage(i.cut_img_addframe, i.x * s, i.y * s, i.scale_width * s, i.scale_height * s), 
                    0 == a.tapIndex ? t.drawImage("/pages/images/shuiyin@2x.png", n - 160, o - 45) : t.drawImage("/pages/images/shuiyin@3x.png", n - 230, o - 60)), 
                    t.draw(!1, function() {
                        setTimeout(function() {
                            wx.canvasToTempFilePath({
                                x: 0,
                                y: 0,
                                width: n,
                                height: o,
                                destWidth: n,
                                destHeight: o,
                                quality: 1,
                                canvasId: "saveCanvas",
                                success: function(a) {
                                    wx.saveImageToPhotosAlbum({
                                        filePath: a.tempFilePath,
                                        success: function(a) {
                                            wx.hideLoading(), e.albumLog(), wx.showToast({
                                                title: "已保存到相册",
                                                icon: "success"
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }, 300);
                }, 500);
            },
            fail: function(e) {
                console.log(e.errMsg);
            }
        });
    },
    onemore: function() {
        var e = this;
        return wx.showActionSheet({
            itemList: [ "拍照", "使用我的头像", "从手机相册选择" ],
            success: function(t) {
                e.clickLog(t.tapIndex), console.log(t.tapIndex), 0 == t.tapIndex ? a.navigateTo("/pages/camera/camera") : 2 == t.tapIndex ? e.choosePhoto() : 1 == t.tapIndex && (wx.showLoading({
                    title: "头像获取中...",
                    mask: !0
                }), e.chooseAvatar());
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
    share: function() {
        var a = wx.getStorageSync("usertoken"), t = this.data.paint_id;
        wx.request({
            url: e.BASE_URL + "/Api/Index/share",
            data: {
                authcode: e.API_AUTH_CODE,
                appcode: e.APP_CODE,
                usertoken: a,
                paint_id: t
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
    albumLog: function() {
        var a = this, t = wx.getStorageSync("usertoken"), i = this.data.paint_id, s = a.data.saveType;
        wx.request({
            url: e.BASE_URL + "/Api/Index/album",
            data: {
                authcode: e.API_AUTH_CODE,
                appcode: e.APP_CODE,
                usertoken: t,
                paint_id: i,
                saveType: s
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
    backToIndex: function() {
        var e = getCurrentPages().length;
        e > 1 ? wx.navigateBack({
            delta: e
        }) : wx.redirectTo({
            url: "/pages/index/index"
        });
    }
});