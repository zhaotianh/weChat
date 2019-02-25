//引入弹框及提示组建
import Toast from './dist/toast/toast';
import Notify from './dist/notify/notify';
App({
  onLaunch: function () {
    var that = this;
    //微信api,获取屏幕的宽高，做全局变量存储
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.width = res.windowWidth;
        that.globalData.height = res.windowHeight;
      },
    })
  },
  globalData: {  //全局变量
    adress:null, //定位地址
    open:"",     //openid微信
    token:"",    //登陆用户缓存token
    width:0,     //屏幕的宽度
    height:0,    //屏幕的高度
    userInfo:{}, //账户的有关信息
    api:'https://api.maimiaoyun.cn/',  //接口的域名
    pageUrlHeader:'https://www.maimiaoyun.cn',   //详情页的域名
    // api:'https://test.api.maimiaoyun.cn/',    //测试接口的域名
    // pageUrlHeader: 'https://test.maimiaoyun.cn', //测试详情页域名
    otherLogin:false,//判断是否登录                     
    imgUrl:'https://miaoyuan-img.oss-cn-beijing.aliyuncs.com',//图片上传地址
  },
  alert(text, time, color) {   //错误提醒
    Notify({
      text: text,  //错误内容
      duration: time,   //消失时间
      selector: '#van-notify',  //id
      backgroundColor: color   //提示北京颜色
    });
  },
  toast(text){      //全局文字提醒
    Toast(text);
  },
  clear(){          //全局清除文字提醒
    Toast.clear();
  }
})