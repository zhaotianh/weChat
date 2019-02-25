// pages/phone/phone.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'', //手机号
    phoneYz:'',  //手机验证码
    password:'',  //密码
    passwordTwo:'', //重复密码
    phoneFlag:true, 
    phoneText:'获取验证码',
    nickName:'',  //昵称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();  //隐藏分享按钮
  },
  bangD(){ //绑定手机号
    var that = this;
    setTimeout(function () {//制造100毫秒的延迟，防止判断是  失去焦点时间还未获得value值
      if (that.data.phone != "" && that.data.phoneYz != "" && that.data.password != "" && that.data.passwordTwo != "" && (that.data.passwordTwo == that.data.password)) {
        wx.getStorage({  //获取用户信息
          key: 'info',
          success(data) {
            that.setData({
              nickName: JSON.parse(data.data).nickName,  //字符串转对象  信息以字符串形势存储
            })
            wx.request({
              url: app.globalData.api +'binding',  
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                client_id: '65E1FA8A-193E-4C79-B435-9A93BB4DB7D9',
                client_secret: '45D7FB8B-299C-4A4F-AF18-3D4D08424A7E',
                device_id: 'platform'
              },
              data: {
                phone: that.data.phone,
                openId: app.globalData.open,
                nickname: that.data.nickName,
                verificationCode: that.data.phoneYz,
                password: that.data.password
              },
              success(res) {
                // console.log(res)
                if (res.data.success) {
                  app.toast("绑定成功！");
                  //绑定成功存储openid  token   phone 等
                  wx.setStorage({
                    key: 'open',
                    data: app.globalData.open
                  })
                  wx.setStorage({
                    key: 'token',
                    data: app.globalData.token
                  })
                  wx.setStorage({
                    key: 'phone',
                    data: that.data.phone
                  })
                  app.globalData.otherLogin = true;
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../home/home'
                    })
                  }, 1500)
                }
              },
              fail(res) {
                this.alert('数据接口出现问题', 2000, 'red');
              }
            })
          }
        })
      } else if (that.data.phone == "" || that.data.phone.length != 11) {
        app.alert("请输入正确的手机号", 1500, 'red');
        that.setData({
          phone: ""
        })
      } else if (that.data.phoneYz.length != 6 || that.data.phoneYz == "" ) {
        app.alert("请输入正确的手机验证码", 1500, 'red');
        that.setData({
          phoneYz: ""
        })
      } else if (that.data.password.length < 6 || that.data.password == "") {
        app.alert("密码必须大于6位数", 1500, 'red');
        that.setData({
          password: ""
        })
      } else if (that.data.passwordTwo.length || 6 && that.data.passwordTwo == "") {
        app.alert("第二次输入密码必须大于6位数", 1500, 'red');
        that.setData({
          passwordTwo: ""
        })
      } else if (that.data.password!=that.data.passwordTwo) {
        app.alert("两次输入密码不同", 1500, 'red');
      }

    },100)
  },
  phoneDx(){  //获取手机验证吗
    var that = this;
    setTimeout(function(){  //制造100毫秒的延迟，防止判断是  失去焦点时间还未获得value值
      if (that.data.phone != "" && that.data.phoneFlag && that.data.phone.length == 11) {
        that.setData({
          phoneFlag: false
        })
        wx.request({
          url: app.globalData.api +'verification_code/register', //手机验证码获取api链接
          header: {
            client_id: '26A8B1CA-F6CB-4F5C-B985-BA4388953B71',
            client_secret: '862F4560-9ED6-4481-AB76-C12C8DB377B6',
            device_id: 'platform'
          },
          data: {
            phone: that.data.phone
          },
          success(res) {
            var num = 40;
            if (res.data.success) {
              var interval = setInterval(function () {
                that.setData({
                  phoneText: num-- + "s"
                })
                if (num == 0) {
                  clearInterval(interval);
                  that.setData({
                    phoneText: "重新获取",
                    phoneFlag: true
                  })
                }
              }, 1000)
            }
            // console.log(res)
          },
          fail(res) {
            app.alert('数据接口出现问题', 2000, 'red');
          }
        })
      } else {
        if (that.data.phone == "" || that.data.phone.length!=11) {
          app.alert('请先输入正确的手机号!', 2000, 'red');
        }
      }
    },100)
  },
  //一下函数为  输入框获取信息
  phone(e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
    console.log(this.data.phone)
  },
  phoneYz(e) {
    var that = this;
    that.setData({
      phoneYz: e.detail.value
    })
  },
  password(e) {
    var that = this;
    that.setData({
      password: e.detail.value
    })
  },
  passwordTwo(e) {
    var that = this;
    that.setData({
      passwordTwo: e.detail.value
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