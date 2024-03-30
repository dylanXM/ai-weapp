import { IAppOption } from '../../../typings';
import { listenKeyboardHeightChange } from '../../utils/keyboards';
import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';

// 获取应用实例
const app = getApp<IAppOption>();

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
    bottomSafeHeight: 0,
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
    // 监听键盘高度
    subscribeKeyboard: function () {
      // 全局注册键盘高度
      listenKeyboardHeightChange({
        safeHieghtCallback: () => false,
        keyboardHeightCallback: (keyboardHeight: number) => {
          this.setData({ keyboardHeight });
        }
      });
    },
  },

  attached() {
    this.subscribeGlobalData();
  },
})