const WXAPI = require('../../utils/apifm-wxapi')
const TOOLS = require('../../utils/tools.js')

const APP = getApp()
// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {
  wx.setNavigationBarTitle({
    title: wx.getStorageSync('mallName')
  })
}

Page({
  data: {
    inputVal: "", // 搜索框内容
    goods: [], // 推荐商品

    loadingHidden: false, // loading

    categories: [], // 类目列表
    
    scrollTop: 0, // 内置方法的参数，页面在垂直方向已滚动的距离
    loadingMoreHidden: true, // “没有更多了” 是否隐藏

    curPage: 1, // 商品列表当前页
    pageSize: 20, // 商品列表每页查询数量
  },

  // 点击类目图标
  tabClick: function(e) {
    // 由于switchTab不能带参数，所以把参数放进本地储存里面
    wx.setStorageSync("_categoryId", e.currentTarget.id)
    // 跳转到类目页面
    wx.switchTab({
      url: '/pages/category/category',
    })
    // wx.navigateTo({
    //   url: '/pages/goods/list?categoryId=' + e.currentTarget.id,
    // })
  },
  // 点击进入商品详情
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  // 点击轮播图
  tapBanner: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  // 页面加载时触发
  onLoad: function(e) {
    // 展示分享按钮
    wx.showShareMenu({
      withShareTicket: true
    })    
    const that = this
    // 从扫小程序二维码打开此页面的链接中读取邀请人
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {        
        wx.setStorageSync('referrer', scene.substring(11))
      }
    }
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    // 初始化轮播图
    this.initBanners()
    // 初始化类目栏
    this.categories()
    // 初始化推荐商品（爆品）
    this.getGoodsList()

  },
  async initBanners(){
    const _data = {}
    // 读取头部轮播图数据
    const res1 = await WXAPI.banners({
      type: 'index'
    })
    if (res1.code == 700) {
      wx.showModal({
        title: '提示',
        content: '请在后台添加 banner 轮播图片，自定义类型填写 index',
        showCancel: false
      })
    } else {
      _data.banners = res1.data
    }
    this.setData(_data)
  },
  // 内置方法，监听页面显示
  onShow: function(e){
    this.setData({
      shopInfo: wx.getStorageSync('shopInfo')
    })
    // 获取购物车数据，显示TabBarBadge
    TOOLS.showTabBarBadge()

  },
  // 获取类目
  async categories(){
    const res = await WXAPI.goodsCategory()
    let categories = [];
    if (res.code == 0) {
      const _categories = res.data.filter(ele => {
        return ele.level == 1
      })
      categories = categories.concat(_categories)
    }
    this.setData({
      categories: categories,
      curPage: 1
    });
  },
  //重载，页面滚动触发事件的处理函数
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  // 获取商品信息
  async getGoodsList(append) {
    wx.showLoading({
      "mask": true
    })
    const res = await WXAPI.goods({
      recommendStatus: 1,
      page: this.data.curPage,
      pageSize: this.data.pageSize
    })
    wx.hideLoading()
    if (res.code == 404 || res.code == 700) {
      let newData = {
        loadingMoreHidden: false
      }
      if (!append) {
        newData.goods = []
      }
      this.setData(newData);
      return
    }
    let goods = [];
    if (append) {
      goods = this.data.goods
    }
    for (var i = 0; i < res.data.length; i++) {
      goods.push(res.data[i]);
    }
    this.setData({
      loadingMoreHidden: true,
      goods: goods,
    });
  },

  // 自定义分享内容
  onShareAppMessage: function() {    
    return {
      title: wx.getStorageSync('share_profile'),
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },
  // 内置方法，触底事件处理
  onReachBottom: function() {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(true)
  },
  // 内置方法，下拉刷新事件处理
  onPullDownRefresh: function() {
    this.setData({
      curPage: 1
    });
    this.getGoodsList()
    wx.stopPullDownRefresh()
  },
   //搜索框输入事件处理
  bindinput(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  //搜索框确认事件处理
  bindconfirm(e) {
    this.setData({
      inputVal: e.detail.value
    })
    wx.navigateTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  },
  // 跳转到搜索页面
  goSearch(){
    wx.navigateTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  }
})