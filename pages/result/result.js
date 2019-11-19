import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        nowindex: 0,
        botBtnTxt:'我也去整蛊',
        qrcodeArr: [

            {
                id: 0,
                icon: '/assets/qrType1.png',
            },

            {
                id: 1,
                icon: '/assets/qrType2.png',
            },

            {
                id: 2,
                icon: '/assets/qrType3.png',
            },

            {
                id: 3,
                icon: '/assets/qrType4.png',
            }
        ],
    },

    onLoad: function(options) {
        if (options && options.id){
            this.contentid = options.id;
            this.getContent();
        }
    },

    onShow: function() {

    },

    onShareAppMessage: function() {
        return util.shareObj;
    },

    //获取内容
    getContent: function() {
        let _this = this;
        let url = loginApi.domin + '/home/index/chuanhuatong_content';
        loginApi.requestUrl(app, url, "POST", {
            'buid': wx.getStorageSync('u_id'),
            "id": this.contentid,
        }, function(res) {
            if(res.type==1){
                _this.setData({
                    correct:1,
                    botBtnTxt: '我也去传话',
                    content:res.content,
                })
            }else{
                _this.setData({
                    correct: 0,
                })
            }
            
        })
    },

    navhomeindex:function(){
        wx.navigateBack({
            delta: 10
        })
    },

    // 收集formid
    formSubmit: function (e) {
        util.formSubmit(app, e);
    },

})