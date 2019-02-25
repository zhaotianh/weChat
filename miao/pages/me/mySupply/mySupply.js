const app = getApp(); 
import Dialog from '../../../dist/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    supplyList:[], //承载数据
    pageNumber: 1,  //数据请求页码
    loading: true,  //加载
    noHave: false,  //无数据
    height:0,  //滚动条显示区域高度
    nowTime: new Date().getTime(),  //当前时间
    serollFlag: false ,  //滚动条是否滚动变量
    supplyId:'',
    token:'',
    name:'',//树种名称
    input:'',
    shaXNum: 3,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      },
    })
    wx.getStorage({
      key: 'token',
      success(data) {
        that.setData({
          token:data.data
        })
        //获取供应数据------------------------------------------------------------
        that.dataList(that.data.pageNumber,that.data.input); 
      }
    })
    
  },
  supplyUrl(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../../page/page?id=' + e.currentTarget.dataset.proid + '&type=supply&my=my'
    })
  },
  fBsupply() {//发布供应
    wx.navigateTo({
      url: '../../Release/supply/supply',
    })
  },
  bJsupply(e) {//编辑供应
    wx.navigateTo({
      url: '../../Release/supply/supply?supply='+e.currentTarget.dataset.supplyid,
    })
  },
  searchClick(){
    var that= this;
    that.setData({
      supplyList: [],
      pageNumber:1
    })
    that.dataList(that.data.pageNumber,that.data.input); 
  },
  search(e){
    this.setData({
      input: e.detail.value
    })
  },
  dele(e) {
    var that = this;
    Dialog.confirm({
      title: '操作确认',
      message: '您将删除这条供应，删除后无法恢复'
    }).then(() => {
      wx.request({
        method:'DELETE',
        url: app.globalData.api + "party/supplies?supplyIds=" + e.target.dataset.supplyid,
        header: {
          Authorization: "Bearer " + that.data.token,
          device_id: 'platform'
        },
        success(res) {
          app.toast("删除成功")
          that.setData({
            supplyList: that.data.supplyList.filter(function (s) {
              return s.supplyId != e.target.dataset.supplyid
            })
          })
          if(that.data.supplyList.length==0){
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
    })
  },
  dataList(num,name) {  //供应数据请求函数
    var that = this;
    wx.request({
      url: app.globalData.api+'party/supplies', // 仅为示例，并非真实的接口地址
      data: {
        pageNumber: num,
        pageSize: 20,
        name: name
      },
      header: {   //请求特殊约定
        Authorization: "Bearer " + that.data.token,
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
            if (a < 6) {  //模拟懒加载使用  只为数据前六条设置
              Data[a].imgFlag = false;   //图片模拟懒加载使用
            } else {
              Data[a].imgFlag = true;   //图片模拟懒加载使用
            }
          }
          that.setData({   //更新数据承载变量
            supplyList: that.data.supplyList.concat(res.data.data.supplies),
            shaXNum: res.data.data.refreshTime
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
            supplyList: that.data.supplyList.concat(res.data.data.supplies),
            shaXNum: res.data.data.refreshTime
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
        } else if (Data.length == 0 && that.data.supplyList.length==0) {   //数据为0时执行
          that.setData({    //显示无数据图片，隐藏加载动画
            noHave: true,
            loading: false
          })
        }
        var arr = (res.data.data.refreshSupplys).split(',');
        for (var b = 0; b < arr.length; b++) {
          that.data.supplyList.filter(function (item) {
            if (item.supplyId == arr[b]) {
              item.shaX = true;
            }
          })
        }
        that.setData({
          supplyList: that.data.supplyList
        })
        // console.log(that.data.supplyList)
      },
      fail(res) {
        this.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  shuaX(e) {
    var that = this;
    if (that.data.shaXNum > 0) {
      Dialog.confirm({
        title: '操作确认',
        message: '您每天只有三次刷新机会，确认刷新此供应吗？'
      }).then(() => {
        wx.request({
          method: 'PUT',
          url: app.globalData.api + "party/supplies/refresh?supplyId=" + e.target.dataset.supplyid,
          header: {
            Authorization: "Bearer " + that.data.token,
            device_id: 'platform'
          },
          success(res) {
            if (res.data.success) {
              that.setData({
                supplyList: []
              })
              that.dataList(1, that.data.input); 
            }
            app.toast("刷新成功")
          },
          fail(res) {
            app.alert('数据接口出现问题', 2000, 'red');
          }
        })
      })
    } else {
      app.toast('今天刷新次数已经用完!')
    }
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
      loading: true,
      pageNumber:1
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

  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    this.setData({//图片模拟懒加载使用，此处代表滚动条滑动
      serollFlag: true
    })
  },
})