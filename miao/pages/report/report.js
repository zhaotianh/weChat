// pages/report/report.js
const app = getApp();
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio:'',  //单选框变量
    dataList:['违法/政治','垃圾信息','虚假信息','内容抄袭','身份冒用','其它原因'],
    content:'',  //举报内容
    contentId:null,  //距报类型id
    dQtype:0,   
    supplyid:"",  //举报数种的id
    token:'', //用户token
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();  //隐藏转发
    var that = this;
    that.setData({
      supplyid: options.supply,
      dQtype: options.type
    })
    wx.getStorage({  //获取token
      key: 'token',
      success(data) {
        that.setData({
          token:data.data,
        })
      }
    })
  },
  juB(){ //举报函数
    var that = this;
    app.clear();
    // console.log(that.data.content )
    // console.log(that.data.contentId )
    if (that.data.content != "" && (that.data.contentId == 0 || that.data.contentId == 1 || that.data.contentId == 2 || that.data.contentId == 3 || that.data.contentId == 4 || that.data.contentId == 5)){
      Dialog.confirm({
        title: '确认',
        message: '您确认举报此信息吗'
      }).then(() => {
        wx.request({
          url: app.globalData.api + 'party/report', // 举报请求接口api
          method:'POST',
          header: {
            Authorization: "Bearer " + that.data.token,
            device_id: 'platform'
          },
          data: {
            "description": that.data.content,
            "targetId": that.data.supplyid,
            "targetType": that.data.dQtype,
            "type": that.data.contentId
          },
          success(res) {
            if (res.data.msg =="授权token找不到"){
              app.toast('您还未登录，请登录完再使用举报功能')
              setTimeout(function () {
                wx.switchTab({
                  url: '../home/home'
                })
              }, 1500)
            }else{
              app.toast("举报成功");
              setTimeout(function () {
                wx.navigateBack({
                  delta:1
                })
              },1500)
            }
            // console.log(res.data.msg);
          },
          fail(res) {
            app.toast('数据接口出现问题');
          }
        })
      }).catch(() => {
        app.toast("已取消")
      });
    }else{
      app.toast('请选择和填写您举报的理由')
    }
  },
  input(e){
    this.setData({
      content: e.detail.value
    })
  },
  onClick(event){
    this.setData({
      radio: event.currentTarget.dataset.name
    })
    //其的代码为0
    if (event.currentTarget.dataset.name==5){
      this.setData({
        contentId: 0
      })
    }else{
      this.setData({
        contentId: event.currentTarget.dataset.name+1
      })
    }
    console.log(this.data.contentId)
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

  }
})