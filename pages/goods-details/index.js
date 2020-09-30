const WXAPI = require('../../utils/apifm-wxapi')
const AUTH = require('../../utils/auth')
const SelectSizePrefix = "选择："
import Poster from 'wxa-plugin-canvas/poster/poster'

Page({
  data: {
    // 是否已登录
    wxlogin: true,

    goodsDetail: {},
    // 是否要选择规格
    hasMoreSelect: false,
    // 规格描述
    selectSize: SelectSizePrefix,
    // 所选规格价格
    selectSizePrice: 0,
    // 所选规格原价
    selectSizeOPrice: 0,
    // 购买数量
    totalScoreToPay: 0,
    // 购物车商品数
    shopNum: 0,
    // 是否隐藏弹框
    hideShopPopup: true,
    // 购买数量
    buyNumber: 0,
    // 最少购买数量
    buyNumMin: 1,
    // 最大购买数量
    buyNumMax: 0,
    // 
    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    shopType: "addShopCar", //购物类型，加入购物车或立即购买，默认为加入购物车
  },
  async onLoad(e) {
    // 处理扫码进商品详情页面的逻辑，保存邀请人
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene) 
      if (scene && scene.split(',').length >= 2) {
        e.id = scene.split(',')[0]
        wx.setStorageSync('referrer', scene.split(',')[1])
      }
    }
    this.data.goodsId = e.id
    const that = this
    this.setData({
      curuid: wx.getStorageSync('uid')
    })
    // 获取商品评价
    this.reputation(e.id)
    // 获取购物车商品数量
    this.shippingCartInfo()
  },  
  // 查询购物车商品数量
  async shippingCartInfo(){
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const res = await WXAPI.shippingCarInfo(token)
    if (res.code == 0) {
      this.setData({
        shopNum: res.data.number
      })
    }
  },
  onShow (){
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.setData({
          wxlogin: isLogined
        })
        // 检查是否已收藏该商品
        this.goodsFavCheck()
      }
    })
    this.getGoodsDetail(this.data.goodsId)
  },
  // 检查是否已收藏该商品
  async goodsFavCheck() {
    const res = await WXAPI.goodsFavCheck(wx.getStorageSync('token'), this.data.goodsId)
    if (res.code == 0) {
      this.setData({
        faved: true
      })
    } else {
      this.setData({
        faved: false
      })
    }
  },
  // 加入收藏
  async addFav(){
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        if (this.data.faved) {
          // 取消收藏
          WXAPI.goodsFavDelete(wx.getStorageSync('token'), '', this.data.goodsId).then(res => {
            this.goodsFavCheck()
          })
        } else {
          // 加入收藏
          WXAPI.goodsFavPut(wx.getStorageSync('token'), this.data.goodsId).then(res => {
            this.goodsFavCheck()
          })
        }
      }
    })
  },
  // 获取商品详情
  async getGoodsDetail(goodsId) {
    const that = this;
    const goodsDetailRes = await WXAPI.goodsDetail(goodsId)
    if (goodsDetailRes.code == 0) {
      var selectSizeTemp = SelectSizePrefix;
      if (goodsDetailRes.data.properties) {
        for (var i = 0; i < goodsDetailRes.data.properties.length; i++) {
          selectSizeTemp = selectSizeTemp + " " + goodsDetailRes.data.properties[i].name;
        }
        that.setData({
          hasMoreSelect: true,
          // 全部规格描述
          selectSize: selectSizeTemp,
          // 价格
          selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
          // 原价
          selectSizeOPrice: goodsDetailRes.data.basicInfo.originalPrice
        });
      }
      that.data.goodsDetail = goodsDetailRes.data;
      if (goodsDetailRes.data.basicInfo.videoId) {
        that.getVideoSrc(goodsDetailRes.data.basicInfo.videoId);
      }
      let _data = {
        // 商品详情
        goodsDetail: goodsDetailRes.data,
        // 价格
        selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
        // 原价
        selectSizeOPrice: goodsDetailRes.data.basicInfo.originalPrice,
        // 可购买数量
        buyNumMax: goodsDetailRes.data.basicInfo.stores,
        // 购买数量
        buyNumber: (goodsDetailRes.data.basicInfo.stores > 0) ? 1 : 0
      }
      that.setData(_data);
    }
  },
  // 跳转到购物车
  goShopCar: function() {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },
  // 加入购物车
  toAddShopCar: function() {
    this.setData({
      shopType: "addShopCar"
    })
    // 设置规格弹框数据
    this.bindGuiGeTap();
  },
  // 立即购买
  tobuy: function() {
    this.setData({
      shopType: "tobuy"
    });
    // 设置规格选择弹出框数据
    this.bindGuiGeTap();
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function() {
    this.setData({
      // 是否隐藏弹出框
      hideShopPopup: false,
      // 设置所选规格价格
      selectSizePrice: this.data.goodsDetail.basicInfo.minPrice,
      // 设置所选规格原价
      selectSizeOPrice: this.data.goodsDetail.basicInfo.originalPrice,
      // 设置所选规格图片
      skuGoodsPic: this.data.goodsDetail.basicInfo.pic
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function() {
    this.setData({
      hideShopPopup: true
    })
  },
  // 减少购买数量
  numJianTap: function() {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  // 增加购买数量
  numJiaTap: function() {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  async labelItemTap(e) {
     // 规格索引
    const propertyindex = e.currentTarget.dataset.propertyindex
    // 规格选项索引
    const propertychildindex = e.currentTarget.dataset.propertychildindex
    // 规格
    const property = this.data.goodsDetail.properties[propertyindex]
    // 规格选项
    const child = property.childsCurGoods[propertychildindex]
    // 先取消选中全部规格选项
    property.childsCurGoods.forEach(child => {
      child.active = false
    })
    // 再选中当前点击的规格选项
    property.optionValueId = child.id
    child.active = true
    // 商品全部规格数
    const needSelectNum = this.data.goodsDetail.properties.length
    // 已选择规格数
    let curSelectNum = 0;
    // 已选中的规格选项id，格式为：【规格id】:【规格选项id】
    let propertyChildIds = "";
    // 已选中的规格选项名称，格式为：【规格名称】:【规格选项名称】
    let propertyChildNames = "";
    // 设置已选择的规格选项
    this.data.goodsDetail.properties.forEach(p => {
      p.childsCurGoods.forEach(c => {
        if (c.active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + p.id + ":" + c.id + ",";
          propertyChildNames = propertyChildNames + p.name + ":" + c.name + "  ";
        }
      })
    })
    // 是否可以提交
    let canSubmit = false;
    // 当已选择的规格数等于商品全部规格数就可以提交
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {
      // 根据所选规格选项查询价格
      const res = await WXAPI.goodsPrice(this.data.goodsDetail.basicInfo.id, propertyChildIds)
      if (res.code == 0) {
        let _price = res.data.price
        this.setData({
          // 价格
          selectSizePrice: _price,
          // 原价
          selectSizeOPrice: res.data.originalPrice,
          propertyChildIds: propertyChildIds,
          propertyChildNames: propertyChildNames,
          // 最大购买数量
          buyNumMax: res.data.stores,
          // 购买数量
          buyNumber: (res.data.stores > 0) ? 1 : 0
        });
      }
    }
    // 设置sku默认图片
    let skuGoodsPic = this.data.skuGoodsPic
    // subPics是与规格选项相关的图片，如果有就设置图片  
    if (this.data.goodsDetail.subPics && this.data.goodsDetail.subPics.length > 0) {
      const _subPic = this.data.goodsDetail.subPics.find(ele => {
        return ele.optionValueId == child.id
      })
      if (_subPic) {
        skuGoodsPic = _subPic.pic
      }
    }
    this.setData({
      goodsDetail: this.data.goodsDetail,
      canSubmit: canSubmit,
      skuGoodsPic: skuGoodsPic
    })
  },
  /**
   * 加入购物车
   */
  async addShopCar() {
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showToast({
          title: '请选择规格',
          icon: 'none'
        })
      }
      // 设置规格弹框数据
      this.bindGuiGeTap()
      return
    }
    if (this.data.buyNumber < 1) {
      wx.showToast({
        title: '请选择购买数量',
        icon: 'none'
      })
      return
    }
    const isLogined = await AUTH.checkHasLogined()
    if (!isLogined) {
      this.setData({
        wxlogin: false
      })
      return
    }
    const token = wx.getStorageSync('token')
    const goodsId = this.data.goodsDetail.basicInfo.id
    const sku = []
    if (this.data.goodsDetail.properties) {
      this.data.goodsDetail.properties.forEach(p => {
        sku.push({
          optionId: p.id,
          optionValueId: p.optionValueId
        })
      })
    }
    // 后端添加购物车商品
    const res = await WXAPI.shippingCarInfoAddItem(token, goodsId, this.data.buyNumber, sku)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    // 关闭规格弹框
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车',
      icon: 'success'
    })
    // 获取购物车商品数
    this.shippingCartInfo()
  },
  /**
   * 立即购买
   */
  buyNow: function(e) {
    let that = this
    let shoptype = e.currentTarget.dataset.shoptype
    console.log(shoptype)
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      // 设置规格弹框数据
      this.bindGuiGeTap();
      wx.showModal({
        title: '提示',
        content: '请先选择规格尺寸哦~',
        showCancel: false
      })
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建立即购买信息
    var buyNowInfo = this.buliduBuyNowInfo(shoptype);
    // 写入本地存储
    wx.setStorage({
      key: "buyNowInfo",
      data: buyNowInfo
    })
    // 关闭规格弹框
    this.closePopupTap();
    // 跳转到支付页
    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow"
    })

  },
  /**
   * 组建立即购买信息
   */
  buliduBuyNowInfo: function(shoptype) {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var buyNowInfo = {};
    buyNowInfo.shopNum = 0;
    buyNowInfo.shopList = [];
    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },
  // 自定义转发内容
  onShareAppMessage() {
    let _data = {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid'),
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
    return _data
  },
  // 获取商品评价
  reputation: function(goodsId) {
    var that = this;
    WXAPI.goodsReputation({
      goodsId: goodsId
    }).then(function(res) {
      if (res.code == 0) {
        that.setData({
          reputation: res.data
        });
      }
    })
  },
  // 获取商品视频地址
  getVideoSrc: function(videoId) {
    var that = this;
    WXAPI.videoDetail(videoId).then(function(res) {
      if (res.code == 0) {
        that.setData({
          videoMp4Src: res.data.fdMp4
        });
      }
    })
  },
  // 跳转到首页
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  // 取消登录
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
  // 登录
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
  closePop(){
    this.setData({
      posterShow: false
    })
  },
  previewImage(e){
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  async drawSharePic() {
    const _this = this
    const qrcodeRes = await WXAPI.wxaQrcode({
      scene: _this.data.goodsDetail.basicInfo.id + ',' + wx.getStorageSync('uid'),
      page: 'pages/goods-details/index',
      is_hyaline: true,
      autoColor: true,
      expireHours: 1
    })
    if (qrcodeRes.code != 0) {
      wx.showToast({
        title: qrcodeRes.msg,
        icon: 'none'
      })
      return
    }
    const qrcode = qrcodeRes.data
    const pic = _this.data.goodsDetail.basicInfo.pic
    wx.getImageInfo({
      src: pic,
      success(res) {
        const height = 490 * res.height / res.width
        _this.drawSharePicDone(height, qrcode)
      },
      fail(e) {
        console.error(e)
      }
    })
  },
  drawSharePicDone(picHeight, qrcode) {
    const _this = this
    const _baseHeight = 74 + (picHeight + 120)
    this.setData({
      posterConfig: {
        width: 750,
        height: picHeight + 660,
        backgroundColor: '#fff',
        debug: false,
        blocks: [
          {
            x: 76,
            y: 74,
            width: 604,
            height: picHeight + 120,
            borderWidth: 2,
            borderColor: '#c2aa85',
            borderRadius: 8
          }
        ],
        images: [
          {
            x: 133,
            y: 133,
            url: _this.data.goodsDetail.basicInfo.pic, // 商品图片
            width: 490,
            height: picHeight
          },
          {
            x: 76,
            y: _baseHeight + 199,
            url: qrcode, // 二维码
            width: 222,
            height: 222
          }
        ],
        texts: [
          {
            x: 375,
            y: _baseHeight + 80,
            width: 650,
            lineNum:2,
            text: _this.data.goodsDetail.basicInfo.name,
            textAlign: 'center',
            fontSize: 40,
            color: '#333'
          },
          {
            x: 375,
            y: _baseHeight + 180,
            text: '￥' + _this.data.goodsDetail.basicInfo.minPrice,
            textAlign: 'center',
            fontSize: 50,
            color: '#e64340'
          },
          {
            x: 352,
            y: _baseHeight + 320,
            text: '长按识别小程序码',
            fontSize: 28,
            color: '#999'
          }
        ],
      }
    }, () => {
      Poster.create();
    });
  },
  onPosterSuccess(e) {
    console.log('success:', e)
    this.setData({
      posterImg: e.detail,
      showposterImg: true
    })
  },
  onPosterFail(e) {
    console.error('fail:', e)
  },
  savePosterPic() {
    const _this = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImg,
      success: (res) => {
        wx.showModal({
          content: '已保存到手机相册',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#333'
        })
      },
      complete: () => {
        _this.setData({
          showposterImg: false
        })
      },
      fail: (res) => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
})
