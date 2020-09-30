//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 设置常量
    wx.setStorageSync("mallName", "XX商城");
    // 分享时显示的文案
    wx.setStorageSync("share_profile", "百款精品商品，总有一款适合您");
    // 是否允许到店自取
    wx.setStorageSync('ALLOW_SELF_COLLECTION', '1');
    // 订阅号
    wx.setStorageSync('subscribe_ids', 'ITVuuD_cwYN-5BjXne8cSktDo43xetj0u-lpvFZEQQs,dw9Tzh9r0sw7Gjab0ovQJx3bP3gdXmF_FZvpnxPd6hc');
  },
  globalData: {
    userInfo: null
  }
})