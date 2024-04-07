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

    // 点击网页版

    // 点击管理员
    clickWXAdmin: function() {
      console.log('wx-admin to');
      wx.navigateTo({
        url: '../user/pages/wx-admin/index',
        success: function (res) {
          console.log('res', res);
        },
        fail: function (err) {
          console.log('err', err);
        }
      });
    }
    // 点击绑定邮箱

    // 点击商城

    // 点击签到

    // 点击卡密兑换
    
  },
  lifetimes: {
    attached() {
    },
  }
})