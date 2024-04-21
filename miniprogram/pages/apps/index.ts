// @ts-nocheck
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
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击思维导图
    clickMindMap: function() {
      wx.showToast({ title: '功能正在开发中，敬请期待', icon: 'none' });
      // wx.navigateTo({
      //   url: '../apps/pages/mind-map/index',
      // });
    },

    // 点击DELL画图
    clickDelle: function() {
      wx.showToast({ title: '功能正在开发中，敬请期待', icon: 'none' });
    },

    // 点击MJ画图
    clickMJ: function() {
      wx.showToast({ title: '功能正在开发中，敬请期待', icon: 'none' });
    },

    // 点击语音交互
    clicVoice: function() {
      wx.showToast({ title: '功能正在开发中，敬请期待', icon: 'none' });
    }
  },
  lifetimes: {
    attached: function() {
      // this.clickMindMap();
    }
  }
})