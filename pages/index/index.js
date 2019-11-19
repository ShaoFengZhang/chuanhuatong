import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp()
Page({

    data: {

        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userNickName: '',
        userMessage: '',
    },

    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        };
        this.userNickName = '';
        this.userMessage = '';
        this.juziid=null;
        if (options && options.scene) {
            util.loading();
            console.log('SCENE', options);
            let scene = decodeURIComponent(options.scene);
            this.juziid = scene.split('&')[0];
            this.juzitype = scene.split('&')[1];
            wx.hideLoading();
        };
    },

    onShow: function () {

    },

    // 分享
    onShareAppMessage: function () {
        return util.shareObj;
    },

    inputBindInput: function (e) {
        this.userNickName = e.detail.value;

    },

    inputBindBlur: function () {
        this.setData({
            userNickName: this.userNickName
        });
    },

    textBindInput: function (e) {
        this.userMessage = e.detail.value;
        this.setData({
            userMessage: e.detail.value
        })
    },

    textBindBlur: function () {
        this.setData({
            userMessage: this.userMessage
        });
    },

    // 检查文字
    judgeTextFunc: function () {
        if (!util.check(this.data.userNickName) || !util.check(this.data.userMessage)) {
            util.toast("请输入有效内容", 1200)
            return;
        };

        this.uploadTxt();
    },

    // 上传文字
    uploadTxt:function(){
        let _this = this;
        let url = loginApi.domin + '/home/index/chuanhuatong';
        loginApi.requestUrl(app, url, "POST", {
            "uid":wx.getStorageSync('u_id'),
            "text": this.data.userMessage,
            "name": this.data.userInfo.nickName,
            "bname": this.data.userNickName,
            "photo": this.data.userInfo.avatarUrl,
        }, function (res) {
            app.globalData.qrcode = res.qcode;
            _this.navQrCode();
        })
    },

    jujueClick:function(){
        util.toast("我们需要您的授权哦亲~")
    },

    //获取用户头像信息
    onGotUserInfo: function (e) {
        if (!e.detail.userInfo) {
            util.toast("我们需要您的授权哦亲~", 1200)
            return
        }
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
        let iv = e.detail.iv;
        let encryptedData = e.detail.encryptedData;
        let session_key = app.globalData.session_key;
        loginApi.checkUserInfo(app, e.detail, iv, encryptedData, session_key);
        if (this.juziid){
            wx.navigateTo({
                url: `/pages/result/result?id=${this.juziid}`,
            })
        }
    },

    // 收集formid
    formSubmit: function (e) {
        util.formSubmit(app, e);
    },

    catchtap: function () { },

    // 跳转二维码页面
    navQrCode: function () {
        wx.navigateTo({
            url: '/pages/qrCode/qrCode',
        })
    },
})