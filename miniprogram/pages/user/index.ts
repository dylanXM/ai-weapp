import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { getFirstDayOfMonthTimestamp, getLastDayOfMonthTimestamp, getToday } from '../../utils/util';
import { getSignMap } from '../../utils/sign';
import { signOn, getSignList, getUserInfo } from '../../api/index';

let _this: any = null;

Component({
  behaviors: [storeBindingsBehavior],
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    calendar: {
      visible: false,
      minDay: getFirstDayOfMonthTimestamp(),
      maxDay: getLastDayOfMonthTimestamp(),
      today: getToday(),
    },
    formatter: function(day: any) {
      if (!_this?.data) {
        return day;
      }
      const { signList } = _this.data;
      const signMap = getSignMap(signList);
      const timeOfDay = new Date(day.date).getTime();
      if (signMap[timeOfDay]) {
        day.suffix = '已签到';
      }
      return day;
    },
  },

  // @ts-ignore
  storeBindings: {
    store,
    fields: {
      navBar: 'navBar',
      user: 'user',
      userBalance: 'userBalance',
      signList: 'signList',
    },
    actions: {
      setState: "setState",
    },
  },

  observers: {
    calendar: function (data) {
      console.log('calendar', data, getToday());
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击微信公众号
    clickWXofficial: function() {
      wx.navigateTo({
        url: '../user/pages/wx-official/index',
      });
    },

    // 点击网页版
    clickAIWeb: function() {
      wx.navigateTo({
        url: '../user/pages/ai-web/index',
      });
    },

    // 点击管理员
    clickWXAdmin: function() {
      wx.navigateTo({
        url: '../user/pages/wx-admin/index',
      });
    },
    // 点击绑定邮箱
    clickConnectEmail: function() {
      wx.navigateTo({
        url: '../user/pages/connect-email/index',
      });
    },

    // 点击商城
    clickShop: function() {
      wx.navigateTo({
        url: '../user/pages/shop/index',
      });
    },

    // 点击签到
    clickSignOn: async function() {
      // wx.navigateTo({
      //   url: '../user/pages/sign-on/index',
      // });
      const { calendar } = this.data;
      this.setData({ calendar: { ...calendar, visible: true } });
    },

    // 关闭签到弹窗
    closeSignOn: function() {
      const { calendar } = this.data;
      this.setData({ calendar: { ...calendar, visible: false, signList: [] } });
    },

    // 前端确认按钮
    confirmSignOn: async function(event: any) {
      try {
        // 签到
        await signOn();
        // 更新
        getSignList().then(res => this.setState('signList', res));
        getUserInfo().then(user => this.setState('user', user));
        wx.showToast({ title: '签到成功！积分奖励已发放～', icon: 'none' });
        Toast('签到成功！积分奖励已发放～');
        // 关闭
        this.closeSignOn();
      } catch (err) {
        wx.showToast({ title: err?.message || '接口出错了，请重试～', icon: 'none' });
      }
    },

    // 点击卡密兑换
    clickKami: function() {
      wx.navigateTo({
        url: '../user/pages/kami/index',
      });
    },
    
  },
  lifetimes: {
    attached() {
      _this = this;
      // this.clickSignOn();
    },
  }
})