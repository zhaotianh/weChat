var addressList = require('../../../js/address.js');   //引入地理位置
import Toast from '../../../dist/toast/toast';        //引入信息提示
import Dialog from '../../../dist/dialog/dialog';      //引入弹框
const app = getApp();  //获取全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,  //是否展现
    result: [],    
    gGList: [],//规格信息
    dWList: ['棵', '丛', '平方米', '盆', '千克', '芽', '袋'],
    list: ['胸径', '米径', '地径', '树高', '冠幅', '分支点高'],
    num: 0,  //数字信息
    dWflag: false, //判断是否显示胸径输入框
    xJFlag: false,//判断是否显示胸径输入框
    mJFlag: false,//判断是否显示米径输入框
    dJFlag: false,//判断是否显示地径输入框
    sgFlag: false,//判断是否显示树高输入框
    gfFlag: false,//判断是否显示冠幅输入框
    fzdgFlag: false,//判断是否显示分支点高输入框
    xJing: '',  //胸径1
    mJing: '',  //米径1
    dJing: '',  //地径1
    sGao: '',   //树高1
    guanFu: '', //冠幅1
    fzGd: '',   //分支点高1
    xJing1: '', //胸径
    mJing1: '', //米径
    dJing1: '',//地径
    sGao1: '',//树高
    guanFu1: '',//冠幅
    fzGd1: '',//分支点高
    price: '',
    price1: '',//价格
    productName: '',//树种名称
    quantity: '',//数量
    unit: '棵',//单位
    demand: '',//备注
    linkman: '',//联系人
    phone: '', //手机号
    aeraView:'',//地址
    token: '', //登陆信息
    newOld: true,//判断是新发布还是编辑
    supplyId: '',//供应is
    btnText: "立即发布", //按钮文字
    addressListData: null,  //地址列表数据
    adressDiv: false   //地址列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();  //发布页面隐藏分享按钮  
    var that = this;
    if (app.globalData.adress){  //判断地址是否获取
      this.setData({
        aeraView:app.globalData.adress
      })
    }
    that.setData({   //将地址列表复制给当前页面变量
      addressListData: addressList.default
    })
    wx.getStorage({   //获取缓存的token
      key: 'token',
      success(data) {
        that.setData({  //赋值token
          token: data.data
        })
        if (options.supply) {   //根据是否有supply 确定进入的是编辑页面还是发布页面
          var arr = [];
          that.setData({
            newOld: false,
            supplyId: options.supply,
            btnText: '立即修改'
          })
          wx.request({   //根据supply获取当前数种的信息
            url: app.globalData.api + "party/buys/" + options.supply,
            method: 'GET',
            header: {
              Authorization: 'Bearer ' + that.data.token,   //用户的授权码
              device_id: 'platform'   //不变  后台约定的
            },
            success(res) {
              if (res.data.data.dijing) {
                that.setData({
                  dJing: res.data.data.dijing,
                  dJing1: res.data.data.dijingtwo,//地径
                })
                arr.push("地径")
              }
              if (res.data.data.fenzhidiangao) {
                that.setData({
                  fzGd: res.data.data.fenzhidiangao,
                  fzGd1: res.data.data.fenzhidiangaotwo,//分支点高
                })
                arr.push("分支点高")
              }
              if (res.data.data.mijing) {
                that.setData({
                  mJing: res.data.data.mijing,
                  mJing1: res.data.data.mijingtwo, //米径
                })
                arr.push("米径")
              }
              if (res.data.data.xiongjing) {
                that.setData({
                  xJing: res.data.data.xiongjing,
                  xJing1: res.data.data.xiongjingtwo, //胸径
                })
                arr.push("胸径")
              }
              if (res.data.data.guanfu) {
                that.setData({
                  guanFu: res.data.data.guanfu,
                  guanFu1: res.data.data.guanfutwo,//冠幅
                })
                arr.push("冠幅")
              }
              if (res.data.data.shugao) {
                that.setData({
                  sGao: res.data.data.shugao,
                  sGao1: res.data.data.shugaotwo,//树高
                })
                arr.push("树高")
              }
              that.setData({
                result: arr,
              })
              //根据arr数组会显示相应的规格输入框
              if (res.data.data.unit) {
                var DwArr = ['棵', '丛', '平方米', '盆', '千克', '芽', '贷']
                that.setData({
                  num: DwArr.indexOf(res.data.data.unit),  //获取下标  wxml展示用
                  unit: res.data.data.unit,//单位
                })
              }
              that.gGList();  //更新规格选中状态
              that.setData({
                price: res.data.data.price,
                price1: res.data.data.priceTwo,//价格
                productName: res.data.data.productName,//树种名称
                quantity: res.data.data.quantity,//数量
                demand: res.data.data.demand,//备注
                linkman: res.data.data.linkman,//联系人
                phone: res.data.data.phone, //手机号
                aeraView: res.data.data.areaView,//地址
                imgTextFlag: false
              })
            },
            fail(res) {
              app.toast('数据接口出现问题,未获取到详情');
            }
          })
        }
      }
    })
    wx.getStorage({   //获取本地缓存手机号
      key: 'phone',
      success(data) {
        that.setData({
          phone: data.data
        })
      }
    })
  },
  subMit() {  //发布提交
    var that = this;
    // console.log(this.data.xJing + "--胸径--" + this.data.xJing1)
    // console.log(this.data.mJing + "--米径--" + this.data.mJing1)
    // console.log(this.data.dJing + "--地径--" + this.data.dJing1)
    // console.log(this.data.sGao + "--树高--" + this.data.sGao1)
    // console.log(that.data.guanFu + "--冠幅--" + that.data.guanFu1)
    // console.log(this.data.fzGd + "--分支点高--" + this.data.fzGd1)
    // console.log(this.data.price + "--price--" + this.data.price1)
    // console.log(this.data.productName + "--树种名称--")
    // console.log(this.data.quantity + "--数量--")
    // console.log(this.data.unit + "--单位--")
    // console.log(this.data.demand + "--备注--")
    // console.log(this.data.linkman + "--联系人--")
    // console.log(this.data.phone + "--手机号--")
    // console.log(this.data.aeraView + "--地址--")
    //默认修改的相关信息
    var type = "POST",
      url = "party/buys",
      tsText = "您确定发布此条求购吗？",
      loadingText = "发布中",
      qxText = "发布取消";
    //判断是修改页面还是发布页面，修改请求参数
    if (!that.data.newOld) {
      type = "PUT",
        url = "party/buys/" + that.data.supplyId,
        tsText = "您确定修改此条求购吗？",
        loadingText = "修改中",
        qxText = "修改取消";
    }
    //判断 相关必填参数
    if (this.data.productName != "" && this.data.quantity != "" && this.data.unit != "" && ((this.data.xJFlag && this.data.xJing != "" && this.data.xJing1 != "") || (this.data.mJFlag && this.data.mJing != "" && this.data.mJing1 != "") || (this.data.dJFlag && this.data.dJing != "" && this.data.dJing1 != "") || (this.data.sgFlag && this.data.sGao != "" && this.data.sGao1 != "") || (this.data.gfFlag && this.data.gFu != "" && this.data.gFu1 != "") || (this.data.fzdgFlag && this.data.fzGd != "" && this.data.fzGd1 != "") || (!this.data.xJFlag && !this.data.mJFlag && !this.data.dJFlag && !this.data.sgFlag && !this.data.gfFlag && !this.data.fzdgFlag)) && (this.data.price != "" && this.data.price1 != "") && this.data.linkman != "" && this.data.phone != "" && this.data.aeraView != "") {
      Dialog.confirm({  //发布前提示
        title: '提示',
        message: tsText
      }).then(() => {
        Toast.loading({
          mask: true,
          message: loadingText,
          duration: 0
        });
        wx.request({  //发布请求
          url: app.globalData.api + url,
          method: type,
          header: {
            Authorization: 'Bearer ' + that.data.token,
            device_id: 'platform'
          },
          data: {
            "demand": that.data.demand,     //描述
            "dijing": that.data.dJing,
            "dijingtwo": that.data.dJing1,
            "fenzhidiangao": that.data.fzGd,
            "fenzhidiangaotwo": that.data.fzGd1,
            "guanfu": that.data.guanFu,
            "guanfutwo": that.data.guanFu1,
            "linkman": that.data.linkman,
            "mijing": that.data.mJing,
            "mijingtwo": that.data.mJing1,
            "phone": that.data.phone,
            "price": that.data.price,
            "priceTwo": that.data.price1,
            "productName": that.data.productName,
            "quantity": that.data.quantity,   //数量
            "shugao": that.data.sGao,
            "shugaotwo": that.data.sGao1,
            "unit": that.data.unit,          //单位
            "xiongjing": that.data.xJing,
            "xiongjingtwo": that.data.xJing1,
            "areaView": that.data.aeraView  //地区
          },
          success(res) {
            setTimeout(function () {
              if (!that.data.newOld) {
                wx.navigateBack({   //发布成功关闭当前页面返回上一页
                  delta: 1
                })
              }else{
                Toast.clear(); //清除成功提示
                wx.redirectTo({  //滚逼当前页面返回指定页
                  url: '../../me/myBuy/myBuy'
                })
              }
            }, 2000)
          },
          fail(res) {
            app.toast('数据接口出现问题');
          }
        })
      }).catch(() => {
        app.toast(qxText)
      });

    } else {
      if (this.data.productName == "") {
        app.toast("品种名称不能为空")
      } else if (this.data.xJFlag && (this.data.xJing == "" || this.data.xJing1 == "")) {
        app.toast("规格胸径不能为空")
      } else if (this.data.mJFlag && (this.data.mJing == "" || this.data.mJing1 == "")) {
        app.toast("规格米径不能为空")
      } else if (this.data.dJFlag && (this.data.dJing == "" || this.data.dJing1 == "")) {
        app.toast("规格地径不能为空")
      } else if (this.data.sgFlag && (this.data.sGao == "" || this.data.sGao1 == "")) {
        app.toast("规格树高不能为空")
      } else if (this.data.gfFlag && (this.data.guanFu == "" || this.data.guanFu1 == "")) {
        app.toast("规格冠幅不能为空")
      } else if (this.data.fzdgFlag && (this.data.fzGd == "" || this.data.fzGd1 == "")) {
        app.toast("规格分枝高点不能为空")
      } else if (this.data.quantity == "") {
        app.toast("数量不能为空")
      } else if (this.data.price == "" || this.data.price1 == "") {
        app.toast("价格不能为空")
      } else if (this.data.linkman == "") {
        app.toast("联系人不能为空")
      } else if (this.data.phone == "") {
        app.toast("联系电话不能为空")
      } else if (this.data.aeraView == "") {
        app.toast("用苗地不能为空")
      }
    }
  },
  dWflag() {  //单位选择
    if (this.data.dWflag) {
      this.setData({
        dWflag: false
      })
    } else {
      this.setData({
        dWflag: true
      })
    }
  },
  onClose() { //关闭面板函数
    this.setData({ show: false });
  },
  onOpen() { //关闭面板函数
    this.setData({ show: true });
  },
  onChange(event) { //选择规格函数
    this.setData({
      result: event.detail
    });
  },
  toggle(event) {//选择规格函数
    var that = this;
    var arr = that.data.result;
    if (arr.indexOf(event.currentTarget.dataset.name) != -1) {
      arr = arr.filter(function (a) {
        return (a != event.currentTarget.dataset.name)
      })
    } else {
      arr.push(event.currentTarget.dataset.name);
    }
    that.setData({
      result: arr
    })
  },
  gGList() {  //确定规格
    var that = this;
    this.setData({
      show: false,
      gGList: this.data.result
    })
    for (var a = 0; a < that.data.gGList.length; a++) {
      if (that.data.gGList[a] == "胸径") {
        that.setData({ xJFlag: true })
      } else if (that.data.gGList[a] == "米径") {
        that.setData({ mJFlag: true })
      } else if (that.data.gGList[a] == "地径") {
        that.setData({ dJFlag: true })
      } else if (that.data.gGList[a] == "树高") {
        that.setData({ sgFlag: true })
      } else if (that.data.gGList[a] == "冠幅") {
        that.setData({ gfFlag: true })
      } else if (that.data.gGList[a] == "分支点高") {
        that.setData({ fzdgFlag: true })
      }
    }
  },
  gGclear(e) { //删除规格
    var arr = this.data.result;
    arr = arr.filter(function (a) {
      return (a !== e.currentTarget.dataset.gg)
    })
    this.setData({
      result: arr,
      gGList: arr
    })
    var that = this;
    if (e.currentTarget.dataset.gg == "胸径") {
      that.setData({ xJFlag: false, xJing: '', xJing1: '' })
    } else if (e.currentTarget.dataset.gg == "米径") {
      that.setData({ mJFlag: false, mJing: '', mJing1: '' })
    } else if (e.currentTarget.dataset.gg == "地径") {
      that.setData({ dJFlag: false, dJing: '', dJing1: '' })
    } else if (e.currentTarget.dataset.gg == "树高") {
      that.setData({ sgFlag: false, sGao: '', sGao1: '' })
    } else if (e.currentTarget.dataset.gg == "冠幅") {
      that.setData({ gfFlag: false, guanFu: '', guanFu1: '' })
    } else if (e.currentTarget.dataset.gg == "分支点高") {
      that.setData({ fzdgFlag: false, fzGd: '', fzGd1: '' })
    }
  },
  chooseDw(e) { //选择单位
    this.setData({
      num: e.currentTarget.dataset.num,
      unit: e.currentTarget.dataset.dw
    })
  },
  noop() { },
  //以下函数为获取各个input的函数
  xJing(e) {
    this.setData({ xJing: e.detail.value })
  },
  mJing(e) {
    this.setData({ mJing: e.detail.value })
  },
  dJing(e) {
    this.setData({ dJing: e.detail.value })
  },
  sGao(e) {
    this.setData({ sGao: e.detail.value })
  },
  gFuInput(e) {
    this.setData({ guanFu: e.detail.value })
  },
  fzGd(e) {
    this.setData({ fzGd: e.detail.value })
  },
  xJing1(e) {
    this.setData({ xJing1: e.detail.value })
  }, //胸径
  mJing1(e) {
    this.setData({ mJing1: e.detail.value })
  }, //米径
  dJing1(e) {
    this.setData({ dJing1: e.detail.value })
  },//地径
  sGao1(e) {
    this.setData({ sGao1: e.detail.value })
  },//树高
  gFu1Input(e) {
    this.setData({ guanFu1: e.detail.value })
  },//冠幅
  fzGd1(e) {
    this.setData({ fzGd1: e.detail.value })
  },//分支点高
  price(e) {
    this.setData({ price: e.detail.value })
  },
  price1(e) {
    this.setData({ price1: e.detail.value })
  },//价格
  productName(e) {
    this.setData({ productName: e.detail.value })
  },//树种名称
  quantity(e) {
    this.setData({ quantity: e.detail.value })
  },//数量
  demand(e) {
    this.setData({ demand: e.detail.value })
  },//备注
  linkman(e) {
    this.setData({ linkman: e.detail.value })
  },//联系人
  phone(e) {
    this.setData({ phone: e.detail.value })
  }, //手机号
  aeraView(e) {
    this.setData({ aeraView: e.detail.value })
  },//地址
  open() {
    this.setData({
      adressDiv: true
    })
  },
  close() {
    this.setData({
      adressDiv: false
    })
  },
  con(e) {
    this.setData({
      aeraView: e.detail.detail.province + " " + e.detail.detail.city,
      adressDiv: false
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