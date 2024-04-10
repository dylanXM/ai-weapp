// @ts-nocheck
import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import Toast from '@vant/weapp/toast/toast';

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
      wx.navigateTo({
        url: '../apps/pages/mind-map/index',
      });
    },

    // 点击DELL画图
    clickDelle: function() {
      Toast('功能正在开发中，敬请期待');
    },

    // 点击MJ画图
    clickMJ: function() {
      Toast('功能正在开发中，敬请期待');
    }
  },
  lifetimes: {
    attached: function() {
      // this.clickMindMap();
    }
  }
})