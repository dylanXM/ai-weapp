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