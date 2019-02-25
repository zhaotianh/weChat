// pages/me/me.js
const app = getApp();
import Toast from '../../dist/toast/toast';
var intervalLogin;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:true,
    height:0,
    width:0,
    maskFlag:false,
    login:false,
    loginImg:'',
    name:'未登录',
    phone:'未维护'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    intervalF();
    //轮询检测是否在主页外进行登录
    intervalLogin = setInterval(function () {
      intervalF();
    }, 2000)
    function intervalF(){
      if (app.globalData.otherLogin) {
        wx.getStorage({
          key: 'phone',
          success(data) {
            that.setData({
              phone: data.data,
              login: true
            })
          },
        })
        wx.getStorage({
          key: 'info',
          success(data) {
            that.setData({
              loginImg: JSON.parse(data.data).avatarUrl,
              name: JSON.parse(data.data).nickName,
              login: true
            })
          }
        })
        clearInterval(intervalLogin);
      }
    }
    //获取屏幕基本信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth
        })
      },
    })
  },
  bindGetUserInfo(e) {  //点击登录
    var that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.setStorage({
        key: 'info',
        data: JSON.stringify(e.detail.userInfo)
      })
      Toast.loading({
        mask: true,
        message: '微信登录中'
      });
      wx.getSetting({
        success(res) {
          wx.login({
            success: function (data) {
              if (data.code) {
                //微信同时获取微信信息
                wx.request({
                  url: app.globalData.api +'wxapp_authorize',
                  method: 'post',
                  header: {
                    client_id: '65E1FA8A-193E-4C79-B435-9A93BB4DB7D9',
                    client_secret: '45D7FB8B-299C-4A4F-AF18-3D4D08424A7E',
                    code: data.code
                  },
                  success(res) {
                    app.globalData.open = res.data.data.openId;
                    app.globalData.token = res.data.data.access_token;
                    if (res.data.data.binding_status) { //绑定状态
                      setTimeout(function () {
                        app.toast("登录成功!");
                        clearInterval(intervalLogin)
                        app.globalData.otherLogin = true;
                        wx.setStorage({
                          key: 'open',
                          data: res.data.data.openId
                        })
                        wx.setStorage({
                          key: 'token',
                          data: res.data.data.access_token
                        })
                        wx.setStorage({
                          key: 'phone',
                          data: res.data.data.phone
                        })
                        wx.getStorage({
                          key: 'phone',
                          success(data) {
                            that.setData({
                              phone: data.data
                            })
                          }
                        })
                        wx.getStorage({
                          key: 'info',
                          success(data) {
                            that.setData({
                              loginImg: JSON.parse(data.data).avatarUrl,
                              name: JSON.parse(data.data).nickName,
                              login: true
                            })
                          }
                        })
                      }, 1000)
                    } else {
                      setTimeout(function () {
                        app.toast("您好，需要您绑定手机号,即将为您跳转");
                        setTimeout(function () {
                          wx.navigateTo({
                            url: "../phone/phone"
                          })
                        }, 800)
                      }, 1000)
                      //跳转绑定页面
                    }
                  },
                  fail(res) {
                    app.alert('数据接口出现问题', 2000, 'red');
                  }
                })
              }
            },
            fail(res) {
              app.toast("登录失败获取code失败");
            }
          })
        },
        fail(res) {
          app.toast("授权失败");
        }
      })
    }
  },
  supply(){
    if(this.data.login){
      wx.navigateTo({
        url: './mySupply/mySupply',
      })
    }else{
      app.toast('未登录,请先点头像图标登录')
    }
  },
  buy() {
    if (this.data.login) {
      wx.navigateTo({
        url: './myBuy/myBuy',
      })
    } else {
      app.toast('未登录,请先点头像图标登录')
    }
  },
  fBbuy() {
    if (this.data.login) {
      wx.navigateTo({
        url: '../Release/buy/buy',
      })
    } else {
      app.toast('未登录,请先点头像图标登录')
    }
  },
  fBsupply() {
    if (this.data.login) {
      wx.navigateTo({
        url: '../Release/supply/supply',
      })
    } else {
      app.toast('未登录,请先点头像图标登录')
    }
  },
  fBShouc() {
    if (this.data.login) {
      wx.navigateTo({
        url: './myCollection/myCollection',
      })
    } else {
      app.toast('未登录,请先点头像图标登录')
    }
  },
  fBGzhu() {
    if (this.data.login) {
      wx.navigateTo({
        url: '../follow/follow',
      })
    } else {
      app.toast('未登录,请先点头像图标登录')
    }
  },
  show(){
    this.setData({
      maskFlag:true
    })
  },
  close() {
    this.setData({
      maskFlag: false
    })
  },
  phone(){
    wx.makePhoneCall({
      phoneNumber: '19963985873' // 仅为示例，并非真实的电话号码
    })
  },
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: '19963985873',
      success: function (res) {
        wx.showToast({
          title: '微信号复制成功',
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '苗源小程序',
      path: '/pages/home/home',
      imageUrl: 'https://miaoyuan-img.oss-cn-beijing.aliyuncs.com/MicroApp/shareImg.png',
      success: function (res) {
        // app.toast(Json.stringify(res))
      },
      fail: function (res) {
        // app.toast(Json.stringify(res))

      }
    }
  }
})