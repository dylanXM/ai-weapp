import { isEmptyObj } from '../../utils/common';
import { IAppOption } from '../../../typings';
import { UserData } from '../../api/auth/type';
import { listenKeyboardHeightChange } from '../../utils/keyboards';

// 获取应用实例
const app = getApp<IAppOption>();

Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    navBar: {
      navBarHeight: app.globalData.navBar.navBarHeight,
      menuRight: app.globalData.navBar.menuRight,
      menuTop: app.globalData.navBar.menuTop,
      menuHeight: app.globalData.navBar.menuHeight,
    },
    user: app.globalData.user,
    bottomSafeHeight: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 监听全局变量
    subscribeGlobalData: function () {
      console.log('user data', this.data);
      const { user } = this.data;
      // 添加监听器
      if (isEmptyObj(user)) {
        app.addListener('user', user => {
          this.setData({ user: user as UserData });
        });
      }
    },
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