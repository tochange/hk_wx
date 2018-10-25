var t = wx.createCanvasContext("firstCanvas"), e = {
    cache: function(t, e) {
        if (!e) return wx.getStorageSync(t);
        wx.setStorageSync(t, e);
    },
    add: function(i, h, a, o, d, g) {
        i.data.loading = !0, wx.showLoading({
            title: g || "配框中...",
            mask: !0
        }), setTimeout(function() {
            i.data.loading && (wx.hideLoading(), wx.showToast({
                title: "处理超时，请重试",
                icon: "none",
                duration: 3e3,
                mask: !0
            }), i.data.loading = !1);
        }, 6e4);
        if (o > 375) var d = 375 * d / o, o = 375;
        console.log(o), console.log(d);
        var n = Number(a.right_shadow_width), r = Number(a.down_shadow_height), w = Number(a.up_shadow_height), s = Number(a.left_shadow_width), l = Number(a.right_nei_shadow_width), u = Number(a.down_nei_shadow_height), _ = Number(a.left_width), c = Number(a.right_width), m = Number(a.up_height), f = Number(a.down_height), x = Number(a.left_up_width), b = Number(a.left_up_height), p = Number(a.right_up_width), v = Number(a.right_up_height), N = Number(a.right_down_width), y = Number(a.right_down_height), I = Number(a.left_down_width), D = Number(a.left_down_height), F = o + x + p - s - l, S = d + m + f - w - u;
        i.setData({
            width: F,
            height: S,
            select_id: a.id
        });
        a.id, a.bgcolor;
        var C = i.data.systeminfo.windowWidth, L = i.data.windowBgHeight, P = F + 160;
        if (console.log("initwidth===" + P), C <= P) {
            if ((k = parseInt(P / C * L)) > (q = d + m - w + f - u)) {
                var T = k - q;
                if (console.log(T), T < 160) var W = P, H = q + 160, j = P * H / k, k = H, M = ((P = j) - W + 160) / 2 + n / 2; else M = 80 + n / 2;
                var O = (k - q) / 2 + r / 2, B = P, X = k;
                i.setData({
                    width: B,
                    height: X
                });
            } else {
                var Y = q + 160, M = ((z = parseInt(P * Y / k)) - P + 160) / 2, O = 80, B = z, X = Y;
                i.setData({
                    width: B,
                    height: X
                });
            }
            console.log("bgcutwidth==" + B), console.log("bgcutheight==" + X);
        } else {
            var k = parseInt(P / C * L), q = d + m - w + f - u;
            if (k > q) {
                var M = (C - P + 160) / 2, O = (k - q) / 2, B = C, X = k;
                i.setData({
                    width: B,
                    height: X
                });
            } else {
                var z = parseInt(o * (d + 160) / k);
                if (bgwidth > z) {
                    var M = (z - o) / 2, O = 80, B = z, X = d + 160;
                    i.setData({
                        width: B,
                        height: X
                    });
                } else var M = 0, O = 0;
            }
        }
        t.drawImage(h, M + x - s, O + b - w, o, d);
        for (var A = [ {
            url: a.up_img,
            x: M + x - .3,
            y: O,
            w: o - s - l + .6,
            h: m
        }, {
            url: a.left_img,
            x: M,
            y: O + b - .3,
            w: _,
            h: d - u - w + .6
        }, {
            url: a.right_img,
            x: M + o + x - s - l,
            y: O + v - .3,
            w: c,
            h: d - u - w + .6
        }, {
            url: a.down_img,
            x: M + I - .3,
            y: O + d + b - w - u,
            w: o - s - l + .6,
            h: f
        }, {
            url: a.left_up_img,
            x: M,
            y: O,
            w: x,
            h: b
        }, {
            url: a.right_up_img,
            x: M + o + x - s - l,
            y: O,
            w: p,
            h: v
        }, {
            url: a.right_down_img,
            x: M + o + I - s - l,
            y: O + d + v - w - u,
            w: N,
            h: y
        }, {
            url: a.left_down_img,
            x: M,
            y: O + d + b - w - u,
            w: I,
            h: D
        } ], E = 0, G = function() {
            E == A.length && t.draw(!1, function() {
                setTimeout(function() {
                    wx.canvasToTempFilePath({
                        x: M,
                        y: O,
                        width: F,
                        height: S,
                        destWidth: B,
                        destHeight: X,
                        canvasId: "firstCanvas",
                        success: function(t) {
                            wx.hideLoading();
                            var e = i.data.item, h = i.data.systeminfo.windowWidth;
                            e.cutWidth = Object.assign(B), e.cutHeight = Object.assign(X);
                            var g = 1, n = 1, r = 1;
                            F >= h && (g = (h - 70) / F), S >= i.data.img_box_height && (n = (i.data.img_box_height - 70) / S), 
                            r = g < n ? g : n, e.width = F * r, e.height = S * r, e.show = !0, e.left = (h - e.width - 40) / 2, 
                            e.top = (i.data.img_box_height - e.height - 45) / 2, e.canX = e.left + 15, e.canY = e.top + 15, 
                            e.x = h / 2, e.y = i.data.img_box_height / 2, wx.setStorageSync("share_img", t.tempFilePath), 
                            i.setData({
                                item: e,
                                bg_color: a.bgcolor,
                                headimgtop: -1,
                                cut_img_addframe: t.tempFilePath,
                                width: o,
                                height: d
                            }), i.data.loading = !1;
                        }
                    });
                }, 300);
            });
        }, J = 0; J < A.length; J++) !function(i) {
            e.cache(i.url);
            wx.downloadFile({
                url: i.url,
                success: function(h) {
                    console.log("download..."), console.log(h), 200 === h.statusCode ? (E++, e.cache(i.url, h.tempFilePath), 
                    t.drawImage(h.tempFilePath, i.x, i.y, i.w, i.h), G()) : (wx.hideLoading(), wx.showModal({
                        content: "下载画框失败"
                    }));
                },
                fail: function() {
                    wx.hideLoading(), wx.showModal({
                        content: "下载画框失败"
                    });
                }
            });
        }(A[J]);
    }
};

module.exports = e;