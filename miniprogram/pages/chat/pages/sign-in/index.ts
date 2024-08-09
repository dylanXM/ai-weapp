import { store } from '../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { getFirstDayOfMonthTimestamp, getLastDayOfMonthTimestamp } from '../../../../utils/util';
import { getSignMap } from '../../../../utils/sign';
import { getSignList, getUserInfo, signOn } from '../../../../api/index';

let _this: any = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendar: {
      visible: false,
      minDay: getFirstDayOfMonthTimestamp(),
      maxDay: getLastDayOfMonthTimestamp(),
    },
    formatter: function(day: any) {
      if (!_this?.data) {
        return day;
      }
      const { signList } = _this.data;
      const signMap = getSignMap(signList);
      const timeOfDay = new Date(day.date).getTime();
      if (signMap[timeOfDay]) {
        day.bottomInfo = '已签到';
      }
      return day;
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['signList'],
      actions: ['setState', 'setStates'],
    });

    setTimeout(() => {
      const { calendar } = this.data;  
      this.setData({ calendar: { ...calendar, visible: true } })
    }, 100);

    _this = this;

    this.showAd();
  },

  showAd() {
    // 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
    // 在页面中定义插屏广告
    let interstitialAd = null

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-f17185bdad4224d2'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {
        console.error('插屏广告加载失败', err)
      })
      interstitialAd.onClose(() => {})
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error('插屏广告显示失败', err)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 用户点击返回
   */
  onBack() {
    wx.navigateBack();
  },

  // 前端确认按钮
  confirmSignOn: async function(event: any) {
    try {
      // 签到
      await signOn();
      wx.showToast({ title: '签到成功！积分奖励已发放～', icon: 'none' });
      // 更新
      getSignList().then(res => this.setState('signList', res));
      getUserInfo().then(user => this.setState('user', user));
    } catch (err) {
      wx.showToast({ title: err?.message || '接口出错了，请重试～', icon: 'none' });
    } finally {
      setTimeout(() => {
        this.onBack();
      }, 2000);
    }
  },
})