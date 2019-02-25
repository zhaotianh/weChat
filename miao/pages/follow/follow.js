// pages/follow/follow.js
const app = getApp();
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noHave:false,  //无数据变量
    loading:true,  //加载动画变量
    token:"",   //登陆token
    pageNumber:1,  //数据加载的页面
    followData:[]  //数据数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({  //获取token
      key: 'token',
      success(data) {
        that.setData({
          token: data.data
        })
        //获取供应数据------------------------------------------------------------
        that.dataList(that.data.pageNumber);
      }
    })
    
  },
  //关注店铺函数
  qxFollow(e){
    var that = this;
    app.clear();  //清除提示文字
    Dialog.confirm({
      title: '提示',
      message: '您要取消关注此店铺吗？'
    }).then(() => {
      wx.request({//发送数据请求
        url: app.globalData.api + 'party/follow?followPartyId=' + e.currentTarget.dataset.shopid,
        method:'DELETE',
        header: {
          Authorization: 'Bearer ' + that.data.token,
          device_id:'platform'  //后台约定，无需改动
        },
        success(res) {
          if (res.data.success){
            that.setData({
              followData: that.data.followData.filter(function (item) {  //筛选出shopid不相等的跑数据
                return item.followPartyId != e.currentTarget.dataset.shopid
              })
            })
            if (that.data.followData.length == 0) {
              that.setData({  //数据长度为0 显示无数据图片
                noHave: true
              })
            }
            app.toast('取消关注成功！')
          }
        },
        fail(res) {
          app.toast('数据接口出现问题');
        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  goShop(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.shopid + '&type=shop'
    })
  },
  dataList(pageNumber){  //获取数据的函数
    var that = this;
    wx.request({  //发送数据请求
      url: app.globalData.api + 'party/follow?pageNumber=' + pageNumber,
      header: {
        Authorization: 'Bearer ' + that.data.token,
      },
      success(res) {
        var dataCont = res.data.data.follow;
        if (dataCont.length<15){   //数据长度小于15 隐藏加载动画
          that.setData({
            loading:false
          })
        }
        if (dataCont.length == 0 && that.data.followData.length ==0) {
          that.setData({    //无数据是显示无数据图片
            noHave: true
          })
        }
        if (dataCont.length > 0){   
          that.setData({   //链接字符串（增加数据）
            followData: that.data.followData.concat(dataCont)
          })
        }
      },
      fail(res) {
        this.alert('数据接口出现问题', 2000, 'red');
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
    var that = this;
    that.setData({
      followData: [],
      loading: true,
      pageNumber: 1
    })
    setTimeout(function(){  //延迟1s加载数据
      that.dataList(that.data.pageNumber);
    },1000)
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
    if(loading){
      this.setData({
        pageNumber: that.data.pageNumber + 1
      })
      this.dataList(that.data.pageNumber)   //加载更多数据
    }
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
})