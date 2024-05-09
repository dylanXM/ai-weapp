import { IAppOption } from '../typings';
import {
  queryFront,
  queryModelList,
  queryBaseModel,
  getSignList,
  queryPresetsList,
  getUserInfo,
} from './api/index';
import { store } from './store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { login } from './utils/login';

// app.ts
App<IAppOption>({
  onLaunch() {
    // @ts-ignore
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      actions: ['setState', 'setStates'],
    })
    this.initNavBar();
    this.getConfigs();
    // 登录
    wx.login({
      success: async res => {
        try {
          this.loginSuccess(res.code);
        } catch (err) {
          wx.navigateTo({
            url: '../login/index',
          })
        }
      },
    });
  },

  initNavBar() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    const navbar = {
      navBarHeight: systemInfo.statusBarHeight + 44,
      menuRight: systemInfo.screenWidth - menuButtonInfo.right,
      menuTop: menuButtonInfo.top,
      menuHeight: menuButtonInfo.height,
    }
    // @ts-ignore
    this.setState('navBar', navbar);
  },

  getConfigs() {
    // 获取页面配置信息
    // @ts-ignore
    queryFront().then(res => this.setStates({ ...res }));

    // 获取模型数据
    // @ts-ignore
    queryBaseModel().then(res => this.setState('model', res.modelInfo));
    // @ts-ignore
    queryModelList().then(res => this.setState('modelList', res));

    // 获取所有预设数据
    queryPresetsList().then(res => this.setState('allPresets', res.rows));
  },

  async loginSuccess(code: string) {
    const token = await login(code);
    if (!token) return;
    // 获取签到数据
    getSignList().then(res => this.setState('signList', res));
    const user = await getUserInfo();
    // @ts-ignore
    this.setStates({ user, globalLoading: false });
  },

})