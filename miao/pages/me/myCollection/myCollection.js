// pages/me/myCollection/myCollection.js
import Dialog from '../../../dist/dialog/dialog';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyList: [], //承载数据
    buyPageNumber: 1,  //数据请求页码
    buyLoading: true,  //加载
    buyNoHave: false,  //无数据
    num: 0,
    nowTime: new Date().getTime(), 
    pageNumber: 1,  //数据请求页码
    token:'',
    supplyList: [], //承载数据
    loading: true,  //加载
    noHave: false,  //无数据
    serollFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'token',
      success(data) {
        that.setData({
          token: data.data
        })
        //获取供应数据------------------------------------------------------------
        that.dataList(1, "supply");
        that.dataBuyList(1, "buy");
      }
    })
    
  },
  goShop(e) {  //供应详情跳转链接
    console.log(e.currentTarget.dataset.shopid)
    wx.navigateTo({
      url: '../../page/page?id=' + e.currentTarget.dataset.shopid + '&type=shop'
    })
  },
  dataList(num, collectionType) {  //供应数据请求函数
    var that = this;
    wx.request({
      url: app.globalData.api + 'party/collections', // 仅为示例，并非真实的接口地址
      data: {
        pageNumber: num,
        collectionType:collectionType
      },
      header: {   //请求特殊约定
        Authorization: "Bearer " + that.data.token
      },
      success(res) {
        console.log(res)
        wx.hideNavigationBarLoading()
        that.setData({//图片模拟懒加载使用，此处代表滚动条未发生滚动
          serollFlag: false
        })
        var Data = res.data.data.supply;
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
            if (a < 6) {  //模拟懒加载使用  只为数据前六条设置
              Data[a].imgFlag = false;   //图片模拟懒加载使用
            } else {
              Data[a].imgFlag = true;   //图片模拟懒加载使用
            }
          }
          that.setData({   //更新数据承载变量
            supplyList: that.data.supplyList.concat(res.data.data.supply)
          })
          setTimeout(function () {
            for (var a = 0; a < 6; a++) {
              that.data.supplyList[a].imgFlag = true;  //模拟图片懒加载 600毫秒后  更新数据承载变量
            }
            that.setData({
              supplyList: that.data.supplyList
            })
          }, 600)
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
          that.setData({
            supplyList: that.data.supplyList.concat(res.data.data.supply),
          })
          setTimeout(function () {
            for (var a = 0; a < Data.length; a++) {
              that.data.supplyList[a].imgFlag = true;
            }
            that.setData({
              supplyList: that.data.supplyList
            })
          }, 600)
          that.setData({
            loading: false,
            noHave: false,
          })
        } else if (Data.length == 0 && that.data.supplyList.length == 0) {   //数据为0时执行
          that.setData({    //显示无数据图片，隐藏加载动画
            noHave: true,
            loading: false
          })
        }
        console.log(that.data.supplyList)
      },
      fail(res) {
        this.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  dataBuyList(num, collectionType) {
    var that = this;
    wx.request({
      url: app.globalData.api + 'party/collections', // 仅为示例，并非真实的接口地址
      data: {
        pageNumber: num,
        collectionType: collectionType
      },
      header: {   //请求特殊约定
        Authorization: "Bearer " + that.data.token
      },
      success(res) {
        wx.hideNavigationBarLoading()
        if (res.data.data.buy.length > 0) {
          var Data = res.data.data.buy;
          for (var a = 0; a < Data.length; a++) {
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
          }
          that.setData({
            buyList: that.data.buyList.concat(res.data.data.buy)
          })
          // console.log(that.data.buyList)
        }
        if (res.data.data.buy.length == 0 && that.data.buyList == 0) {
          that.setData({
            buyNoHave: true,
            buyLoading: false
          })
        }
        if (res.data.data.buy.length < 15 && that.data.buyList != 0) {
          that.setData({
            buyNoHave: false,
            buyLoading: false
          })
        }
      },
      fail(res) {
        app.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  nav(e) {
    var that = this;
    this.setData({
      num: e.target.dataset.ind,
    })
  },
  buyUrl(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../../page/page?id=' + e.currentTarget.dataset.proid + '&type=buy&my=my'
    })
  },
  supplyUrl(e) {  //供应详情跳转链接
    // console.log(e.currentTarget.dataset.proid);
    wx.navigateTo({
      url: '../../page/page?id=' + e.currentTarget.dataset.proid + '&type=supply&my=my'
    })
  },
  shoucQx(e){
    var that = this;
    app.clear();
    Dialog.confirm({
      title: '提示',
      message: '您要取消此收藏吗？'
    }).then(() => {
      wx.request({
        url: app.globalData.api +'party/collections?collectionIds=' + e.currentTarget.dataset.proid + '&collectionType=' + e.currentTarget.dataset.ind,
        method: 'DELETE',
        header: {
          'device_id': 'platform',
          'Authorization': 'Bearer ' + that.data.token
        },
        success(res) {
          if (res.data.success) {
            if (e.currentTarget.dataset.ind == "supply") {
              that.setData({
                supplyList: that.data.supplyList.filter(function (item) {
                  return item.supplyBuyId != e.currentTarget.dataset.proid
                })
              })
              if (that.data.supplyList.length==0){
                that.setData({
                  noHave:true
                })
              }
            } else if (e.currentTarget.dataset.ind == "buy") {
              that.setData({
                buyList: that.data.buyList.filter(function (item) {
                  return item.supplyBuyId != e.currentTarget.dataset.proid
                })
              })
              if (that.data.buyList.length == 0) {
                that.setData({
                  buyNoHave: true
                })
              }
            }
            app.toast('取消收藏成功')
          }
        },
        fail(res) {
          this.alert('数据接口出现问题', 2000, 'red');
        }
      })
    }).catch(() => {
      app.toast('取消操作')
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
    var that = this;
    if (that.data.num == 0) {
      that.setData({
        supplyList: [],
        loading: true,
        pageNumber: 1
      })
      that.dataList(that.data.pageNumber, "supply");
      
     } else if(that.data.num == 1){ 
      that.setData({
        buyList: [],
        buyLoading: true,
        buyPageNumber: 1
      })
      that.dataBuyList(that.data.buyPageNumber, "buy");
     }
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
    if (that.data.num == 0&&that.data.loading) {
      that.data.pageNumber++
      that.setData({
        pageNumber: that.data.pageNumber
      })
      that.dataList(that.data.pageNumber, "supply");

    } else if (that.data.num == 1 && that.data.buyLoading) {
      that.data.buyPageNumber++
      that.setData({
        buyPageNumber: that.data.buyPageNumber
      })
      that.dataBuyList(that.data.buyPageNumber, "buy");
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    this.setData({//图片模拟懒加载使用，此处代表滚动条滑动
      serollFlag: true
    })
  },
})