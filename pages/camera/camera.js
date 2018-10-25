Page({
    data: {
        device_position: "back",
        sceneHeight: 0,
        height: 950
    },
    onLoad: function(e) {
        var t = this;
        e.height && e.type && (t.data.sceneHeight = parseFloat(e.height));
    },
    onReady: function() {
        var e = this;
        wx.getSystemInfo({
            success: function(t) {
                console.log(t);
                var o = 750 * t.windowHeight / t.windowWidth - 70 - 192;
                e.setData({
                    height: o
                });
            }
        });
    },
    takePhoto: function() {
        var e = this;
        wx.showLoading({
            title: "处理中..."
        }), wx.createCameraContext().takePhoto({
            quality: "normal",
            success: function(t) {
                var o = t.tempImagePath;
                if (console.log(o), e.data.sceneHeight) return wx.setStorageSync("tempSceneFilePaths", o), 
                wx.hideLoading(), void wx.navigateTo({
                    url: "/pages/cutscene/index?from=camera"
                });
                wx.setStorageSync("tempFilePaths", o), wx.hideLoading(), wx.navigateTo({
                    url: "/pages/cut/cut"
                });
            }
        });
    },
    error: function(e) {
        console.log(e.detail);
    },
    choosePhoto: function() {
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album" ],
            success: function(e) {
                var t = e.tempFilePaths[0];
                console.log(t), wx.setStorageSync("tempFilePaths", t), wx.navigateTo({
                    url: "/pages/cut/cut"
                });
            }
        });
    },
    choosePhoto111: function() {
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album" ],
            success: function(e) {
                var t = e.tempFilePaths[0];
                if (console.log(t), that.data.sceneHeight) return wx.setStorageSync("tempSceneFilePaths", t), 
                wx.hideLoading(), void wx.navigateTo({
                    url: "/pages/cutscene/index?from=camera"
                });
                wx.setStorageSync("tempFilePaths", t), wx.navigateTo({
                    url: "/pages/cut/cut"
                });
            }
        });
    },
    reverse: function() {
        "back" == this.data.device_position ? this.setData({
            device_position: "front"
        }) : this.setData({
            device_position: "back"
        });
    }
});