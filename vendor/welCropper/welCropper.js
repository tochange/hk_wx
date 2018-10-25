function t(t, a, e) {
    var o = (a.y - t.y) * (e.x - a.x) - (a.x - t.x) * (e.y - a.y);
    return 0 == o ? 0 : o > 0 ? 1 : 2;
}

var a = {
    getCropRect: function(t) {
        var a = 0, e = 0;
        for (var o in t) {
            var r = t[o];
            a = r.x > a ? r.x : a, e = r.y > e ? r.y : e;
        }
        var i = a, h = e;
        for (var n in t) {
            var l = t[n];
            i = l.x < i ? l.x : i, h = l.y < h ? l.y : h;
        }
        return {
            x: i,
            y: h,
            w: a - i,
            h: e - h
        };
    },
    getAdjustSize: function(t, a, e, o) {
        return e > t && (o *= t / e, e = t), o > a && (e *= a / o, o = a), {
            width: e,
            height: o
        };
    },
    convexHull: function(a, e) {
        if (!(e < 3)) {
            for (var o = [], r = 0, i = 1; i < e; i++) a[i].x < a[r].x && (r = i);
            var h, n = r;
            do {
                for (o.push(a[n]), h = (n + 1) % e, i = 0; i < e; i++) 2 == t(a[n], a[i], a[h]) && (h = i);
                n = h;
            } while (n != r);
            return o;
        }
    },
    drawImageWithDegree: function(t, a, e, o, r) {
        var i = wx.createCanvasContext(t), h = r % 180 > 0, n = h ? o : e, l = h ? e : o, p = e / 2, g = o / 2, c = Math.abs(e - o) / 2;
        i.translate(p, g), i.rotate(r * Math.PI / 180), i.translate(-p, -g), h ? l > n ? i.drawImage(a, c, -c, n, l) : i.drawImage(a, -c, c, n, l) : i.drawImage(a, 0, 0, n, l), 
        i.draw(!1, function(t) {
            console.log("draw callback");
        });
    },
    findTopLeft: function(t) {
        var a = t.topleft.x, e = t.topleft.y;
        for (var o in t) {
            var r = t[o];
            a > r.x && (a = r.x), e > r.y && (e = r.y);
        }
        return {
            x: a,
            y: e
        };
    }
};

