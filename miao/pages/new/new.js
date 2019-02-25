// pages/new/new.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,  //加载动画
    newList:[],   //新闻承载数组
    pageNumber:1   //接口请求页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.newData(that.data.pageNumber);
  },
  newData(num){  //请求新闻函数
    var that = this;
    wx.request({
      url: app.globalData.api +'news',
      header: {
        client_id: '26A8B1CA-F6CB-4F5C-B985-BA4388953B71',
        client_secret: '862F4560-9ED6-4481-AB76-C12C8DB377B6',
        device_id: 'platform'
      },
      data:{
        pageNumber: num,
        pageSize:20
      },
      success(res) {
        wx.hideNavigationBarLoading()
        if (res.data.data.news == 0 && that.data.newList==0){
          that.setData({
            loading:false
          })
        }
        if (res.data.data.news > 0 && res.data.data.news.length<20){
          that.setData({
            loading: false
          })
        }
        setTimeout(function(){
          that.setData({
            newList: that.data.newList.concat(res.data.data.news)
          })
        },600)
        // console.log(res.data.data.news)
      },
      fail(res) {
        app.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  newPage(e){
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.newid + '&type=new'
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
      newList: [],
      loading: true,
      pageNumber: 1
    })
    that.newData(that.data.pageNumber);
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
      pageNumber: that.data.pageNumber + 1
    })
    that.newData(that.data.pageNumber);   //加载更多数据
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