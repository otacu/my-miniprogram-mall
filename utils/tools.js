const WXAPI = require('./apifm-wxapi')

// 显示购物车tabBar的Badge
// 这个工具类就一个方法，用来显示页面底部tabBar的“购物车”上的小数字，Badge是小徽章的意思。wx是小程序api，removeTabBarBadge的index参数为2代表“购物车”在tabBar上的第三个位置。
function showTabBarBadge(){
  const token = wx.getStorageSync('token')
  if (!token) {
    return
  }
  WXAPI.shippingCarInfo(token).then(res => {
    if (res.code == 700) {
      wx.removeTabBarBadge({
        index: 2
      });
    }
    if (res.code == 0) {
      if (res.data.number == 0) {
        wx.removeTabBarBadge({
          index: 2
        });
      } else {
        wx.setTabBarBadge({
          index: 2,
          text: `${res.data.number}`
        });
      }
    }
  })
}

module.exports = {
  showTabBarBadge: showTabBarBadge
}