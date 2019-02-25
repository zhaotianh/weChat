// 引入腾讯地图做定位
var QQMapWX = require('../../js/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const app = getApp();  //引入全局变量
import Toast from '../../dist/toast/toast';
var intervalLog;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [  //轮播图假数据
      '../../images/banner2.png',
      '../../images/banner.png',
      '../../images/banner1.png',
    ],
    info:true, //判断是否有信息
    supplyList:[], //供应数组
    buyList:[],//求购数组
    newList:[],//新闻数组
    width: app.globalData.width, //屏幕宽度
    nowTime: new Date().getTime(),  //当前时间的毫秒数
    homeFlag:true,  //判断是否在主页登陆
    border:'0.5rpx solid rgba(255,255,255,0)',  //滚动时悬浮框边框
    imgSearch:true,  //滚动时搜索的图片变量
    background:"rgba(255,255,255,0)",  //滚动时悬浮框背景色
    backgroundInput:"rgba(255,255,255,0.9)",  //滚动时搜索框颜色
    key:0,  //key值
    loginFlag:true,  //是否登陆
    loginImg:'',  //登陆图片
    show:false,  //是否显示
    // contenttt:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    qqmapsdk = new QQMapWX({  //腾讯地图的key值
      key: 'U6DBZ-X7CWJ-Z2NFH-K3SLN-JNHLZ-ZGBYU'
    });
    wx.getLocation({  //微信api获取当前设备的经纬度
      type: 'wgs84',
      success(res) {
        qqmapsdk.reverseGeocoder({
          //位置坐标，默认获取当前位置，非必须参数
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {//成功后的回调
            // that.setData({
            //   contenttt: JSON.stringify(res)
            // })
            //你解析地址  存储在全局变量中
            app.globalData.adress = res.result.address_component.province + " " + res.result.address_component.city
          },
          fail: function (error) {
            // app.toast("用户已拒绝获取");
          },
        })
      },
      fail(res) {
        // app.toast('用户已拒绝获取');
      }
    })
    intervalF();
    //轮询检测是否在主页外进行登录
    intervalLog = setInterval(function(){
      intervalF()
    },1000)
    function intervalF(){
      if (app.globalData.otherLogin) {  //判断用户是否在其他页面登陆
        wx.getStorage({  //获取用户的info值
          key: 'info',
          success(data) {
            that.setData({
              loginImg: JSON.parse(data.data).avatarUrl,
              loginFlag: false
            })
          }
        })
        clearInterval(intervalLog);
      }
    }
    //验证登录是否失效
    wx.getStorage({
      key: 'token',
      success(res) {
        if (res.data) {// 去检测token
          wx.request({
            url: app.globalData.api +'party/buys?pageNumber=1&pageSize=1', 
            header: {
              Authorization:"Bearer "+res.data,
              device_id: 'platform',
            },
            success(res) {
              if (res.data.success){
                //登录状态中
                wx.getStorage({ //获取用户的info值
                  key: 'info',
                  success(data) {
                    that.setData({
                      loginImg: JSON.parse(data.data).avatarUrl,  //头像
                      loginFlag:false
                    })
                  }
                })
                clearInterval(intervalLog);  //清除轮询
                app.globalData.otherLogin = true;  //预示着用户已经登陆
              }else{
                //非登录状态  token失效 删除以前缓存的 token  和用户信息
                wx.removeStorage({
                  key: 'info',
                })
                wx.removeStorage({
                  key: 'token',
                })
                wx.removeStorage({
                  key: 'phone',
                })
                wx.removeStorage({
                  key: 'open',
                })
              }
            }
          })
        } 
      }
    })
    //供求
    this.dataList();
  },//获取主页用的数据函数
  dataList(){
    var that = this;
    wx.request({
      url: app.globalData.api +'index', //  主页数据接口链接
      header: {
        client_id: '26A8B1CA-F6CB-4F5C-B985-BA4388953B71',
        client_secret: '862F4560-9ED6-4481-AB76-C12C8DB377B6',
        device_id: 'platform'
      },
      success(res) {
        wx.hideNavigationBarLoading()
        var supplyData = res.data.data.supplies;
        for (var a = 0; a < supplyData.length; a++) {//苹果手机转换好看描述  -  会报NAN
          var Time = parseInt((that.data.nowTime - (new Date(supplyData[a].lastModifiedDate.replace(/\-/g, "/"))).getTime()) / 1000);
          if (Time >= 86400) {
            supplyData[a].buyTime = parseInt(Time / 86400) + "天前";
          }
          if (Time >= 3600 && Time < 86400) {
            supplyData[a].buyTime = parseInt(Time / 3600) + "小时前";
          }
          if (Time < 3600) {
            if (parseInt(Time / 60) <=0) {
              supplyData[a].buyTime = "1分钟前";
            }else{
              supplyData[a].buyTime = parseInt(Time / 60) + "分钟前";
            }
          }
        }
        var buyData = res.data.data.buys;
        for (var a = 0; a < buyData.length; a++) {
          var Time = parseInt((that.data.nowTime - (new Date(buyData[a].lastModifiedDate.replace(/\-/g, "/"))).getTime()) / 1000);
          if (Time >= 86400) {
            buyData[a].buyTime = parseInt(Time / 86400) + "天前";
          }
          if (Time >= 3600 && Time < 86400) {
            buyData[a].buyTime = parseInt(Time / 3600) + "小时前";
          }
          if (Time < 3600) {
            if (parseInt(Time / 60) <= 0) {
              buyData[a].buyTime = "1分钟前";
            } else {
              buyData[a].buyTime = parseInt(Time / 60) + "分钟前";
            }
          }
        }
        that.setData({   //填充数据
          supplyList: that.data.supplyList.concat(res.data.data.supplies),
          buyList: that.data.buyList.concat(res.data.data.buys),
          newList: that.data.newList.concat(res.data.data.news),
          homeFlag: false
        })
      },
      fail(res) {
        that.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  onClose() { //关闭遮罩
    this.setData({ show: false });
  },
  showFb() {  //显示发布按钮
    Toast.clear();
    this.setData({ show: true });
  },
  bindGetUserInfo(e) {  //点击登录
    var that = this;
    if (e.detail.errMsg =="getUserInfo:ok"){  //微信api获取登录权限
      wx.setStorage({  //建立本地缓存  info
        key: 'info',
        data: JSON.stringify(e.detail.userInfo)
      })
      Toast.loading({  //显示获取权限是加载动画
        mask: true,
        message: '微信登录中'
      });
      wx.getSetting({
        success(res) {
          wx.login({
            success: function (data) {
              if (data.code) {
                //微信同时获取微信信息code
                wx.request({
                  url: app.globalData.api +'wxapp_authorize',
                  method: 'post',
                  header: {
                    client_id: '65E1FA8A-193E-4C79-B435-9A93BB4DB7D9',
                    client_secret: '45D7FB8B-299C-4A4F-AF18-3D4D08424A7E',
                    code: data.code
                  },
                  success(res) {
                    app.globalData.open = res.data.data.openId;  //全局变量存储openid 和 token
                    app.globalData.token = res.data.data.access_token;
                    if (res.data.data.binding_status) { //绑定状态
                      app.globalData.otherLogin = true;
                      clearInterval(intervalLog);
                      setTimeout(function () {  //异步缓存  openid   token   phone  和用户信息
                        app.toast("登录成功!");
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
                          key: 'info',
                          success(data) {
                            that.setData({
                              loginImg: JSON.parse(data.data).avatarUrl,
                              loginFlag: false
                            })
                          }
                        })
                      }, 1000)
                    } else {
                      setTimeout(function () {    //无相关信息  提示绑定手机号并跳转
                        app.toast("您好，需要您绑定手机号,即将为您跳转");
                        setTimeout(function () {
                          wx.navigateTo({
                            url: "../phone/phone"
                          })
                        }, 800)
                      }, 1000)

                      //跳转绑定页面
                      // console.log('跳转绑定页面')
                    }
                  },
                  fail(res) {
                    that.alert('数据接口出现问题', 2000, 'red');
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
  alert(text, time, color) {   //错误信息提示
    Notify({
      text: text,
      duration: time,
      selector: '#van-notify',
      backgroundColor: color
    });
  },
  supplyUrl(e){  //供应详情跳转链接
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.proid+'&type=supply'
    })
  },
  buyUrl(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.proid + '&type=buy'
    })
  },
  home() {
    wx.switchTab({
      url: '../home/home',
    })
  },
  page(){
    wx.navigateTo({
      url: '../page/page',
    })
  },
  supply() {
    wx.switchTab({
      url: '../supply/supply',
    })
  },
  goShop(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.shopid + '&type=shop'
    })
  },
  buy() {
    wx.switchTab({
      url: '../buy/buy',
    })
  },
  me() {
    wx.switchTab({ 
      url: '../me/me',
    })
  },
  miao() {
    wx.switchTab({
      url: '../miao/miao',
    })
  },
  fBsupply() {//发布供应
    if (!this.data.loginFlag) {
      this.setData({ show: false });
      wx.navigateTo({
        url: '../Release/supply/supply',
      })
    } else {
      app.toast('未登录,请先点登录图标登录')
    }
  },
  fBbuy() {//发布供应
    if (!this.data.loginFlag) {
      this.setData({ show: false });
      wx.navigateTo({
        url: '../Release/buy/buy',
      })
    } else {
      app.toast('未登录,请先点登录图标登录')
    }
  },
  fBmiao() {//发布供应
    if (!this.data.loginFlag) {
      this.setData({ show: false });
      wx.navigateTo({
        url: '../Release/miao/miao?frompage=home',
      })
    } else {
      app.toast('未登录,请先点登录图标登录')
    }
  },
  search() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  new() {
    wx.navigateTo({
      url: '../new/new',
    })
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
    var that = this;
    that.setData({
      supplyList: [],
      buyList: [],
      newList: [],
      homeFlag:true
    })
    this.dataList();
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    wx.showNavigationBarLoading()
    wx.setBackgroundColor({
      backgroundColorTop: '#000000' // 窗口的背景色为白色
    })
    wx.stopPullDownRefresh()
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
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    if (e.scrollTop > 10 && e.scrollTop < 97) {  //半透明状态
      this.setData({ background: "rgba(255, 255, 255, 0.6)" })
    } else if (e.scrollTop > 100) {
      this.setData({
        backgroundInput: "#eee",
        background: "rgba(255, 255, 255,1)",
        imgSearch: false,
        border: '0.5rpx solid #eee'
      })
    } else if (e.scrollTop < 10) {   //透明状态
      this.setData({
        background: "rgba(255, 255, 255,0)",
        border: '0.5rpx solid rgba(255,255,255,0)',
        imgSearch: true,
        backgroundInput: "rgba(255,255,255,0.9)",
      })
    }
  },
})