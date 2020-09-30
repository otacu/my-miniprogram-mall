const app = getApp()
const WXAPI = require('../../utils/apifm-wxapi')
const AUTH = require('../../utils/auth')
const wxpay = require('../../utils/pay.js')

Page({
  data: {
    wxlogin: true,

    totalScoreToPay: 0,
    goodsList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    pingtuanOpenId: undefined, //拼团的话记录团号

    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null, // 当前选择使用的优惠券
    curCouponShowText: '请选择使用优惠券', // 当前选择使用的优惠券
    allowSelfCollection: '0', // 是否允许到店自提
    peisongType: 'kd', // 配送方式 kd,zq 分别表示快递/到店自取
    remark: ''
  },
  onShow(){
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.doneShow()
      }
    })
  },
  async doneShow() {
    // 如果不允许自取就设置成快递方式
    let allowSelfCollection = wx.getStorageSync('ALLOW_SELF_COLLECTION')
    if (!allowSelfCollection || allowSelfCollection != '1') {
      allowSelfCollection = '0'
      this.data.peisongType = 'kd'
    }
    // 购物车里的商品
    let shopList = [];
    const token = wx.getStorageSync('token')
    //立即购买下单
    if ("buyNow" == this.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      const res = await WXAPI.shippingCarInfo(token)
      if (res.code == 0) {
        shopList = res.data.items
      }
    }
    this.setData({
      goodsList: shopList,
      allowSelfCollection: allowSelfCollection,
      peisongType: this.data.peisongType
    });
    this.initShippingAddress()
  },

  onLoad(e) {
    let _data = {
      isNeedLogistics: 1
    }
    if (e.orderType) {
      _data.orderType = e.orderType
    }
    this.setData(_data);
  },

  getDistrictId: function (obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },
  remarkChange(e){
    this.data.remark = e.detail.value
  },
  goCreateOrder(){
    const subscribe_ids = wx.getStorageSync('subscribe_ids')
    if (subscribe_ids) {
      wx.requestSubscribeMessage({
        tmplIds: subscribe_ids.split(','),
        success(res) {
          
        },
        fail(e) {
          console.error(e)
        },
        complete: (e) => {
          this.createOrder()
        },
      })
    } else {
      this.createOrder()
    }   
   },
  createOrder: function () {
    var that = this;
    var loginToken = wx.getStorageSync('token') // 用户登录 token
    var remark = this.data.remark; // 备注信息

    let postData = {
      token: loginToken,
      goodsJsonStr: that.data.goodsJsonStr,
      remark: remark,
      peisongType: that.data.peisongType
    };
    if (that.data.isNeedLogistics > 0 && postData.peisongType == 'kd') {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showToast({
          title: '请设置收货地址',
          icon: 'none'
        })
        return;
      }
      if (postData.peisongType == 'kd') {
        postData.provinceId = that.data.curAddressData.provinceId;
        postData.cityId = that.data.curAddressData.cityId;
        if (that.data.curAddressData.districtId) {
          postData.districtId = that.data.curAddressData.districtId;
        }
        postData.address = that.data.curAddressData.address;
        postData.linkMan = that.data.curAddressData.linkMan;
        postData.mobile = that.data.curAddressData.mobile;
        postData.code = that.data.curAddressData.code;
      }      
    }

    WXAPI.orderCreate(postData).then(function (res) {
      if (res.code != 0) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return;
      }

      if ("buyNow" != that.data.orderType) {
        // 清空购物车数据
        WXAPI.shippingCarInfoRemoveAll(loginToken)
      }
      that.processAfterCreateOrder(res)
    })
  },
  async processAfterCreateOrder(res) {
    // 直接弹出支付，取消支付的话，去订单列表
    wxpay.wxpay('order', res.data.id, "/pages/order-list/index");
  },
  async initShippingAddress() {
    const res = await WXAPI.defaultAddress(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        curAddressData: res.data.info
      });
    } else {
      this.setData({
        curAddressData: null
      });
    }
    this.processYunfei();
  },
  processYunfei() {   
    // 这个方法是拼装了下单的json，并没有计算运费
    var goodsList = this.data.goodsList
    if (goodsList.length == 0) {
      return
    }
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;
    var yunPrice = 0;

    let inviter_id = 0;
    let inviter_id_storge = wx.getStorageSync('referrer');
    if (inviter_id_storge) {
      inviter_id = inviter_id_storge;
    }
    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.logistics || carShopBean.logisticsId) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number;

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }
      if (carShopBean.sku && carShopBean.sku.length > 0) {
        let propertyChildIds = ''
        carShopBean.sku.forEach(option => {
          propertyChildIds = propertyChildIds + ',' + option.optionId + ':' + option.optionValueId
        })
        carShopBean.propertyChildIds = propertyChildIds
      }
      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0, "inviter_id":' + inviter_id + '}';
      goodsJsonStr += goodsJsonStrTmp;
    }
    goodsJsonStr += "]";
    this.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: goodsJsonStr,
      allGoodsPrice: allGoodsPrice,
      allGoodsAndYunPrice: allGoodsPrice + yunPrice
    });
    this.createOrder();
  },
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },

  // 切换配送方式
  radioChange (e) {
    this.setData({
      peisongType: e.detail.value
    })
  },
  cancelLogin() {
    wx.navigateBack()
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