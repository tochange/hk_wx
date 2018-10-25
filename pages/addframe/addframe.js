var e = require("./../utils/config.js"), t = require("./frame.js"), a = require("./scene.js"), i = require("./filter.js"), s = wx.createCanvasContext("shareCanvas"), c = getApp(), d = void 0, n = void 0, o = void 0;

Page({
    data: {
        imginfo: [],
        width: 750,
        height: 400,
        touch_start: 0,
        touch_end: 0,
        filterCanvasWidth: 0,
        filterCanvasHeight: 0,
        cut_img: "",
        cut_img_addframe: "",
        systeminfo: [],
        headimgtop: 10,
        img_box_height: 361,
        select_id: 1,
        select_sid: 1,
        select_fid: 1,
        bg_color: "",
        bg_img: "",
        current_bg_img: "",
        opacity: 1,
        frameInfo: null,
        tabCheckedId: 1,
        frames: [],
        scenes: [],
        userScene: [],
        deleteSceneId: 0,
        brightnessValue: 0,
        filters: [ {
            id: 3,
            name: "滤镜",
            checked: !0,
            imgs: [ {
                id: 1,
                text: "原图",
                img_url: "/pages/images/filter_1.png"
            }, {
                id: 2,
                text: "黑白",
                img_url: "/pages/images/filter_2.png"
            }, {
                id: 3,
                text: "亮度",
                img_url: "/pages/images/filter_3.png"
            } ]
        } ],
        item: {
            show: !1,
            cutWidth: 0,
            cutHeight: 0,
            width: 0,
            height: 0,
            top: 10,
            left: 10,
            r: 0,
            x: 0,
            y: 0,
            canX: 0,
            canY: 0,
            scale: 1,
            angle: 0,
            active: !1
        },
        scrollLeft1: 0,
        scrollLeft2: 0
    },
    onLoad: function(e) {
        d = this.data.item;
        var i = wx.getStorageSync("cut_img");
        if (i) {
            a.getSceneList(this), this.setData({
                cut_img: i,
                cut_img_addframe: i
            });
            var s = this;
            wx.getImageInfo({
                src: i,
                success: function(e) {
                    console.log(e), n = e;
                    var a = e.width, i = e.height;
                    s.setData({
                        width: a,
                        height: i
                    }), wx.getSystemInfo({
                        success: function(e) {
                            s.setData({
                                systeminfo: e,
                                img_box_height: e.windowHeight - 207,
                                windowBgHeight: e.windowHeight - 207
                            }), s.getdata(1, function(e) {
                                setTimeout(function() {
                                    t.add(s, s.data.cut_img, e, s.data.width, s.data.height);
                                }, 500);
                            });
                        }
                    });
                }
            });
        } else wx.showModal({
            content: "请先添加图片再加画框。",
            showCancel: !1,
            success: function(e) {
                wx.navigateTo({
                    url: "/pages/index/index"
                });
            }
        });
    },
    onShow: function() {
        var e = this;
        a.getSceneList(e);
        var t = wx.getStorageSync("new_upload");
        1 == (t = 1 == t ? 1 : 0) && (e.setData({
            tabCheckedId: 2,
            new_upload: 1
        }), e.getdata(2, function(t) {
            e.addScene(t);
        }), wx.removeStorageSync("new_upload"));
    },
    getdata: function(t, a) {
        var i = "framesNew";
        2 == (t = t || 1) && (i = "scene");
        var s = this.data.new_upload, c = this;
        wx.request({
            url: e.BASE_URL + "/Api/Index/" + i,
            data: {
                authcode: e.API_AUTH_CODE,
                appcode: e.APP_CODE
            },
            header: {
                "Content-Type": "application/json"
            },
            method: "POST",
            success: function(e) {
                if (wx.hideLoading(), 40001 == e.data.code) {
                    var i = e.data.data[0].imgs[0];
                    if (e.data.data[0].checked = !0, 1 == t) o = o || i, c.setData({
                        frames: e.data.data,
                        select_id: i.id
                    }); else if (2 == t) {
                        if (1 == s) {
                            e.data.data[0].checked = !1, i = c.data.userScene.length > 0 ? c.data.userScene[0] : {
                                doNothing: !0
                            };
                            d = !0;
                        } else var d = !1;
                        var n = [ {
                            checked: d,
                            ctime: "0",
                            id: "0",
                            imgs: c.data.userScene,
                            custom: "1",
                            name: "自定义",
                            onsale: "1"
                        } ].concat(e.data.data);
                        c.setData({
                            scenes: n,
                            select_sid: i.id,
                            new_upload: 0
                        });
                    }
                    a && a(i);
                }
            }
        });
    },
    chooseTab: function(e) {
        var t = this, a = e.currentTarget.dataset.id;
        t.data.tabCheckedId = a, t.setData({
            tabCheckedId: a
        }), 2 == a && t.getdata(2, function(e) {
            t.addScene(e);
        });
    },
    chooseType: function(e) {
        var t = this, a = e.currentTarget.dataset.id;
        if (1 == t.data.tabCheckedId) {
            var i = t.data.frames;
            console.log(i.length);
            for (c = 0; c < i.length; c++) i[c].id == a ? i[c].checked = !0 : i[c].checked = !1;
            this.setData({
                scrollLeft1: 0,
                frames: i
            });
        } else if (2 == t.data.tabCheckedId) {
            var s = t.data.scenes;
            console.log(s.length);
            for (var c = 0; c < s.length; c++) s[c].id == a ? s[c].checked = !0 : s[c].checked = !1;
            this.setData({
                scrollLeft2: 0,
                scenes: s
            });
        }
    },
    chooseImage: function(e) {
        var a = this, s = a.data.touch_end - a.data.touch_start, c = e.currentTarget.dataset.imginfo;
        if (s > 350) return c.showDelete = !0, void a.setData({
            deleteSceneId: c.id
        });
        var d = a.data.cut_img;
        c && c.up_img && (o = c);
        var h = a.data.width, l = a.data.height;
        if (console.log(a.data.tabCheckedId), 1 == a.data.tabCheckedId) this.setData({
            select_id: c.id
        }), t.add(a, d, c, h, l); else if (2 == a.data.tabCheckedId) this.addScene(c), this.setData({
            select_sid: c.id
        }); else if (3 == a.data.tabCheckedId) {
            if (a.setData({
                select_fid: c.id
            }), a.setData({
                brightnessValue: 0,
                filterCanvasWidth: n.width,
                filterCanvasHeight: n.height
            }), 3 == c.id) return;
            i.add({
                image: n,
                type: c.id,
                callback: function(e) {
                    var i = 1 === c.id ? "恢复原图" : "添加滤镜中...";
                    t.add(a, e, o, a.data.width, a.data.height, i);
                }
            });
        }
    },
    addScene: function(e) {
        var t = this;
        wx.showLoading({
            title: "配景中...",
            mask: !0
        });
        var a = this.data.item;
        a.active = !0, this.setData({
            item: a,
            imginfo: e
        }), wx.downloadFile({
            url: e.img_url,
            success: function(a) {
                if (console.log(a), 200 === a.statusCode) {
                    t.data.item;
                    var i = t.data.systeminfo.windowWidth, c = t.data.img_box_height, d = t.data.bg_color, n = a.tempFilePath, o = e.img_url;
                    s.clearRect(0, 0, i, c), n ? s.drawImage(n, 0, 0, i, c) : (s.setFillStyle(d), s.fillRect(0, 0, i, c)), 
                    s.draw(), t.setData({
                        bg_img: n,
                        current_bg_img: o
                    }), wx.hideLoading();
                } else wx.hideLoading(), wx.showToast({
                    title: "下载画框失败，请刷新重试",
                    icon: "none",
                    mask: !0
                });
            }
        });
    },
    brightnessChange: function(e) {
        var a = this;
        a.setData({
            brightnessValue: e.detail.value
        });
        try {
            i.add({
                image: n,
                type: 3,
                value: e.detail.value,
                callback: function(e) {
                    setTimeout(function() {
                        t.add(a, e, o, a.data.width, a.data.height, "亮度调整中...");
                    }, 300);
                }
            });
        } catch (e) {
            wx.hideLoading(), wx.showToast({
                title: "亮度调整异常，请刷新重试",
                icon: "none",
                mask: !0
            });
        }
    },
    opacityda: function() {
        var e = this, t = this.data.opacity;
        t < 1 && setTimeout(function() {
            e.setData({
                opacity: t + .05
            }), e.opacityda();
        }, 100);
    },
    preview_img: function() {
        var e = this.data.cut_img_addframe;
        wx.previewImage({
            current: e,
            urls: [ e ]
        });
    },
    hideCtrl: function(e) {
        var t = e.target.dataset.ctrl || !1;
        d.actve != t && (d.active = t, this.setData({
            item: d
        }));
    },
    save: function(t) {
        var a = this, i = a.data.item, c = a.data.systeminfo.windowWidth, d = a.data.img_box_height, n = a.data.bg_color, o = a.data.bg_img;
        o ? s.drawImage(o, 0, 0, 3 * c, 3 * d) : (s.setFillStyle(n), s.fillRect(0, 0, 3 * c, 3 * d));
        var h = 0, l = 0;
        1 == i.scale ? (h = i.left + 20, l = i.top + 20) : (h = i.x - i.width * i.scale * .5, 
        l = i.y - Math.round(i.height) * i.scale * .5, h = i.left + (i.width + 40) * (1 - i.scale) / 2 + 20, 
        l = i.top + (i.height + 45) * (1 - i.scale) / 2 + 20), wx.setStorageSync("share_data", {
            x: h,
            y: l,
            scale_width: i.scale * i.width,
            scale_height: i.scale * i.height,
            width: c,
            height: d,
            bg_img: o,
            bg_color: n,
            cut_img_addframe: a.data.cut_img_addframe
        }), s.drawImage(a.data.cut_img_addframe, 3 * h, 3 * l, i.scale * i.width * 3, i.scale * i.height * 3), 
        s.drawImage("/pages/images/shuiyin@3x.png", 3 * c - 230, 3 * d - 60), s.draw(!1, function() {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 3 * c,
                height: 3 * d,
                destWidth: 3 * c,
                destHeight: 3 * d,
                quality: 1,
                canvasId: "shareCanvas",
                success: function(i) {
                    wx.setStorageSync("share_img", i.tempFilePath);
                    var s = wx.getStorageSync("usertoken"), c = i.tempFilePath, d = a.data.tabCheckedId;
                    if (1 == d) n = a.data.select_id; else if (2 == d) n = a.data.select_sid; else if (3 == d) var n = a.data.select_fid;
                    wx.showLoading({
                        title: " 上传中...",
                        mask: !0
                    });
                    var o = a.data.imginfo;
                    wx.uploadFile({
                        url: e.BASE_URL + "/Api/Upload/uploadImage",
                        filePath: c,
                        name: "file",
                        formData: {
                            usertoken: s,
                            authcode: e.API_AUTH_CODE,
                            kuang_id: n,
                            tabCheckedId: d,
                            form_id: t.detail.formId,
                            user_scene_type: o.user_scene_type || 0
                        },
                        header: {
                            "Content-Type": "multipart/form-data"
                        },
                        success: function(e) {
                            console.log(e.data), wx.hideLoading(), e.data >= 1 ? wx.navigateTo({
                                url: "/pages/share/share?source=1&id=" + e.data
                            }) : wx.showToast({
                                title: "上传失败"
                            });
                        }
                    });
                }
            });
        });
    },
    wrapperTouchStart: function(e) {
        (d = this.data.item).active = !0, d.lx = e.touches[0].clientX, d.ly = e.touches[0].clientY, 
        this.setData({
            item: d
        });
    },
    wrapperTouchMove: function(e) {
        d._lx = e.touches[0].clientX, d._ly = e.touches[0].clientY, d.left += d._lx - d.lx, 
        d.top += d._ly - d.ly, d.x += d._lx - d.lx, d.y += d._ly - d.ly, d.tx += d._lx - d.lx, 
        d.ty += d._ly - d.ly, d.lx = e.touches[0].clientX, d.ly = e.touches[0].clientY, 
        this.setData({
            item: d
        });
    },
    ctrlTouchStart: function(e) {
        d.tx = e.touches[0].clientX, d.ty = e.touches[0].clientY, d.anglePre = this.countDeg(d.x, d.y, d.tx, d.ty), 
        d.r = this.getDistance(d.x, d.y, d.left, d.top);
    },
    ctrlTouchMove: function(e) {
        d._tx = e.touches[0].clientX, d._ty = e.touches[0].clientY, d.disPtoO = this.getDistance(d.x, d.y, d._tx, d._ty), 
        d.scale = d.disPtoO / d.r, d.scale = parseFloat(d.scale.toFixed(1)), d.oScale = 1 / d.scale, 
        d.angleNext = this.countDeg(d.x, d.y, d._tx, d._ty), d.new_rotate = d.angleNext - d.anglePre, 
        d.rotate += d.new_rotate, d.angle = d.rotate, d.tx = e.touches[0].clientX, d.ty = e.touches[0].clientY, 
        d.anglePre = this.countDeg(d.x, d.y, d.tx, d.ty), this.setData({
            item: d
        });
    },
    countDeg: function(e, t, a, i) {
        var s = a - e, c = i - t, d = Math.abs(s / c), n = Math.atan(d) / (2 * Math.PI) * 360;
        return s < 0 && c < 0 ? n = -n : s <= 0 && c >= 0 ? n = -(180 - n) : s > 0 && c < 0 ? n = n : s > 0 && c > 0 && (n = 180 - n), 
        n;
    },
    getDistance: function(e, t, a, i) {
        var s = a - e, c = i - t;
        return Math.sqrt(s * s + c * c);
    },
    addUserScene: function(e) {
        var t = this;
        {
            if (30 != t.data.userScene.length) return wx.showActionSheet({
                itemList: [ "拍照", "从手机相册选择" ],
                success: function(e) {
                    console.log(e.tapIndex), 0 == e.tapIndex ? c.navigateTo("/pages/camera/camera?type=scene&height=" + t.data.img_box_height) : 1 == e.tapIndex && wx.chooseImage({
                        count: 1,
                        sizeType: [ "compressed" ],
                        sourceType: [ "album" ],
                        success: function(e) {
                            var a = e.tempFilePaths[0];
                            console.log(a), wx.setStorageSync("tempSceneFilePaths", a), wx.navigateTo({
                                url: "/pages/cutscene/index?from=file&height=" + t.data.img_box_height
                            });
                        }
                    });
                },
                fail: function(e) {
                    console.log(e.errMsg);
                }
            }), !1;
            wx.showToast({
                title: "最多只能上传30张自定义背景图"
            });
        }
    },
    hideDeleteCtrl: function(e) {
        var t = this;
        t.data.deleteSceneId > 0 && t.setData({
            deleteSceneId: 0
        });
    },
    deleteUserScene: function(e) {
        var t = this, i = t.data.deleteSceneId, s = t.data.scenes, c = s[0].imgs;
        a.deleteUserScene(i, function() {
            for (var e = 0; e < c.length; e++) if (c[e].id == i) {
                c.splice(e, 1);
                break;
            }
            s[0].imgs = c, t.setData({
                scenes: s,
                deleteSceneId: 0
            }), wx.showToast({
                title: "删除成功"
            });
        });
    },
    timestampStart: function(e) {
        this.setData({
            touch_start: e.timeStamp
        });
    },
    timestampEnd: function(e) {
        this.setData({
            touch_end: e.timeStamp
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    }
});