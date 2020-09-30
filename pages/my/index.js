const app = getApp()
const WXAPI = require('../../utils/apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js')

Page({
	data: {
    wxlogin: true,
  },
	onLoad() {
	},	
  onShow() {
    const _this = this
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {        
        _this.getUserApiInfo();
      }
    })
    // 获取购物车数据，显示TabBarBadge
    TOOLS.showTabBarBadge();
  },

  loginOut(){
    AUTH.loginOut()
    wx.reLaunch({
      url: '/pages/my/index'
    })
  },
  getUserApiInfo: function () {
    var that = this;
    WXAPI.userDetail(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        let _data = {}
        _data.apiUserInfoMap = res.data
        if (res.data.base.mobile) {
          _data.userMobile = res.data.base.mobile
        }
        if (that.data.order_hx_uids && that.data.order_hx_uids.indexOf(res.data.base.id) != -1) {
          _data.canHX = true // 具有扫码核销的权限
        }
        that.setData(_data);
      }
    })
  },
  goOrder: function (e) {
    wx.navigateTo({
      url: "/pages/order-list/index?type=" + e.currentTarget.dataset.type
    })
  },
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
  goLogin() {
    this.setData({
      wxlogin: false
    })
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none',
      })
      return;
    }
    AUTH.register(this);
  },

})