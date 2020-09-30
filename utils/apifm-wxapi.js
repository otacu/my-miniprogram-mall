"use strict";

/* eslint-disable */
var API_BASE_URL = 'http://localhost:8895';
var subDomain = '-';

var request = function request(url, method, data) {
  var _url = API_BASE_URL + url;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function success(request) {
        resolve(request.data);
      },
      fail: function fail(error) {
        reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });
  });
};

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(function (value) {
    Promise.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    Promise.resolve(callback()).then(function () {
      throw reason;
    });
  });
};

module.exports = {
  request: request,
  queryMobileLocation: function queryMobileLocation() {
    var mobile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/common/mobile-segment/location', 'get', { mobile: mobile });
  },
  nextMobileSegment: function nextMobileSegment(data) {
    return request('/common/mobile-segment/next', 'post', data);
  },
  queryConfigValue: function queryConfigValue(key) {
    return request('/config/value', 'get', { key: key });
  },
  queryConfigBatch: function queryConfigBatch(keys) {
    return request('/config/values', 'get', { keys: keys });
  },
  scoreRules: function scoreRules(data) {
    return request('/score/send/rule', 'post', data);
  },
  scoreSignRules: function scoreSignRules() {
    return request('/score/sign/rules', 'get', {});
  },
  scoreSign: function scoreSign(token) {
    return request('/score/sign', 'post', {
      token: token
    });
  },
  scoreSignLogs: function scoreSignLogs(data) {
    return request('/score/sign/logs', 'post', data);
  },
  scoreTodaySignedInfo: function scoreTodaySignedInfo(token) {
    return request('/score/today-signed', 'get', {
      token: token
    });
  },
  scoreExchange: function scoreExchange(token, number) {
    return request('/score/exchange', 'post', {
      number: number,
      token: token
    });
  },
  scoreExchangeCash: function scoreExchangeCash(token, deductionScore) {
    return request('/score/exchange/cash', 'post', {
      deductionScore: deductionScore,
      token: token
    });
  },
  scoreLogs: function scoreLogs(data) {
    return request('/score/logs', 'post', data);
  },
  shareGroupGetScore: function shareGroupGetScore(code, referrer, encryptedData, iv) {
    return request('/score/share/wxa/group', 'post', {
      code: code,
      referrer: referrer,
      encryptedData: encryptedData,
      iv: iv
    });
  },
  kanjiaSet: function kanjiaSet(goodsId) {
    return request('/shop/goods/kanjia/set/v2', 'get', { goodsId: goodsId });
  },
  kanjiaJoin: function kanjiaJoin(token, kjid) {
    return request('/shop/goods/kanjia/join', 'post', {
      kjid: kjid,
      token: token
    });
  },
  kanjiaDetail: function kanjiaDetail(kjid, joiner) {
    return request('/shop/goods/kanjia/info', 'get', {
      kjid: kjid,
      joiner: joiner
    });
  },
  kanjiaHelp: function kanjiaHelp(token, kjid, joiner) {
    var remark = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/shop/goods/kanjia/help', 'post', {
      kjid: kjid,
      joinerUser: joiner,
      token: token,
      remark: remark
    });
  },
  kanjiaClear: function kanjiaClear(token, kjid) {
    return request('/shop/goods/kanjia/clear', 'post', {
      kjid: kjid,
      token: token
    });
  },
  kanjiaMyJoinInfo: function kanjiaMyJoinInfo(token, kjid) {
    return request('/shop/goods/kanjia/my', 'get', {
      kjid: kjid,
      token: token
    });
  },
  kanjiaHelpDetail: function kanjiaHelpDetail(token, kjid, joiner) {
    return request('/shop/goods/kanjia/myHelp', 'get', {
      kjid: kjid,
      joinerUser: joiner,
      token: token
    });
  },
  checkToken: function checkToken(token) {
    return request('/user/check-token', 'get', {
      token: token
    });
  },
  checkReferrer: function checkReferrer(referrer) {
    return request('/user/check-referrer', 'get', {
      referrer: referrer
    });
  },
  addTempleMsgFormid: function addTempleMsgFormid(token, type, formId) {
    return request('/template-msg/wxa/formId', 'post', {
      token: token, type: type, formId: formId
    });
  },
  sendTempleMsg: function sendTempleMsg(data) {
    return request('/template-msg/put', 'post', data);
  },
  wxpay: function wxpay(data) {
    return request('/pay/wx/wxapp', 'post', data);
  },
  ttpay: function ttpay(data) {
    return request('/pay/tt/microapp', 'post', data);
  },
  payQuery: function payQuery(token, outTradeId) {
    return request('/pay/query', 'get', { token: token, outTradeId: outTradeId });
  },
  wxpaySaobei: function wxpaySaobei(data) {
    return request('/pay/lcsw/wxapp', 'post', data);
  },
  wxpayWepayez: function wxpayWepayez(data) {
    return request('/pay/wepayez/wxapp', 'post', data);
  },
  alipay: function alipay(data) {
    return request('/pay/alipay/semiAutomatic/payurl', 'post', data);
  },
  login_wx: function login_wx(code) {
    return request('/user/wxapp/login', 'post', {
      code: code
    });
  },
  loginWxaMobile: function loginWxaMobile(code, encryptedData, iv) {
    return request('/user/wxapp/login/mobile', 'post', {
      code: code,
      encryptedData: encryptedData,
      iv: iv
    });
  },
  login_username: function login_username(data) {
    return request('/user/username/login', 'post', data);
  },
  bindUsername: function bindUsername(token, username) {
    var pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/user/username/bindUsername', 'post', {
      token: token, username: username, pwd: pwd
    });
  },
  login_mobile: function login_mobile(mobile, pwd) {
    var deviceId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var deviceName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/m/login', 'post', {
      mobile: mobile, pwd: pwd, deviceId: deviceId, deviceName: deviceName
    });
  },
  resetPwdUseMobileCode: function resetPwdUseMobileCode(mobile, pwd, code) {
    return request('/user/m/reset-pwd', 'post', {
      mobile: mobile, pwd: pwd, code: code
    });
  },
  resetPwdUseEmailCode: function resetPwdUseEmailCode(email, pwd, code) {
    return request('/user/email/reset-pwd', 'post', {
      email: email, pwd: pwd, code: code
    });
  },
  register_complex: function register_complex(data) {
    return request('/user/wxapp/register/complex', 'post', data);
  },
  register_simple: function register_simple(data) {
    return request('/user/wxapp/register/simple', 'post', data);
  },
  register_username: function register_username(data) {
    return request('/user/username/register', 'post', data);
  },
  register_mobile: function register_mobile(data) {
    return request('/user/m/register', 'post', data);
  },
  banners: function banners(data) {
    return request('/banner/list', 'get', data);
  },
  goodsCategory: function goodsCategory() {
    return request('/shop/goods/category/all', 'get');
  },
  goodsCategoryDetail: function goodsCategoryDetail(id) {
    return request('/shop/goods/category/info', 'get', { id: id });
  },
  goods: function goods(data) {
    return request('/shop/goods/list', 'post', data);
  },
  goodsDetail: function goodsDetail(id) {
    return request('/shop/goods/detail', 'get', {
      id: id
    });
  },
  goodsLimitations: function goodsLimitations(goodsId) {
    var priceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shop/goods/limitation', 'get', {
      goodsId: goodsId, priceId: priceId
    });
  },
  goodsPrice: function goodsPrice(goodsId, propertyChildIds) {
    return request('/shop/goods/price', 'post', {
      goodsId: goodsId, propertyChildIds: propertyChildIds
    });
  },
  goodsPriceDaily: function goodsPriceDaily(goodsId) {
    var priceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shop/goods/price/day', 'get', {
      goodsId: goodsId, priceId: priceId
    });
  },
  goodsPriceFreight: function goodsPriceFreight(data) {
    return request('/shop/goods/price/freight', 'get', data);
  },
  goodsRebate: function goodsRebate(token, goodsId) {
    return request('/shop/goods/rebate/v2', 'get', {
      token: token, goodsId: goodsId
    });
  },
  goodsReputation: function goodsReputation(data) {
    return request('/shop/goods/reputation', 'post', data);
  },
  goodsFavList: function goodsFavList(data) {
    return request('/shop/goods/fav/list', 'post', data);
  },
  goodsFavPut: function goodsFavPut(token, goodsId) {
    return request('/shop/goods/fav/add', 'post', {
      token: token, goodsId: goodsId
    });
  },
  goodsFavCheck: function goodsFavCheck(token, goodsId) {
    return request('/shop/goods/fav/check', 'get', {
      token: token, goodsId: goodsId
    });
  },
  goodsFavDelete: function goodsFavDelete(token) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var goodsId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/shop/goods/fav/delete', 'post', {
      token: token, id: id, goodsId: goodsId
    });
  },
  coupons: function coupons(data) {
    return request('/discounts/coupons', 'get', data);
  },
  couponDetail: function couponDetail(id) {
    return request('/discounts/detail', 'get', {
      id: id
    });
  },
  myCoupons: function myCoupons(data) {
    return request('/discounts/my', 'get', data);
  },
  mergeCouponsRules: function mergeCouponsRules() {
    return request('/discounts/merge/list', 'get');
  },
  mergeCoupons: function mergeCoupons(data) {
    return request('/discounts/merge', 'post', data);
  },
  fetchCoupons: function fetchCoupons(data) {
    return request('/discounts/fetch', 'post', data);
  },
  sendCoupons: function sendCoupons(data) {
    return request('/discounts/send', 'post', data);
  },
  exchangeCoupons: function exchangeCoupons(token, number, pwd) {
    return request('/discounts/exchange', 'post', {
      token: token, number: number, pwd: pwd
    });
  },
  noticeList: function noticeList(data) {
    return request('/notice/list', 'post', data);
  },
  noticeLastOne: function noticeLastOne() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/notice/last-one', 'get', {
      type: type
    });
  },
  noticeDetail: function noticeDetail(id) {
    return request('/notice/detail', 'get', {
      id: id
    });
  },
  addAddress: function addAddress(data) {
    return request('/user/shipping-address/add', 'post', data);
  },
  updateAddress: function updateAddress(data) {
    return request('/user/shipping-address/update', 'post', data);
  },
  deleteAddress: function deleteAddress(token, id) {
    return request('/user/shipping-address/delete', 'post', {
      id: id,
      token: token
    });
  },
  queryAddress: function queryAddress(token) {
    return request('/user/shipping-address/list', 'get', {
      token: token
    });
  },
  defaultAddress: function defaultAddress(token) {
    return request('/user/shipping-address/default/v2', 'get', {
      token: token
    });
  },
  addressDetail: function addressDetail(token, id) {
    return request('/user/shipping-address/detail/v2', 'get', {
      id: id,
      token: token
    });
  },
  pingtuanSet: function pingtuanSet(goodsId) {
    return request('/shop/goods/pingtuan/set', 'get', {
      goodsId: goodsId
    });
  },
  pingtuanSets: function pingtuanSets(goodsIdArray) {
    return request('/shop/goods/pingtuan/sets', 'get', {
      goodsId: goodsIdArray.join()
    });
  },
  pingtuanOpen: function pingtuanOpen(token, goodsId) {
    return request('/shop/goods/pingtuan/open', 'post', {
      goodsId: goodsId,
      token: token
    });
  },
  pingtuanList: function pingtuanList(data) {
    return request('/shop/goods/pingtuan/list/v2', 'post', data);
  },
  pingtuanJoinUsers: function pingtuanJoinUsers(tuanId) {
    return request('/shop/goods/pingtuan/joiner', 'get', { tuanId: tuanId });
  },
  pingtuanMyJoined: function pingtuanMyJoined(data) {
    return request('/shop/goods/pingtuan/my-join-list', 'post', data);
  },
  friendlyPartnerList: function friendlyPartnerList() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/friendly-partner/list', 'post', {
      type: type
    });
  },
  friendList: function friendList(data) {
    return request('/user/friend/list', 'post', data);
  },
  addFriend: function addFriend(token, uid) {
    return request('/user/friend/add', 'post', { token: token, uid: uid });
  },
  friendUserDetail: function friendUserDetail(token, uid) {
    return request('/user/friend/detail', 'get', { token: token, uid: uid });
  },
  videoDetail: function videoDetail(videoId) {
    return request('/media/video/detail', 'get', {
      videoId: videoId
    });
  },
  bindMobileWxa: function bindMobileWxa(token, encryptedData, iv) {
    var pwd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/wxapp/bindMobile', 'post', {
      token: token, encryptedData: encryptedData, iv: iv, pwd: pwd
    });
  },
  bindMobileSms: function bindMobileSms(token, mobile, code) {
    var pwd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/m/bind-mobile', 'post', {
      token: token, mobile: mobile, code: code, pwd: pwd
    });
  },
  userDetail: function userDetail(token) {
    return request('/user/detail', 'get', {
      token: token
    });
  },
  userWxinfo: function userWxinfo(token) {
    return request('/user/wxinfo', 'get', {
      token: token
    });
  },
  userAmount: function userAmount(token) {
    return request('/user/amount', 'get', {
      token: token
    });
  },
  orderCreate: function orderCreate(data) {
    return request('/order/create', 'post', data);
  },
  orderList: function orderList(data) {
    return request('/order/list', 'post', data);
  },
  orderDetail: function orderDetail(token, id) {
    var hxNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/order/detail', 'get', {
      id: id,
      token: token,
      hxNumber: hxNumber
    });
  },
  orderDelivery: function orderDelivery(token, orderId) {
    return request('/order/delivery', 'post', {
      orderId: orderId,
      token: token
    });
  },
  orderReputation: function orderReputation(data) {
    return request('/order/reputation', 'post', data);
  },
  orderClose: function orderClose(token, orderId) {
    return request('/order/close', 'post', {
      orderId: orderId,
      token: token
    });
  },
  orderDelete: function orderDelete(token, orderId) {
    return request('/order/delete', 'post', {
      orderId: orderId,
      token: token
    });
  },
  orderPay: function orderPay(token, orderId) {
    return request('/order/pay', 'post', {
      orderId: orderId,
      token: token
    });
  },
  orderHX: function orderHX(hxNumber) {
    return request('/order/hx', 'post', {
      hxNumber: hxNumber
    });
  },
  orderStatistics: function orderStatistics(token) {
    return request('/order/statistics', 'get', {
      token: token
    });
  },
  orderRefunds: function orderRefunds(token, orderId) {
    return request('/order/refund', 'get', {
      token: token,
      orderId: orderId
    });
  },
  withDrawApply: function withDrawApply(token, money) {
    return request('/user/withDraw/apply', 'post', {
      money: money,
      token: token
    });
  },
  withDrawDetail: function withDrawDetail(token, id) {
    return request('/user/withDraw/detail', 'get', {
      token: token,
      id: id
    });
  },
  withDrawLogs: function withDrawLogs(data) {
    return request('/user/withDraw/list', 'post', data);
  },
  province: function province() {
    return request('/common/region/v2/province', 'get');
  },
  nextRegion: function nextRegion(pid) {
    return request('/common/region/v2/child', 'get', {
      pid: pid
    });
  },
  cashLogs: function cashLogs(data) {
    return request('/user/cashLog', 'post', data);
  },
  cashLogsV2: function cashLogsV2(data) {
    return request('/user/cashLog/v2', 'post', data);
  },
  payLogs: function payLogs(data) {
    return request('/user/payLogs', 'post', data);
  },
  rechargeSendRules: function rechargeSendRules() {
    return request('/user/recharge/send/rule', 'get');
  },
  payBillDiscounts: function payBillDiscounts() {
    return request('/payBill/discounts', 'get');
  },
  payBill: function payBill(token, money) {
    return request('/payBill/pay', 'post', { token: token, money: money });
  },
  vipLevel: function vipLevel() {
    return request('/config/vipLevel', 'get');
  },
  fxApply: function fxApply(token, name, mobile) {
    return request('/saleDistribution/apply', 'post', { token: token, name: name, mobile: mobile });
  },
  fxApplyProgress: function fxApplyProgress(token) {
    return request('/saleDistribution/apply/progress', 'get', { token: token });
  },
  fxMembers: function fxMembers(data) {
    return request('/saleDistribution/members', 'post', data);
  },
  fxCommisionLog: function fxCommisionLog(data) {
    return request('/saleDistribution/commision/log', 'post', data);
  },
  wxaQrcode: function wxaQrcode(data) {
    return request('/qrcode/wxa/unlimit', 'post', data);
  },
  uploadFile: function uploadFile(token, tempFilePath) {
    var expireHours = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var uploadUrl = API_BASE_URL + '/dfs/upload/file';
    return new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: uploadUrl,
        filePath: tempFilePath,
        name: 'upfile',
        formData: {
          'token': token,
          expireHours: expireHours
        },
        success: function success(res) {
          resolve(JSON.parse(res.data));
        },
        fail: function fail(error) {
          reject(error);
        },
        complete: function complete(aaa) {
          // 加载完成
        }
      });
    });
  },
  uploadFileFromUrl: function uploadFileFromUrl() {
    var remoteFileUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/dfs/upload/url', 'post', { remoteFileUrl: remoteFileUrl, ext: ext });
  },
  uploadFileList: function uploadFileList() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/dfs/upload/list', 'post', { path: path });
  },
  refundApply: function refundApply(data) {
    return request('/order/refundApply/apply', 'post', data);
  },
  refundApplyDetail: function refundApplyDetail(token, orderId) {
    return request('/order/refundApply/info', 'get', {
      token: token,
      orderId: orderId
    });
  },
  refundApplyCancel: function refundApplyCancel(token, orderId) {
    return request('/order/refundApply/cancel', 'post', {
      token: token,
      orderId: orderId
    });
  },
  cmsCategories: function cmsCategories() {
    return request('/cms/category/list', 'get', {});
  },
  cmsCategoryDetail: function cmsCategoryDetail(id) {
    return request('/cms/category/info', 'get', { id: id });
  },
  cmsArticles: function cmsArticles(data) {
    return request('/cms/news/list', 'post', data);
  },
  cmsArticleUsefulLogs: function cmsArticleUsefulLogs(data) {
    return request('/cms/news/useful/logs', 'post', data);
  },
  cmsArticleDetail: function cmsArticleDetail(id) {
    return request('/cms/news/detail', 'get', { id: id });
  },
  cmsArticlePreNext: function cmsArticlePreNext(id) {
    return request('/cms/news/preNext', 'get', { id: id });
  },
  cmsArticleCreate: function cmsArticleCreate(data) {
    return request('/cms/news/put', 'post', data);
  },
  cmsArticleDelete: function cmsArticleDelete(token, id) {
    return request('/cms/news/del', 'post', { token: token, id: id });
  },
  cmsArticleUseless: function cmsArticleUseless(data) {
    return request('/cms/news/useful', 'post', data);
  },
  cmsPage: function cmsPage(key) {
    return request('/cms/page/info/v2', 'get', { key: key });
  },
  cmsTags: function cmsTags() {
    return request('/cms/tags/list', 'get', {});
  },
  invoiceList: function invoiceList(data) {
    return request('/invoice/list', 'post', data);
  },
  invoiceApply: function invoiceApply(data) {
    return request('/invoice/apply', 'post', data);
  },
  invoiceDetail: function invoiceDetail(token, id) {
    return request('/invoice/info', 'get', { token: token, id: id });
  },
  depositList: function depositList(data) {
    return request('/deposit/list', 'post', data);
  },
  payDeposit: function payDeposit(data) {
    return request('/deposit/pay', 'post', data);
  },
  depositInfo: function depositInfo(token, id) {
    return request('/deposit/info', 'get', { token: token, id: id });
  },
  depositBackApply: function depositBackApply(token, id) {
    return request('/deposit/back/apply', 'post', { token: token, id: id });
  },
  fetchShops: function fetchShops(data) {
    return request('/shop/subshop/list', 'post', data);
  },
  fetchMyShops: function fetchMyShops(token) {
    return request('/shop/subshop/my', 'get', { token: token });
  },
  shopSubdetail: function shopSubdetail(id) {
    return request('/shop/subshop/detail/v2', 'get', { id: id });
  },
  shopSubApply: function shopSubApply(data) {
    return request('/shop/subshop/apply', 'post', data);
  },
  addComment: function addComment(data) {
    return request('/comment/add', 'post', data);
  },
  commentList: function commentList(data) {
    return request('/comment/list', 'post', data);
  },
  modifyUserInfo: function modifyUserInfo(data) {
    return request('/user/modify', 'post', data);
  },
  modifyUserPassword: function modifyUserPassword(token, pwdOld, pwdNew) {
    return request('/user/modify/password', 'post', { token: token, pwdOld: pwdOld, pwdNew: pwdNew });
  },
  uniqueId: function uniqueId() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/uniqueId/get', 'get', { type: type });
  },
  queryBarcode: function queryBarcode() {
    var barcode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/barcode/info', 'get', { barcode: barcode });
  },
  luckyInfo: function luckyInfo(id) {
    return request('/luckyInfo/info/v2', 'get', { id: id });
  },
  luckyInfoJoin: function luckyInfoJoin(id, token) {
    return request('/luckyInfo/join', 'post', { id: id, token: token });
  },
  luckyInfoJoinMy: function luckyInfoJoinMy(id, token) {
    return request('/luckyInfo/join/my', 'get', { id: id, token: token });
  },
  luckyInfoJoinLogs: function luckyInfoJoinLogs(data) {
    return request('/luckyInfo/join/logs', 'post', data);
  },
  jsonList: function jsonList(data) {
    return request('/json/list', 'post', data);
  },
  jsonSet: function jsonSet(data) {
    return request('/json/set', 'post', data);
  },
  jsonDelete: function jsonDelete() {
    var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var id = arguments[1];

    return request('/json/delete', 'post', { token: token, id: id });
  },
  graphValidateCodeUrl: function graphValidateCodeUrl() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.random();

    var _url = API_BASE_URL + '/verification/pic/get?key=' + key;
    return _url;
  },
  graphValidateCodeCheck: function graphValidateCodeCheck() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.random();
    var code = arguments[1];

    return request('/verification/pic/check', 'post', { key: key, code: code });
  },
  shortUrl: function shortUrl() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/common/short-url/shorten', 'post', { url: url });
  },
  smsValidateCode: function smsValidateCode(mobile) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var picCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/verification/sms/get', 'get', { mobile: mobile, key: key, picCode: picCode });
  },
  smsValidateCodeCheck: function smsValidateCodeCheck(mobile, code) {
    return request('/verification/sms/check', 'post', { mobile: mobile, code: code });
  },
  mailValidateCode: function mailValidateCode(mail) {
    return request('/verification/mail/get', 'get', { mail: mail });
  },
  mailValidateCodeCheck: function mailValidateCodeCheck(mail, code) {
    return request('/verification/mail/check', 'post', { mail: mail, code: code });
  },
  mapDistance: function mapDistance(lat1, lng1, lat2, lng2) {
    return request('/common/map/distance', 'get', { lat1: lat1, lng1: lng1, lat2: lat2, lng2: lng2 });
  },
  mapQQAddress: function mapQQAddress() {
    var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var coord_type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '5';

    return request('/common/map/qq/address', 'get', { location: location, coord_type: coord_type });
  },
  mapQQSearch: function mapQQSearch(data) {
    return request('/common/map/qq/search', 'post', data);
  },
  virtualTraderList: function virtualTraderList(data) {
    return request('/virtualTrader/list', 'post', data);
  },
  virtualTraderDetail: function virtualTraderDetail(token, id) {
    return request('/virtualTrader/info', 'get', { token: token, id: id });
  },
  virtualTraderBuy: function virtualTraderBuy(token, id) {
    return request('/virtualTrader/buy', 'post', { token: token, id: id });
  },
  virtualTraderMyBuyLogs: function virtualTraderMyBuyLogs(data) {
    return request('/virtualTrader/buy/logs', 'post', data);
  },
  queuingTypes: function queuingTypes() {
    var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/queuing/types', 'get', { status: status });
  },
  queuingGet: function queuingGet(token, typeId) {
    var mobile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/queuing/get', 'post', { token: token, typeId: typeId, mobile: mobile });
  },
  queuingMy: function queuingMy(token) {
    var typeId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/queuing/my', 'get', { token: token, typeId: typeId, status: status });
  },
  idcardCheck: function idcardCheck(token, name, idCardNo) {
    return request('/user/idcard', 'post', { token: token, name: name, idCardNo: idCardNo });
  },
  loginout: function loginout(token) {
    return request('/user/loginout', 'get', { token: token });
  },
  userLevelList: function userLevelList(data) {
    return request('/user/level/list', 'post', data);
  },
  userLevelDetail: function userLevelDetail(levelId) {
    return request('/user/level/info', 'get', { id: levelId });
  },
  userLevelPrices: function userLevelPrices(levelId) {
    return request('/user/level/prices', 'get', { levelId: levelId });
  },
  userLevelBuy: function userLevelBuy(token, priceId) {
    var isAutoRenew = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var remark = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/level/buy', 'post', {
      token: token,
      userLevelPriceId: priceId,
      isAutoRenew: isAutoRenew,
      remark: remark
    });
  },
  userLevelBuyLogs: function userLevelBuyLogs(data) {
    return request('/user/level/buyLogs', 'post', data);
  },
  messageList: function messageList(data) {
    return request('/user/message/list', 'post', data);
  },
  messageRead: function messageRead(token, id) {
    return request('/user/message/read', 'post', { token: token, id: id });
  },
  messageDelete: function messageDelete(token, id) {
    return request('/user/message/del', 'post', { token: token, id: id });
  },
  bindOpenid: function bindOpenid(token, code) {
    return request('/user/wxapp/bindOpenid', 'post', {
      token: token, code: code,
      type: 2
    });
  },
  encryptedData: function encryptedData(code, _encryptedData, iv) {
    return request('/user/wxapp/decode/encryptedData',  'post', {
      code: code, encryptedData: _encryptedData, iv: iv
    });
  },
  scoreDeductionRules: function scoreDeductionRules() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/score/deduction/rules', 'get', { type: type });
  },
  voteItems: function voteItems(data) {
    return request('/vote/items', 'post', data);
  },
  voteItemDetail: function voteItemDetail(id) {
    return request('/vote/info', 'get', { id: id });
  },
  vote: function vote(token, voteId, items, remark) {
    return request('/vote/vote', 'post', {
      token: token, voteId: voteId,
      items: items.join(),
      remark: remark
    });
  },
  myVote: function myVote(token, voteId) {
    return request('/vote/vote/info', 'get', {
      token: token, voteId: voteId
    });
  },
  voteLogs: function voteLogs(data) {
    return request('/vote/vote/list', 'post', data);
  },
  yuyueItems: function yuyueItems(data) {
    return request('/yuyue/items', 'post', data);
  },
  yuyueItemDetail: function yuyueItemDetail(id) {
    return request('/yuyue/info', 'get', { id: id });
  },
  yuyueJoin: function yuyueJoin(data) {
    return request('/yuyue/join', 'post', data);
  },
  yuyueJoinPay: function yuyueJoinPay(token, joinId) {
    return request('/yuyue/pay', 'post', {
      token: token, joinId: joinId
    });
  },
  yuyueJoinUpdate: function yuyueJoinUpdate(token, joinId, extJsonStr) {
    return request('/yuyue/join/update', 'post', {
      token: token, joinId: joinId, extJsonStr: extJsonStr
    });
  },
  yuyueMyJoinInfo: function yuyueMyJoinInfo(token, joinId) {
    return request('/yuyue/join/info', 'post', {
      token: token, joinId: joinId
    });
  },
  yuyueMyJoinLogs: function yuyueMyJoinLogs(data) {
    return request('/yuyue/join/list', 'post', data);
  },
  yuyueTeams: function yuyueTeams(data) {
    return request('/yuyue/info/teams', 'post', data);
  },
  yuyueTeamDetail: function yuyueTeamDetail(teamId) {
    return request('/yuyue/info/team', 'get', { teamId: teamId });
  },
  yuyueTeamMembers: function yuyueTeamMembers(data) {
    return request('/yuyue/info/team/members', 'post', data);
  },
  yuyueTeamDeleteMember: function yuyueTeamDeleteMember(token, joinId) {
    return request('/yuyue/info/team/members/del', 'post', data);
  },
  register_email: function register_email(data) {
    return request('/user/email/register', 'post', data);
  },
  login_email: function login_email(data) {
    return request('/user/email/login', 'post', data);
  },
  bindEmail: function bindEmail(token, email, code) {
    var pwd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/email/bindUsername', 'post', {
      token: token, email: email, code: code, pwd: pwd
    });
  },
  siteStatistics: function siteStatistics() {
    return request('/site/statistics', 'get');
  },
  goodsDynamic: function goodsDynamic(type) {
    return request('/site/goods/dynamic', 'get', { type: type });
  },
  fetchSubDomainByWxappAppid: function fetchSubDomainByWxappAppid(appid) {
    return request('/subdomain/appid/wxapp', 'get', { appid: appid });
  },
  cmsArticleFavPut: function cmsArticleFavPut(token, newsId) {
    return request('/cms/news/fav/add', 'post', { token: token, newsId: newsId });
  },
  cmsArticleFavCheck: function cmsArticleFavCheck(token, newsId) {
    return request('/cms/news/fav/check', 'get', { token: token, newsId: newsId });
  },
  cmsArticleFavList: function cmsArticleFavList(data) {
    return request('/cms/news/fav/list', 'post', data);
  },
  cmsArticleFavDeleteById: function cmsArticleFavDeleteById(token, id) {
    return request('/cms/news/fav/delete', 'post', { token: token, id: id });
  },
  cmsArticleFavDeleteByNewsId: function cmsArticleFavDeleteByNewsId(token, newsId) {
    return request('/cms/news/fav/delete', 'post', { token: token, newsId: newsId });
  },
  shippingCarInfo: function shippingCarInfo(token) {
    return request('/shopping-cart/info', 'get', {
      token: token
    });
  },
  shippingCarInfoAddItem: function shippingCarInfoAddItem(token, goodsId, number, sku) {
    return request('/shopping-cart/add', 'post', {
      token: token, goodsId: goodsId, number: number, sku: JSON.stringify(sku)
    });
  },
  shippingCarInfoModifyNumber: function shippingCarInfoModifyNumber(token, key, number) {
    return request('/shopping-cart/modifyNumber', 'post', {
      token: token, key: key, number: number
    });
  },
  shippingCarInfoRemoveItem: function shippingCarInfoRemoveItem(token, key) {
    return request('/shopping-cart/remove', 'post', {
      token: token, key: key
    });
  },
  shippingCarInfoRemoveAll: function shippingCarInfoRemoveAll(token) {
    return request('/shopping-cart/empty', 'post', {
      token: token
    });
  },
  growthLogs: function growthLogs(data) {
    return request('/growth/logs', 'post', data);
  },
  exchangeScoreToGrowth: function exchangeScoreToGrowth(token, deductionScore) {
    return request('/growth/exchange', 'post', {
      token: token, deductionScore: deductionScore
    });
  },
  wxaMpLiveRooms: function wxaMpLiveRooms() {
    return request('/wx/live/rooms', 'get');
  },
  wxaMpLiveRoomHisVedios: function wxaMpLiveRoomHisVedios(roomId) {
    return request('/wx/live/his', 'get', {
      roomId: roomId
    });
  }
};