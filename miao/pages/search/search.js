// pages/search/search.js
const app = getApp();
import Toast from '../../dist/toast/toast';
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    num:0,
    oldData:[],
    input:'',
    storage:"",
    searchBtn:false,
    hotSearch:[],
    page:1,
    loading:true,
    noHave:false,
    buyList:[],
    height: 0,
    nowTime: new Date().getTime()
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
    //获取缓存的历史搜索记录
    wx.getStorage({
      key: 'oldSearch',
      success(res) {
        var arr = res.data.split(",");
        that.setData({
          oldData:arr,
          storage:res.data
        })
      }
    })
    //获取热门搜索
    wx.request({
      url: app.globalData.api +'products/hot?pageSize=10', // 仅为示例，并非真实的接口地址
      header: {
        client_id: '26A8B1CA-F6CB-4F5C-B985-BA4388953B71',
        client_secret: '862F4560-9ED6-4481-AB76-C12C8DB377B6',
        device_id: 'platform'
      },
      success(res) {
        that.setData({
          hotSearch: res.data.data
        })
      },
      fail(res) {
        this.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  dataSerach(e){
    this.setData({
      input: e.target.dataset.name
    })
    this.search();
  },
  con(e){
    this.setData({//图片模拟懒加载使用
      serollFlag: true
    })
  },
  lower() {
    var that = this;
    this.setData({
      page: that.data.page + 1
    })
    if (that.data.num == 0 && that.data.searchBtn) { //双重判断确定时都显示数据  是否电击搜索
      that.srarchData(app.globalData.api +'supplies', that.data.page, that.data.input)
    } else if (that.data.num == 1 && that.data.searchBtn) {
      that.srarchData(app.globalData.api +'buys', that.data.page, that.data.input)
    }
  },
  srarchData(url, page, name){
    var that = this;
    wx.request({
      url: url, // 仅为示例，并非真实的接口地址
      data: {
        pageNumber: page,
        pageSize:20,
        name: name
      },
      header: {
        client_id: '26A8B1CA-F6CB-4F5C-B985-BA4388953B71',
        client_secret: '862F4560-9ED6-4481-AB76-C12C8DB377B6',
        device_id: 'platform'
      },
      success(res) {
        if (that.data.num == 0) {
          var Data = res.data.data.supplies;
        } else if (that.data.num == 1) {
          var Data = res.data.data.buys;
        }
        that.setData({//图片模拟懒加载使用
          serollFlag: false
        })
        if (Data.length>6) {
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
            if (a < 6) {
              Data[a].imgFlag = false;   //图片模拟懒加载使用
            } else {
              Data[a].imgFlag = true;   //图片模拟懒加载使用
            }
          }
          setTimeout(function () {
            if (that.data.num == 0) {
              that.setData({
                buyList: that.data.buyList.concat(res.data.data.supplies),
              })
              setTimeout(function () {
                for (var a = 0; a < 6; a++) {
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
        } else if (Data.length > 0 && Data.length<=6){
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
            loading:false,
            noHave: false,
          })
        } else if (Data.length == 0 && that.data.buyList.length==0) {
          that.setData({
            loading: false,
            noHave: true,
            searchBtn: true
          })
        }
        //console.log(that.data.buyList)
      },
      fail(res) {
        this.alert('数据接口出现问题', 2000, 'red');
      }
    })
  },
  supplyUrl(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.proid + '&type=supply'
    })
  },
  buyUrl(e) {  //供应详情跳转链接
    wx.navigateTo({
      url: '../page/page?id=' + e.currentTarget.dataset.proid + '&type=buy'
    })
  },
  nav(e){
    var that = this;
    this.setData({
      num: e.target.dataset.ind,
      page:1,
      buyList:[],
      loading:true,
      noHave:false
    })
    if (that.data.num == 0 && that.data.searchBtn) { //双重判断确定时都显示数据  是否电击搜索
      that.srarchData(app.globalData.api +'supplies', that.data.page, that.data.input)
    } else if (that.data.num == 1 && that.data.searchBtn) {
      that.srarchData(app.globalData.api +'buys', that.data.page, that.data.input)
    }
  },
  search(){
    var that = this;
    var data = that.data.storage;
    var ind = data.split(",").indexOf(this.data.input);
    if (this.data.input!=""){
      this.setData({
        page: 1,
        buyList: [],
        loading:true,
        searchBtn: true
      })
      if (ind == -1) {
        if (that.data.storage != "") {
          wx.setStorage({ key: 'oldSearch', data: that.data.storage + this.data.input + ',' });  //以前有缓存累加
        } else {
          wx.setStorage({ key: 'oldSearch', data: this.data.input + ',' });  //无缓存新建
        }
        that.setData({
          storage: that.data.storage + this.data.input + ','
        })
      }
      if (that.data.num == 0) {
        that.srarchData(app.globalData.api +'supplies', that.data.page, that.data.input)
      } else if (that.data.num == 1) {
        that.srarchData(app.globalData.api +'buys', that.data.page, that.data.input)
      }
    }else{
      app.toast("请输入您要搜索的关键词");
    }
  },
  value(e){ //获取搜索框内容
    this.setData({
      input: e.detail.value
    })
  },
  over(){ //清除历史搜索
    this.setData({
      oldData:[]
    })
    wx.clearStorage();
  },
  clear(){
    //清除输入框
    this.setData({
      input:"",
      searchBtn:false,
      buyList:[],
      page: 1,
      noHave:false
    })
    var that = this;
    //获取缓存的历史搜索记录
    wx.getStorage({
      key: 'oldSearch',
      success(res) {
        var arr = res.data.split(",");
        that.setData({
          oldData: arr,
          storage: res.data
        })
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

  }
})