import loginApi from '../../utils/login.js'
import util from '../../utils/util.js'
const app = getApp();

Page({

    data: {
        nowindex:0,
        qrcodeArr: [
            {
                id: 0,
                icon: '/assets/qrType4.png',
                img:'/assets/imgqrType4.png'
            },
            
            {
                id: 1,
                icon: '/assets/qrType2.png',
                img: '/assets/imgqrType2.png'
            },
            {
                id: 2,
                icon: '/assets/qrType3.png',
                img: '/assets/imgqrType3.png'
            },
            {
                id: 3,
                icon: '/assets/qrType1.png',
                img: '/assets/imgqrType1.png'
            },
            
        ],
    },

    onLoad: function(options) {

    },

    onShow: function() {

    },

    onShareAppMessage: function() {
        return util.shareObj;
    },

    generateQrcode1: function(e) {
        let id = e.currentTarget.dataset.id;
        console.log(id);
        if (id == this.data.nowindex){
            return;
        }
        this.setData({
            nowindex:id,
        });
    },


    // 绘制Canvas
    drawcanvs: function () {
        wx.showLoading({
            title: '正在保存...',
            mask: true,
        });
        let _this = this;
        let ctx = wx.createCanvasContext('canvas');
        let canvasImg = this.data.qrcodeArr[this.data.nowindex].img;
        let qrcode = app.globalData.qrcode;
        wx.getImageInfo({
            src: canvasImg,
            success: function (res) {
                _this.setData({
                    bgimgH: res.height,
                    bgimgW: res.width,
                });
                ctx.drawImage(canvasImg, 0, 0, res.width, res.height);
                wx.getImageInfo({
                    src: qrcode,
                    success: function (res2) {
                        ctx.drawImage(res2.path, 476, 39, 120, 120);
                        ctx.draw();
                        setTimeout(function () {
                            wx.hideLoading();
                            _this.showOffRecord();
                        }, 1000)
                    }
                })



            }
        })
    },

    // 生成临时图片
    showOffRecord: function () {
        let _this = this;
        wx.showLoading({
            title: '正在保存...',
            mask: true,
        });
        wx.canvasToTempFilePath({
            destWidth: this.data.bgimgW * 2,
            destHeight: this.data.bgimgH * 2,
            canvasId: 'canvas',
            success: function (res) {
                wx.hideLoading();
                _this.saveCanvas(res);
            }
        })
    },

    // 保存图片
    saveCanvas: function (res) {
        wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {
                wx.showModal({
                    title: '保存成功',
                    content: `记得分享哦~`,
                    showCancel: false,
                    success: function (data) {
                        wx.previewImage({
                            urls: [res.tempFilePath]
                        })
                    }
                });
            },
            fail: function () {
                wx.previewImage({
                    urls: [res.tempFilePath]
                })
            }
        })
    },

    // 收集formid
    formSubmit: function (e) {
        util.formSubmit(app, e);
    },

})