module.exports = {
    init: function(t, e) {
        var o = this, r = this;
        r.setData({
            cropperData: {
                drawSign: 0,
                hidden: !0,
                left: 0,
                top: 0,
                width: t,
                height: e,
                W: t,
                H: e,
                itemLength: 20,
                imageInfo: {
                    path: "",
                    width: 0,
                    height: 0
                },
                scaleInfo: {
                    x: 1,
                    y: 1
                },
                cropCallback: null,
                sizeType: [ "original", "compressed" ],
                original: !1,
                mode: "rectangle"
            },
            cropperMovableItems: {
                topleft: {
                    x: 50,
                    y: 50
                },
                topright: {
                    x: t - 50,
                    y: 50
                },
                bottomleft: {
                    x: 50,
                    y: e - 50
                },
                bottomright: {
                    x: t - 50,
                    y: e - 50
                }
            },
            cropperChangableData: {
                canCrop: !0,
                rotateDegree: 0,
                originalSize: {
                    width: 0,
                    height: 0
                },
                scaleSize: {
                    width: 0,
                    height: 0
                },
                shape: {},
                previewImageInfo: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                }
            }
        }), r.showCropper = function(t) {
            console.log(t);
            var a = o, e = a.data.cropperData, r = t.src, i = t.callback, h = t.sizeType, n = t.mode, l = [];
            h.indexOf("original") > -1 && l.push("original"), h.indexOf("compressed") > -1 && l.push("compressed"), 
            1 == l.length && l.indexOf("original") > -1 && (e.original = !0), n && (e.mode = n), 
            e.hidden = !1, e.hash = Math.random(), e.cropCallback = i, e.sizeType = l, r && (console.log(r), 
            wx.getImageInfo({
                src: r,
                success: function(t) {
                    var o = t.width, i = t.height;
                    e.imageInfo = {
                        path: r,
                        width: o,
                        height: i
                    }, a.setData({
                        cropperData: e
                    }), a.loadImage(r, o, i, !1);
                }
            }));
        }, r.hideCropper = function() {
            var t = o;
            t.data.cropperData.hidden = !0, t.data.cropperData.cropCallback = null, t.setData({
                cropperData: t.data.cropperData,
                cropperMovableItems: {
                    topleft: {
                        x: -1,
                        y: -1
                    },
                    topright: {
                        x: -1,
                        y: -1
                    },
                    bottomleft: {
                        x: -1,
                        y: -1
                    },
                    bottomright: {
                        x: -1,
                        y: -1
                    }
                },
                cropperChangableData: {
                    canCrop: !0,
                    rotateDegree: 0,
                    previewImageInfo: {
                        x: 0,
                        y: 0,
                        w: 0,
                        h: 0
                    }
                }
            }), t.clearCanvas(t.data.cropperData.imageInfo);
        }, r.originalChange = function() {
            var r = o, i = (r.data.cropperData.imageInfo, r.data.cropperChangableData.originalSize), h = i.width, n = i.height, l = !r.data.cropperData.original, p = l ? 1 : .4, g = a.getAdjustSize(t, e, h, n);
            console.log("change original=" + l), r.data.cropperData.original = l, r.data.cropperData.scaleInfo = {
                x: h * p / g.width,
                y: n * p / g.height
            };
            var c = r.data.cropperMovableItems, d = {
                topleft: {
                    x: 0,
                    y: 0
                },
                topright: {
                    x: 0,
                    y: 0
                },
                bottomleft: {
                    x: 0,
                    y: 0
                },
                bottomright: {
                    x: 0,
                    y: 0
                }
            };
            r.setData({
                cropperData: r.data.cropperData,
                cropperMovableItems: d
            }), setTimeout(function() {
                r.setData({
                    cropperMovableItems: c
                });
            }, 100), r.drawOriginalImage();
        }, r.cropImage = function() {
            var t = o, e = t.data.cropperData, r = e.mode, i = e.scaleInfo, h = (e.width, e.height, 
            t.data.cropperMovableItems);
            if ("rectangle" == r) {
                var n = 0, l = 0;
                for (var p in h) {
                    var g = h[p];
                    n = g.x > n ? g.x : n, l = g.y > l ? g.y : l;
                }
                var c = n, d = l;
                for (var s in h) {
                    var v = h[s];
                    c = v.x < c ? v.x : c, d = v.y < d ? v.y : d;
                }
                var w = n - c, f = l - d;
                w *= i.x, f *= i.y;
                var x = c * i.x, m = d * i.y;
                console.log("crop rect: x=" + x + ",y=" + m + ",w=" + w + ",h=" + f), wx.createCanvasContext("originalCanvas"), 
                wx.showLoading({
                    title: "正在截取..."
                }), wx.canvasToTempFilePath({
                    x: x,
                    y: m,
                    width: w,
                    height: f,
                    destWidth: w,
                    destHeight: f,
                    canvasId: "originalCanvas",
                    success: function(a) {
                        var e = a.tempFilePath;
                        wx.hideLoading(), t.data.cropperData.cropCallback && t.data.cropperData.cropCallback(e);
                    },
                    fail: function(t) {
                        wx.hideLoading(), wx.showModal({
                            title: "截取失败",
                            content: t.errMsg
                        }), console.log("fail res:"), console.log(t);
                    }
                });
            } else {
                var y = [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ], D = [];
                for (var u in h) {
                    var I = Math.ceil(h[u].x * i.x), b = Math.ceil(h[u].y * i.y), C = 0;
                    "topleft" == u ? C = 0 : "bottomleft" == u ? C = 1 : "bottomright" == u ? C = 2 : "topright" == u && (C = 3), 
                    y[C] = [ I, b ], D.push({
                        x: I,
                        y: b
                    });
                }
                a.convexHull(D, D.length), t.data.cropperData.cropCallback && t.data.cropperData.cropCallback(y);
            }
        }, r.changeCropShapeHandler = function() {
            wx.showActionSheet({
                itemList: [ "test0", "test1", "test2" ],
                success: function(t) {
                    console.log(t.tapIndex);
                },
                fail: function(t) {
                    console.log(t.errMsg);
                }
            });
        }, r.rotateImage = function() {
            console.log("rotate image");
            var r = o, i = r.data.cropperData.imageInfo, h = i.width, n = i.height, l = r.data.cropperChangableData.rotateDegree, p = (l = 360 == l ? 90 : l + 90) % 180 > 0, g = p ? n : h, c = p ? h : n, d = a.getAdjustSize(t, e, g, c), s = (t - d.width) / 2, v = (e - d.height) / 2, w = r.data.cropperData;
            w.left = s, w.top = v;
            var f = r.data.cropperChangableData;
            f.originalSize = {
                width: g,
                height: c
            }, f.scaleSize = {
                width: d.width,
                height: d.height
            }, f.rotateDegree = l, r.setData({
                cropperChangableData: f,
                cropperData: w
            }), console.log(f), r.data.cropperMovableItems;
            var x = {
                topleft: {
                    x: 0,
                    y: 0
                },
                topright: {
                    x: 0,
                    y: 0
                },
                bottomleft: {
                    x: 0,
                    y: 0
                },
                bottomright: {
                    x: 0,
                    y: 0
                }
            };
            r.setData({
                cropperMovableItems: x
            }), setTimeout(function() {
                r.loadImage(i.path, g, c, !0);
            }, 100);
        }, r.loadImage = function(r, i, h, n) {
            var l = o, p = a.getAdjustSize(t, e, i, h), g = (t - p.width) / 2, c = (e - p.height) / 2, d = {}, s = l.data.cropperData;
            s.drawSign = !s.drawSign, n || (s.imageInfo = {
                path: r,
                width: i,
                height: h
            }), s.left = g, s.top = c, s.width = p.width, s.height = p.height;
            var v = l.data.cropperData.original ? 1 : .4;
            s.scaleInfo = {
                x: i * v / p.width,
                y: h * v / p.height
            }, d.cropperData = s, d.cropperMovableItems = {
                topleft: {
                    x: 10,
                    y: 10
                },
                topright: {
                    x: p.width - 10,
                    y: 10
                },
                bottomleft: {
                    x: 10,
                    y: p.height - 10
                },
                bottomright: {
                    x: p.width - 10,
                    y: p.height - 10
                }
            };
            var w = l.data.cropperChangableData, f = w.rotateDegree % 180 > 0, x = f ? p.height : p.width, m = f ? p.width : p.height;
            console.log("rotateWidth:" + x + ", rotateHeight:" + m), w.previewImageInfo.x = (t - x) / 2, 
            w.previewImageInfo.y = (e - m) / 2, w.previewImageInfo.w = x, w.previewImageInfo.h = m, 
            w.originalSize = {
                width: i,
                height: h
            }, w.scaleSize = {
                width: p.width,
                height: p.height
            }, d.cropperChangableData = w, l.setData(d), l.drawImage({
                path: l.data.cropperData.imageInfo.path,
                width: i,
                height: h
            }), l.drawLines(l.data.cropperMovableItems, l.data.cropperData.imageInfo);
        }, r.clearCanvas = function(o) {
            r.data.cropperData;
            var i = a.getAdjustSize(t, e, o.width, o.height);
            if ("" != o.path) {
                var h = r.data.cropperData.original ? 1 : .4, n = wx.createCanvasContext("originalCanvas");
                n.clearRect(0, 0, o.width * h, o.height * h), n.draw();
                var l = wx.createCanvasContext("canvas");
                l.clearRect(0, 0, i.width, i.height), l.draw();
                var p = wx.createCanvasContext("moveCanvas");
                p.clearRect(0, 0, i.width, i.height), p.draw();
            }
        }, r.drawImage = function(r) {
            var i = o, h = (i.data.cropperData, a.getAdjustSize(t, e, r.width, r.height));
            if ("" != r.path) {
                var n = r.path, l = i.data.cropperData.original ? 1 : .4, p = i.data.cropperChangableData.rotateDegree;
                a.drawImageWithDegree("originalCanvas", n, r.width * l, r.height * l, p), a.drawImageWithDegree("canvas", n, h.width, h.height, p), 
                console.log("draw=" + n);
            }
        }, r.drawOriginalImage = function() {
            var t = o, e = t.data.cropperData.imageInfo, r = t.data.cropperChangableData.originalSize;
            if ("" != e.path) {
                var i = e.path, h = t.data.cropperData.original ? 1 : .4, n = t.data.cropperChangableData.rotateDegree;
                a.drawImageWithDegree("originalCanvas", i, r.width * h, r.height * h, n);
            }
        }, r.drawLines = function(r, i, h) {
            var n = o.data.cropperData.mode, l = a.getAdjustSize(t, e, i.width, i.height), p = [], g = [];
            g.push(r.topleft), g.push(r.topright), g.push(r.bottomright), g.push(r.bottomleft);
            var c = 4 == (p = a.convexHull(g, g.length)).length;
            h && h(c);
            var d = wx.createCanvasContext("moveCanvas"), s = a.getCropRect(p);
            if ("rectangle" == n) d.setFillStyle("rgba(0,0,0,0.5)"), d.fillRect(0, 0, l.width, l.height), 
            d.setFillStyle("rgba(0,0,0,0)"), d.clearRect(s.x, s.y, s.w, s.h), d.setStrokeStyle("white"), 
            d.setLineWidth(2), d.beginPath(), d.moveTo(s.x, s.y), d.lineTo(s.x + s.w, s.y), 
            d.lineTo(s.x + s.w, s.y + s.h), d.lineTo(s.x, s.y + s.h), d.lineTo(s.x, s.y), d.stroke(), 
            d.closePath(); else {
                var v = c ? "white" : "red";
                d.setStrokeStyle(v), d.setLineWidth(2), d.beginPath();
                for (var w = 0, f = p.length; w < f; w++) {
                    var x = p[w];
                    0 == w ? d.moveTo(x.x, x.y) : d.lineTo(x.x, x.y);
                }
                var m = p[0];
                d.lineTo(m.x, m.y), d.stroke(), d.closePath();
            }
            var y = "rectangle" == n ? "rect" : "circle";
            if (d.setFillStyle("white"), d.setStrokeStyle("white"), "circle" == y) for (var D = 0, u = g.length; D < u; D++) {
                var I = g[D];
                d.beginPath(), d.arc(I.x, I.y, 10, 0, 2 * Math.PI, !0), d.fill(), d.closePath();
            } else "rect" == y && (d.setLineWidth(3), d.beginPath(), d.moveTo(s.x - 1.5, s.y - 1.5 + 20), 
            d.lineTo(s.x - 1.5, s.y - 1.5), d.lineTo(s.x - 1.5 + 20, s.y - 1.5), d.moveTo(s.x + 1.5 + s.w - 20, s.y - 1.5), 
            d.lineTo(s.x + 1.5 + s.w, s.y - 1.5), d.lineTo(s.x + 1.5 + s.w, s.y - 1.5 + 20), 
            d.moveTo(s.x + 1.5 + s.w, s.y + 1.5 + s.h - 20), d.lineTo(s.x + 1.5 + s.w, s.y + 1.5 + s.h), 
            d.lineTo(s.x + 1.5 + s.w - 20, s.y + 1.5 + s.h), d.moveTo(s.x - 1.5, s.y + 1.5 + s.h - 20), 
            d.lineTo(s.x - 1.5, s.y + 1.5 + s.h), d.lineTo(s.x - 1.5 + 20, s.y + 1.5 + s.h), 
            d.stroke(), d.closePath());
            d.draw();
        }, r.setupMoveItem = function(r, i, h, n) {
            var l = o, p = l.data.cropperData, g = l.data.cropperMovableItems, c = p.left, d = p.top, s = p.mode, v = a.getAdjustSize(t, e, h.width, h.height);
            if (1 == i.length) {
                var w = i[0], f = w.clientX, x = w.clientY;
                f -= c, x -= d, g[r].x = f, g[r].y = x, f = f < 0 ? 0 : f > v.width ? v.width : f, 
                x = x < 0 ? 0 : x > v.height ? v.height : x, g[r].x = f, g[r].y = x, "rectangle" == s && ("topleft" == r ? (g.bottomleft.x = f, 
                g.topright.y = x) : "topright" == r ? (g.bottomright.x = f, g.topleft.y = x) : "bottomleft" == r ? (g.topleft.x = f, 
                g.bottomright.y = x) : "bottomright" == r && (g.topright.x = f, g.bottomleft.y = x)), 
                l.drawLines(g, h, function(t) {
                    n && n(g, t);
                });
            }
        }, r.moveEvent = function(t) {
            var a = o, e = t.currentTarget.dataset.key, r = a.data.cropperChangableData.originalSize;
            a.setupMoveItem(e, t.changedTouches, {
                path: a.data.cropperData.imageInfo.path,
                width: r.width,
                height: r.height
            });
        }, r.endEvent = function(t) {
            console.log("end");
            var a = o, e = (a.data.cropperData, a.data.cropperMovableItems, a.data.cropperChangableData), r = e.originalSize, i = t.currentTarget.dataset.key;
            a.setupMoveItem(i, t.changedTouches, {
                path: a.data.cropperData.imageInfo.path,
                width: r.width,
                height: r.height
            }, function(t, o) {
                e.canCrop = o, a.setData({
                    cropperChangableData: e,
                    cropperMovableItems: t
                });
            });
        };
    }
};