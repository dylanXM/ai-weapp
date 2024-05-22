import { IAppOption } from '../typings';
import {
  queryFront,
  queryModelList,
  queryBaseModel,
  getSignList,
  queryPresetsList,
  getUserInfo,
  queryMyPresetsList,
} from './api/index';
import { store } from './store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { login } from './utils/login';
import { formatMyPreset } from './utils/preset';

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
    this.shareConfig();
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
    // @ts-ignore 获取页面配置信息
    queryFront().then(res => this.setStates({ ...res }));
    // @ts-ignore 获取模型数据
    queryBaseModel().then(res => this.setState('model', res.modelInfo));
    // @ts-ignore
    queryModelList().then(res => this.setState('modelList', res));
    // @ts-ignore 获取所有预设数据
    queryPresetsList().then(res => this.setState('allPresets', res.rows));
    // @ts-ignore 获取所有我的预设数据
    queryMyPresetsList().then(res => this.setState('allMinePresets', res.rows.map((item: any) => formatMyPreset(item))))
  },

  shareConfig() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
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