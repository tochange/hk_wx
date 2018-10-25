Page({
    data: {},
    onLoad: function(n) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    copyContact: function() {
        wx.setClipboardData({
            data: "decai0518",
            success: function() {
                wx.showToast({
                    title: "已复制",
                    icon: "success"
                });
            }
        });
    }
});