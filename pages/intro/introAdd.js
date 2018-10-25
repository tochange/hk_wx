var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../utils/verify.js"));

getApp();

Page({
    data: {},
    onLoad: function(e) {
        this.verify = this.wxVerify({
            artName: {
                required: !0,
                minlength: 2,
                maxlength: 10
            },
            artType: {
                required: !0,
                tel: !0
            },
            artYear: {
                required: !0,
                minlength: 2,
                maxlength: 100
            },
            artAuthor: {
                required: !0,
                minlength: 2,
                maxlength: 100
            },
            artWidth: {
                required: !0,
                minlength: 2,
                maxlength: 100
            },
            artHeight: {
                required: !0,
                minlength: 2,
                maxlength: 100
            }
        }, {
            artName: {
                required: "请输入作品名称"
            },
            artType: {
                required: "请输入艺术类型"
            },
            artYear: {
                required: "请输入创作年份"
            },
            artAuthor: {
                required: "请输入作者名称"
            },
            artWidth: {
                required: "请输入作品宽度"
            },
            artHeight: {
                required: "请输入作品高度"
            }
        });
    },
    onReady: function() {},
    formSubmit: function(e) {
        var r = e.detail.value;
        if (console.log(r), !this.verify.checkForm(e)) {
            var t = this.verify.errorList[0];
            return wx.showToast({
                title: t.msg,
                icon: "",
                mask: !0
            }), !1;
        }
    },
    onShareAppMessage: function() {},
    wxVerify: function(r, t) {
        return new e.default(r, t);
    }
});