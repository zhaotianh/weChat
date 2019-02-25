// pages/buy/buy.js
const app = getApp();//获取全局变量
import Notify from '../../dist/notify/notify';
Page({
 
  /**
   * 页面的初始数据
   */ 
  data: {
    buyList:[],  //求购数据
    pageNumber:1,  //数据请求页码数
    loading:true,   //加载变量
    noHave:false,  //是否有数据变量
    height: app.globalData.height,  //获取屏幕高度
    nowTime:new Date().getTime()    //获取当前事件毫秒数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取求购数据------------------------------------------------------------
    this.dataList(this.data.pageNumber);  
  },
  buyUrl(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.proid + '&type=buy'
    })
  },//获取求购数据函数
  dataList(num){
    var that = this;
    wx.request({
      url: app.globalData.api +'buys', // 后台接口
      data: {
        pageNumber: num,
        pageSize: 20,
      },
      header: {  //后台定义好的无需改动
        client_id: '26A8B1CA-F6CB-4F5C-B985-BA4388953B71',
        client_secret: '862F4560-9ED6-4481-AB76-C12C8DB377B6',
        device_id: 'platform'
      },
      success(res) {
        wx.hideNavigationBarLoading()
        if (res.data.data.buys.length > 0) {   //获取时间转换成  几天前 1分钟前 等格式
          var Data = res.data.data.buys;
          for (var a = 0; a < Data.length; a++) {
            var Time = parseInt((that.data.nowTime - (new Date(Data[a].lastModifiedDate.replace(/\-/g, "/"))).getTime()) / 1000);
            if (Time >= 86400) {
              Data[a].buyTime = parseInt(Time / 86400) + "天前";
            }
            if (Time >=3600 && Time < 86400){
              Data[a].buyTime = parseInt(Time / 3600) + "小时前";
            }
            if (Time < 3600) {
              if (parseInt(Time / 60) <= 0) {
                Data[a].buyTime = "1分钟前";
              } else {
                Data[a].buyTime = parseInt(Time / 60) + "分钟前";
              }
            }
          }
          that.setData({   //获取求购数据，赋值展现数据
            buyList: that.data.buyList.concat(res.data.data.buys)
          })
        } else {
          that.setData({   //显示加载动画 关闭无数据图片
            noHave: true,
            loading: true
          })
        }
        // console.log(that.data.buyList)
      },
      fail(res) {
        this.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  alert(text,time,color){   //错误提示
    Notify({
      text: text,
      duration: time,
      selector: '#van-notify',
      backgroundColor: color
    });
  },
  //以下为跳转函数
  home() {   
    wx.reLaunch({
      url: '../home/home',
    })
  },
  supply() {
    wx.navigateTo({
      url: '../supply/supply',
    })
  },
  buy() {
    wx.navigateTo({
      url: '../buy/buy',
    })
  },
  me() {
    wx.navigateTo({
      url: '../me/me',
    })
  },
  miao() {
    wx.navigateTo({
      url: '../miao/miao',
    })
  },
  search() {
    wx.navigateTo({
      url: '../search/search',
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
      buyList: [],
      loading: true,
      pageNumber: 1
    })
    this.dataList(this.data.pageNumber);
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
    this.setData({
      pageNumber: that.data.pageNumber + 1
    })
    this.dataList(that.data.pageNumber)
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