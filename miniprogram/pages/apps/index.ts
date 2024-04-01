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
  },
  lifetimes: {
    attached() {
      this.subscribeKeyboard();
    },
  }
})