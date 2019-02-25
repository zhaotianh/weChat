// pages/miao/miao.js
const app = getApp();
var addressList = require('../../js/address.js');
import Toast from '../../dist/toast/toast';
var intervalLogi;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.height,  //屏幕高度
    loginImg:'',   //登陆图片
    name:'',   //名称
    login:false,  //判断是否登陆
    loginImg: '',  //登陆图片
    name: '未登录', 
    background: "rgba(255, 255, 255,0)",  //滚动时背景颜色
    imgSearch: true,  
    margin:"30rpx 0",//滚动时边距
    lastTime:"",  //接口请求，数据的最后更新时间
    area: '全国',  //地区默认全国
    noHave:false, //无数据
    loading:true,  //加载动画
    miaoList:[],   //苗有信息集合
    nowTime: new Date().getTime(),   //获取当前时间
    serollFlag:false,   //滚动变量
    show:false,  //是否显示
    ind:0,  //数据自定义属性
    bannerImg:[],  //banner的图片
    contText:'',  //内容文字
    addressListData: null,   //地址数据
    adressDiv: false,  //地址选择器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({//地址选择器赋值
      addressListData: addressList.default
    })
    intervalF();
    setTimeout(function(){
      that.setData({
        serollFlag: true  //到达底部关闭伪懒加载
      })
    },1000)
    //轮询检测是否在主页外进行登录
    intervalLogi = setInterval(function () {
      intervalF();
    }, 2000)
    function intervalF(){
      if (app.globalData.otherLogin) { //判断是否在其他页面登陆
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
        clearInterval(intervalLogi);
      }
    }
    if (that.data.area=="全国"){
      this.listData(that.data.lastTime,"");
    }
  },
  listData(lastTime, area){//苗友数据刷新
    var that = this;
    wx.request({
      url: app.globalData.api +'circles?pageSize=10', // 苗有后台接口
      header: {
        client_id: '26A8B1CA-F6CB-4F5C-B985-BA4388953B71',
        client_secret: '862F4560-9ED6-4481-AB76-C12C8DB377B6',
        device_id: 'platform'
      },
      data:{
        pageSize:20,
        lastTime: lastTime,
        area: area
      },
      success(res) {
        wx.hideNavigationBarLoading();//隐藏下拉动画
        var dataList = res.data.data;
        // console.log(res.data.data)
        //请求数据与承载数据都为空的时候显示无数据
        if (dataList.length == 0 && that.data.miaoList.length==0){
          that.setData({
            noHave:true,
            loading:false
          })
        }else{
          that.setData({
            noHave: false,
            loading: true
          })
        }
        //请求数据<20承载数据不为空的时候表示已经获取所有数据
        if (dataList.length < 20 && that.data.miaoList.lenght != 0) {
          that.setData({
            loading: false
          })
        }
        //数据>0时正常显示
        if (dataList.length>0){
          for (var a = 0; a < dataList.length; a++) {   //循环每个数据  添加时间属性
            var Time = parseInt((that.data.nowTime - (new Date(dataList[a].lastTime.replace(/\-/g, "/"))).getTime()) / 1000);
            if (Time >= 86400) {
              dataList[a].buyTime = parseInt(Time / 86400) + "天前";
            }
            if (Time >= 3600 && Time < 86400) {
              dataList[a].buyTime = parseInt(Time / 3600) + "小时前";
            }
            if (Time < 3600) {
              if (parseInt(Time / 60) <= 0) {
                dataList[a].buyTime = "1分钟前";
              } else {
                dataList[a].buyTime = parseInt(Time / 60) + "分钟前";
              }
            }
            if (a<3) {  //模拟懒加载使用  只为数据前2条设置
              dataList[a].imgFlag = false;   //图片模拟懒加载使用
            } else {
              dataList[a].imgFlag = true;   //图片模拟懒加载使用
            }
          }
          that.setData({
            miaoList: that.data.miaoList.concat(dataList),
          })
        }
      },
      fail(res) {
        this.alert('数据接口出现问题', 2000, 'red');
      }
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
                        app.globalData.otherLogin = true;
                        clearInterval(intervalLogi)
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
              app.toast("登录失败获取code失败")
            }
          })
        },
        fail(res) {
          app.toast("授权失败");
        }
      })
    }
  },
  onClose() {  //关闭相关模板
    this.setData({ show: false });
  },
  open(e){   //打开相关模板
    this.setData({ 
      ind: e.currentTarget.dataset.key,
      bannerImg: e.currentTarget.dataset.img,
      contText: e.currentTarget.dataset.text,
      show: true
    });
  },
  miaoFb(){  //苗友发布
    if (!this.data.login){
      app.toast('未登录，请点击头像图标登录！')
    }else{
      wx.navigateTo({
        url: '../Release/miao/miao',
      })
    }
  },
  miaoFriend() {  //苗友
    app.toast('暂未开放此功能！')
    // if (!this.data.login) {
    //   app.toast('未登录，请点击头像图标登录！')
    // } else {

    // }
  },
  //地址
  openadress() {
    this.setData({
      adressDiv: true
    })
  },
  closeadress() {
    this.setData({
      adressDiv: false
    })
  },
  conadress(e) {
    var that = this;
    this.setData({
      area: e.detail.detail.province + " " + e.detail.detail.city,
      miaoList:[],
      adressDiv: false
    })
    // console.log(that.data.area)
    this.listData(that.data.lastTime, that.data.area);
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
      miaoList: [],
      loading: true,
      lastTime:""
    })
    
    if (that.data.area == "全国") {
      that.listData(that.data.lastTime, "");
    }else{
      that.listData(that.data.lastTime,that.data.area);
    }
    // console.log(that.data.area)
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
    var that = this;
    that.setData({
      serollFlag: false  //到达底部启动伪懒加载
    })
    if (that.data.area == "全国") {
      that.listData(that.data.miaoList[that.data.miaoList.length - 1].lastTime,"");
    }else{
      that.listData(that.data.miaoList[that.data.miaoList.length - 1].lastTime, that.data.area);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '苗源小程序',
      path: '/pages/home/home',
      imageUrl:'https://miaoyuan-img.oss-cn-beijing.aliyuncs.com/MicroApp/shareImg.png',
      success: function (res) {
        // app.toast(Json.stringify(res))
      },
      fail: function (res) {
        // app.toast(Json.stringify(res))
 
      }
    }
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    var that = this;
    if (e.scrollTop > 10 && e.scrollTop < 99) {
      this.setData({ background: "rgba(255, 255, 255, 0.6)", margin: '19rpx 0' })
    } else if (e.scrollTop > 100) {
      this.setData({
        background: "#eee",
        imgSearch: false,
      })
    } else if (e.scrollTop == 0) {
      this.setData({
        background: "rgba(255, 255, 255,0)",
        imgSearch: true,
        margin: '30rpx 0'
      })
    }
    that.setData({
      serollFlag: true  //到达底部关闭伪懒加载
    })
  },
})