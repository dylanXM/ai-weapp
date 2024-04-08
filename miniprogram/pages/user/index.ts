import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';

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
  },

  // @ts-ignore
  storeBindings: {
    store,
    fields: {
      navBar: 'navBar',
      user: 'user',
      userBalance: 'userBalance',
    },
  },

  observers: {
    user: function (data) {
      console.log('data', data);
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
      console.log('wx-admin to');
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
    clickSignOn: function() {
      wx.navigateTo({
        url: '../user/pages/sign-on/index',
      });
    },

    // 点击卡密兑换
    clickKami: function() {
      wx.navigateTo({
        url: '../user/pages/kami/index',
      });
    }
    
  },
  lifetimes: {
    attached() {
      this.clickSignOn();
    },
  }
})