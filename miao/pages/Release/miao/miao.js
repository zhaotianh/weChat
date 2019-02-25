// 引入外部js和组件
var addressList = require('../../../js/address.js');
import Toast from '../../../dist/toast/toast';
import Dialog from '../../../dist/dialog/dialog';
const app = getApp();
var uploadImgCount = 0;  //计算上传次数
var imgName = [];  //存储上传图片名称
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attas: [],//图片
    imgTextFlag: true,  //图片文字
    token: '',  //用户token
    content:'',  //内容
    adress:'全国',//地址选择默认地区
    addressListData:null,  //地址选择数据
    adressDiv:false,   //显示地址选择器
    frompage:'', //来自哪个页面，返回时使用    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();//发布页面隐藏分享
    var that = this; 
    that.setData({   //判断页面来自哪里
      frompage: options.frompage
    })
    if (app.globalData.adress){    //判断是否有地址并赋值
      this.setData({
        adress: app.globalData.adress
      })
    }
    wx.getStorage({  //获取本地缓存的token
      key: 'token',
      success(res) {
        that.setData({
          token: res.data
        })
      }
    })
    that.setData({    //赋值地址数据
      addressListData: addressList.default
    })
    uploadImgCount = 0;   //上传图片的个数
    imgName = [];    //上传图片的名称数组
  },
  subMit() {   //提交函数
    var that= this;
    if (this.data.attas.length != 0 && this.data.content!="") {  //判断图片链接  和  提示文字
      Dialog.confirm({
        title: '提示',
        message: '您确定发布这条动态吗？'
      }).then(() => {
        Toast.loading({
          mask: true,
          message: '发布中',
          duration: 0
        });
        wx.request({  //发布请求  
          url: app.globalData.api + "circles/release",
          method: 'POST',
          header: {
            Authorization: 'Bearer ' + that.data.token,
            device_id: 'platform'  //后台约定 无需改动
          },
          data: {
            "address": that.data.adress,  //地址
            "attas": that.data.attas,   //图片连接数组
            "content": that.data.content  //文字
          },
          success(res) {
            setTimeout(function () {
              Toast.clear();  //清除文字提示
              if (that.data.frompage){   //返回bar页面
                wx.switchTab({
                  url: '../../miao/miao'
                })
              }else{
                wx.navigateBack({  //返回上一页
                  delta: 1
                })
              }
            }, 2000)
          },
          fail(res) {
            app.toast('数据接口出现问题');
          }
        })
      }).catch(() => {  //发布取消进行提示
        app.toast("取消发布")
      });
    } else {
      if (this.data.attas.length == 0) {   //发布无数据时提示
        app.toast("至少上传一张供应图片")
      } else if (this.data.content == "") {
        app.toast("请输入您要分享的动态内容")
      }
    }
  },
  chooseImg() { //上传图片
    var that = this;
    wx.chooseImage({
      count: 6 - that.data.attas.length,  //上传的数量
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],  //照相机 和本地文件
      success(res) {
        const tempFilePaths = res.tempFilePaths; //获取微信初步处理的图片数组，切割并拼接成oss 上传的名称
        for (var a = 0; a < tempFilePaths.length; a++) {
          var arr = tempFilePaths[0].split(".")
          var nameHz = arr[arr.length - 1];
          var pathImgName = "MicroApp/miao/" + that.data.phone + "/" + random_string(18) + "." + nameHz;  //生成随机的位字符串的名字
          imgName.push(pathImgName);  //填充到暂存图片的名称，防止重复出现
          wx.uploadFile({  //微信上传
            url: app.globalData.imgUrl,
            filePath: tempFilePaths[a],
            name: 'file',
            formData: {  //oss直传配置
              key: pathImgName,
              policy: "eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
              OSSAccessKeyId: 'LTAIdjGHZpwdMoJf',
              success_action_status: '200',
              signature: 'yWWBJplpDA8QPqUSr9arz8/c2E0='
            },
            success(res) {
              uploadImgCount++;
              var imgData = {
                "attaTypeId": "picture",  //默认picture
                "path": app.globalData.imgUrl + "/" + imgName[uploadImgCount - 1],  //链接
                "sort": that.data.attas.length //图片顺序
              }
              that.data.attas.push(imgData)
              that.setData({
                attas: that.data.attas,
                imgTextFlag: false
              })
              // console.log(that.data.attas)
            }
          })
        }
        function random_string(len) {  //随机生成18位图片名称
          len = len || 32;
          var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
          var maxPos = chars.length;
          var pwd = '';
          for (var i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
          }
          return pwd;
        }
      }
    })
  },
  clearImg(e) {//删除图片
    var arr = this.data.attas;
    arr = arr.filter(function (ele, ind) {
      return ele.sort != e.currentTarget.dataset.imgind
    })
    imgName.splice(e.currentTarget.dataset.imgind - 1, 1)
    for (var b = 0; b < arr.length; b++) {
      arr[b].sort = b
    }
    this.setData({
      attas: arr
    })
    if (this.data.attas.length == 0) {
      this.setData({
        imgTextFlag: true,
      })
    }
    uploadImgCount--;  //删除图片后 解除上传数量的限制
  },
  input(e){
    this.setData({
      content: e.detail.value
    })
  },
  open(){ //打开地址选择
    this.setData({
      adressDiv:true
    })
  },
  close(){  //关闭地址选择
    this.setData({
      adressDiv: false
    })
  },
  con(e){
    this.setData({
      adress: e.detail.detail.province + " " + e.detail.detail.city,
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
    // app.toast(11111)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // app.toast(2222)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})