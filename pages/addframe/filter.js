var a = wx.createCanvasContext("filterCanvas"), t = {
    get: function(a, t) {
        setTimeout(function() {
            wx.canvasToTempFilePath({
                canvasId: "filterCanvas",
                x: 0,
                y: 0,
                width: a.width,
                height: a.height,
                success: function(a) {
                    t && t(a.tempFilePath);
                }
            });
        }, 500);
    },
    add: function(e) {
        var n = e.image, r = e.type, i = e.value || 1, s = e.callback;
        a.clearRect(0, 0, n.width, n.height), a.drawImage(n.path, 0, 0, n.width, n.height), 
        a.draw(!1, function() {
            setTimeout(function() {
                wx.canvasGetImageData({
                    canvasId: "filterCanvas",
                    x: 0,
                    y: 0,
                    width: n.width,
                    height: n.height,
                    success: function(a) {
                        var e = void 0;
                        switch (r = 1 === r.length ? "0" + r : r) {
                          case "01":
                            e = t.antiColor(a.data);
                            break;

                          case 1:
                            return void t.get(n, s);

                          case 2:
                            e = t.grayLevel(a.data);
                            break;

                          case 3:
                            e = t.brightness(a.data, i / 20);
                            break;

                          case "04":
                            e = t.retro(a.data);
                            break;

                          case "05":
                            e = t.mask(a.data);
                            break;

                          case "06":
                            e = t.transparency(a.data);
                            break;

                          case "07":
                            e = t.brightness(a.data, 3);
                            break;

                          case "08":
                            e = t.brightness(a.data, -3);
                        }
                        wx.canvasPutImageData({
                            canvasId: "filterCanvas",
                            x: 0,
                            y: 0,
                            width: n.width,
                            height: n.height,
                            data: e,
                            success: function(a) {
                                t.get(n, s);
                            }
                        });
                    }
                });
            }, 300);
        });
    },
    antiColor: function(a) {
        for (var t = 0; t < a.length; t += 4) a[t] = 255 - a[t], a[t + 1] = 255 - a[t + 1], 
        a[t + 2] = 255 - a[t + 2];
        return a;
    },
    grayLevel: function(a) {
        for (var t = 0, e = 0; e < a.length; e += 4) t = (a[e] + a[e + 1] + a[e + 2]) / 3, 
        a[e] = t, a[e + 1] = t, a[e + 2] = t;
        return a;
    },
    brightness: function(a, t) {
        for (var e = 30 * (t = t || 1), n = 50 * t, r = 0; r < a.length; r += 4) a[r] += e, 
        a[r + 1] += n, a[r + 2] += n;
        return a;
    },
    retro: function(a) {
        for (var t = void 0, e = void 0, n = void 0, r = 0; r < a.length; r += 4) t = a[r], 
        e = a[r + 1], n = a[r + 2], a[r] = .3 * t + .4 * e + .3 * n, a[r + 1] = .2 * t + .6 * e + .2 * n, 
        a[r + 2] = .4 * t + .3 * e + .3 * n;
        return a;
    },
    mask: function(a) {
        for (var t = 0, e = 0; e < a.length; e += 4) t = a[e] + a[e + 1] + a[e + 2] / 3, 
        a[e] = 0, a[e + 1] = t, a[e + 2] = t;
        return a;
    },
    transparency: function(a) {
        for (var t = 0; t < a.length; t += 4) a[t + 3] *= .5;
        return a;
    }
};

module.exports = t;