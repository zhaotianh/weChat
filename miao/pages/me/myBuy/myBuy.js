const app = getApp();
import Dialog from '../../../dist/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buyList: [], //承载数据
    pageNumber: 1,  //数据请求页码
    loading: true,  //加载
    noHave: false,  //无数据
    height: 0,  //滚动条显示区域高度
    nowTime: new Date().getTime(),  //当前时间
    serollFlag: false,  //滚动条是否滚动变量
    supplyId: '',
    token: '',
    name: '',//树种名称
    input: '',
    shaXNum:3,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();//隐藏转发按钮  设计接口需要token的全部隐藏转发
    var that = this;
    wx.getSystemInfo({  //获取屏幕高度
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      },
    })
    wx.getStorage({  //获取缓存的token
      key: 'token',
      success(data) {
        that.setData({
          token: data.data
        })
        //获取供应数据------------------------------------------------------------
        that.dataList(that.data.pageNumber, that.data.input);
      }
    })

  },
  buyUrl(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../../page/page?id=' + e.currentTarget.dataset.proid + '&type=buy&my=my'
    })
  },
  searchClick() { //点击搜索框
    var that = this;
    that.setData({
      buyList: [],
      pageNumber: 1
    })
    that.dataList(that.data.pageNumber, that.data.input);
  },
  search(e) {   //搜索框输入内容
    this.setData({
      input: e.detail.value
    })
  },
  shuaX(e) {  //数据刷新请求函数
    var that = this;
    if (that.data.shaXNum>0){
      Dialog.confirm({
        title: '操作确认',
        message: '您每天只有三次刷新机会，确认刷新此求购吗？'
      }).then(() => {
        wx.request({  //刷新数据请求
          method: 'PUT',
          url: app.globalData.api + "party/buys/refresh?buyId=" + e.target.dataset.supplyid,
          header: {
            Authorization: "Bearer " + that.data.token,
            device_id: 'platform'
          },
          success(res) {
            if (res.data.success) {
              that.setData({
                buyList:[]
              })
              that.dataList(1, that.data.input)
            }
            app.toast("刷新成功")
          },
          fail(res) {
            app.alert('数据接口出现问题', 2000, 'red');
          }
        })
      })
    }else{
      app.toast('今天刷新次数已经用完!')
    }
  },
  dele(e) {  //删除数据操作函数
    var that = this;
    Dialog.confirm({
      title: '操作确认',
      message: '您将删除这条求购，删除后无法恢复'
    }).then(() => {
      wx.request({  //删除数据请求
        method: 'DELETE',
        url: app.globalData.api + "party/buys?buyIds=" + e.target.dataset.supplyid,
        header: {
          Authorization: "Bearer " + that.data.token,
          device_id: 'platform'
        },
        success(res) {
          that.setData({
            buyList: that.data.buyList.filter(function (s) {
              return s.buyId != e.target.dataset.supplyid
            })
          })
          if (that.data.buyList.length == 0) {
            that.setData({    //显示无数据图片，隐藏加载动画
              noHave: true,
              loading: false
            })
          }
        },
        fail(res) {
          app.alert('数据接口出现问题', 2000, 'red');
        }
      })
      app.toast("删除")
    })
  },
  dataList(num,name) {  //获取数据函数
    var that = this;
    wx.request({
      url: app.globalData.api +'party/buys',
      data: {
        pageNumber: num,
        pageSize: 20,
        name:name
      },
      header: {
        Authorization: 'Bearer ' + that.data.token,
        device_id: 'platform'
      },
      success(res) {
        wx.hideNavigationBarLoading()
        if (res.data.data.buys.length > 0) {
          var Data = res.data.data.buys;
          for (var a = 0; a < Data.length; a++) {
            var Time = parseInt((that.data.nowTime - (new Date(Data[a].lastModifiedDate.replace(/\-/g, "/"))).getTime()) / 1000);
            if (Time >= 86400) {
              Data[a].buyTime = parseInt(Time / 86400) + "天前";
            }
            if (Time >= 3600 && Time < 86400) {
              Data[a].buyTime = parseInt(Time / 3600) + "小时前";
            }
            console.log(Time)
            if (Time < 3600) {
              if (parseInt(Time / 60) <= 0) {
                Data[a].buyTime = "1分钟前";
              } else {
                Data[a].buyTime = parseInt(Time / 60) + "分钟前";
              }
            }
          }
          that.setData({
            buyList: that.data.buyList.concat(res.data.data.buys),
            shaXNum: res.data.data.refreshTime
          })
          var arr = (res.data.data.refreshBuys).split(',');
          for (var b = 0; b < arr.length;b++){
            that.data.buyList.filter(function (item) {
              if (item.buyId == arr[b]) {
                item.shaX = true;
              }
            })
          }
          that.setData({
            buyList: that.data.buyList
          })
        }
        if (res.data.data.buys.length == 0&&that.data.buyList==0){
          that.setData({
            noHave: true,
            loading: false
          })
        }
        if (res.data.data.buys.length <20 && that.data.buyList != 0) {
          that.setData({
            noHave: false,
            loading: false
          })
        }
      },
      fail(res) {
        this.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  bJsupply(e) {//编辑供应
    wx.navigateTo({
      url: '../../Release/buy/buy?supply=' + e.currentTarget.dataset.supplyid,
    })
  },
  fBbuy() {//发布
    wx.navigateTo({
      url: '../../Release/buy/buy',
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
    that.dataList(that.data.pageNumber, that.data.input);
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
    this.dataList(that.data.pageNumber, that.data.input)   //加载更多数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})