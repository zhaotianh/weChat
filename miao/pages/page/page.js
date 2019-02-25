// pages/page/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',  //h5链接
    token:'00'  //用户授权token
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({  //获取用户授权token
      key: 'token',
      complete(res){  //不管时候获取到数据都执行的函数
        if (res.data){
          that.setData({
            token: res.data
          })
        }
        if (options.my == "my") {  //my=my 
          that.setData({
            url: app.globalData.pageUrlHeader + "/" + options.type + "/" + options.id + ".html?wxin=my&my=my&token=" + that.data.token + "#wechat_redirect"
          })
        } else {
          that.setData({
            url: app.globalData.pageUrlHeader + "/" + options.type + "/" + options.id + ".html?wxin=my&token=" + that.data.token + "#wechat_redirect"
          })
        }
      }
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