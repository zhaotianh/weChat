// pages/buy/buy.js
const app = getApp();
import Notify from '../../dist/notify/notify';
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    buyList: [],  //承载供应数据
    pageNumber: 1,  //数据请求页码
    loading: true,  //加载
    noHave: false,  //无数据
    height: app.globalData.height,  //滚动条显示区域高度
    nowTime: new Date().getTime(),  //当前时间
    serollFlag:false   //滚动条是否滚动变量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取供应数据------------------------------------------------------------
    this.dataList(this.data.pageNumber); 
  },
  supplyUrl(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.proid + '&type=supply'
    })
  },
  goShop(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.shopid + '&type=shop'
    })
  },
  dataList(num) {  //供应数据请求函数
    var that = this;
    wx.request({
      url: app.globalData.api +'supplies', // 仅为示例，并非真实的接口地址
      data: {
        pageNumber: num,
        pageSize: 20,
      },
      header: {   //请求特殊约定
        client_id: '26A8B1CA-F6CB-4F5C-B985-BA4388953B71',
        client_secret: '862F4560-9ED6-4481-AB76-C12C8DB377B6',
        device_id: 'platform'
      },
      success(res) {
        wx.hideNavigationBarLoading()
        that.setData({//图片模拟懒加载使用，此处代表滚动条未发生滚动
          serollFlag: false
        })
        var Data = res.data.data.supplies;
        if (Data.length > 6) {  //有数据》6条时执行
          for (var a = 0; a < Data.length; a++) {   //循环每个数据  添加时间属性
            var Time = parseInt((that.data.nowTime - (new Date(Data[a].lastModifiedDate.replace(/\-/g, "/"))).getTime()) / 1000);
            if (Time >= 86400) {
              Data[a].buyTime = parseInt(Time / 86400) + "天前";
            }
            if (Time >= 3600 && Time < 86400) {
              Data[a].buyTime = parseInt(Time / 3600) + "小时前";
            }
            if (Time < 3600) {
              if (parseInt(Time / 60) <= 0) {
                Data[a].buyTime = "1分钟前";
              } else {
                Data[a].buyTime = parseInt(Time / 60) + "分钟前";
              }
            }
            if(a<6){  //模拟懒加载使用  只为数据前六条设置
              Data[a].imgFlag = false;   //图片模拟懒加载使用
            }else{
              Data[a].imgFlag = true;   //图片模拟懒加载使用
            }
          }
          that.setData({   //更新数据承载变量
            buyList: that.data.buyList.concat(res.data.data.supplies)
          })
          setTimeout(function(){   
            for(var a=0;a<6;a++){
              that.data.buyList[a].imgFlag = true;  //模拟图片懒加载 600毫秒后  更新数据承载变量
            }
            that.setData({
              buyList: that.data.buyList
            })
          },600)
        } else if (Data.length > 0 && Data.length <= 6) {  //数据<=6条时加载
          for (var a = 0; a < Data.length; a++) {      //内容同上
            var Time = parseInt((that.data.nowTime - (new Date(Data[a].lastModifiedDate.replace(/\-/g, "/"))).getTime()) / 1000);
            if (Time >= 86400) {
              Data[a].buyTime = parseInt(Time / 86400) + "天前";
            }
            if (Time >= 3600 && Time < 86400) {
              Data[a].buyTime = parseInt(Time / 3600) + "小时前";
            }
            if (Time < 3600) {
              if (parseInt(Time / 60) <= 0) {
                Data[a].buyTime = "1分钟前";
              } else {
                Data[a].buyTime = parseInt(Time / 60) + "分钟前";
              }
            }
            if (a < Data.length) {
              Data[a].imgFlag = false;   //图片模拟懒加载使用
            }
          }
          setTimeout(function () {
            if (that.data.num == 0) {
              that.setData({
                buyList: that.data.buyList.concat(res.data.data.supplies),
              })
              setTimeout(function () {
                for (var a = 0; a < Data.length; a++) {
                  that.data.buyList[a].imgFlag = true;
                }
                that.setData({
                  buyList: that.data.buyList
                })
              }, 600)
            } else if (that.data.num == 1) {
              that.setData({
                buyList: that.data.buyList.concat(res.data.data.buys),
              })
            }
          }, 1000)
          that.setData({
            loading: false,
            noHave: false,
          })
        } else if (Data.length == 0) {   //数据为0时执行
          that.setData({    //显示无数据图片，隐藏加载动画
            noHave: true,
            loading: false
          })
        }
        // console.log(that.data.buyList)
      },
      fail(res) {
        this.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  alert(text, time, color) {
    Notify({
      text: text,
      duration: time,
      selector: '#van-notify',
      backgroundColor: color
    });
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
    this.dataList(that.data.pageNumber)   //加载更多数据
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
    this.setData({//图片模拟懒加载使用，此处代表滚动条滑动
      serollFlag: true
    })
  },
})