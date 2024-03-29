import { GlobalData, GlobalDataKey, IAppOption, ListenersType } from '../typings';
import { UserData } from './api/auth/type';
import { QueryFrontRes } from './api/config/type';
import {
  getWechatSession,
  queryFront,
  wxLogin,
  getUserInfo,
  queryModelList,
  queryBaseModel,
} from './api/index';
import { BaseModelData, ModelData } from './api/model/type';

// app.ts
App<IAppOption>({
  towxml: require('./towxml/index'),
  globalData: {
    menuList: [],
    user: {} as UserData,
    model: {} as BaseModelData, 
    modelList: {} as ModelData,
    loading: true,
    navBar: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距底部间距（保持底部间距一致）
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    }
  },
  onLaunch() {

    this.initNavBar();
    // 登录
    wx.login({
      success: async res => {
        console.log(res);
        const session = await getWechatSession({ code: res.code });
        wx.setStorageSync('openId', session.openId);
        wx.setStorageSync('sessionKey', session.sessionKey);
        const token = await wxLogin({ openId: session.openId });
        wx.setStorageSync('token', token);
        if (!token) return;
        const user = await getUserInfo();
        this.setGlobalData('user', user);
        this.setGlobalData('loading', false);
      },
    });
    // 获取页面配置信息
    queryFront().then(res => {
      console.log('res', res);
      // @ts-ignore
      Object.keys(res).forEach(<T extends keyof QueryFrontRes>(key: T) => {
        this.globalData[key] = res[key] as GlobalData[T];
      })
    });
    // queryMenuList().then(res => this.globalData = { ...this.globalData, menuList: res });
    // 获取模型数据
    queryBaseModel().then(res => this.setGlobalData('model', res));
    queryModelList().then(res => this.setGlobalData('modelList', res))
  },
  listeners: {} as ListenersType, // 存放每个字段的监听函数数组

  // 设置全局数据，并检查是否需要触发监听器
  setGlobalData: function(key, value) {
    this.globalData[key] = value;
    // 如果存在监听此字段的函数，则触发它们
    if (this.listeners[key]) {
      this.listeners[key].forEach(listener => {
        listener(value);
      });
    }
  },

  // 添加监听器
  addListener: function(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  },

  // 移除监听器
  removeListener: function(key, callback) {
    const listeners = this.listeners[key];
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  },

  initNavBar() {
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    that.globalData.navBar.navBarHeight = systemInfo.statusBarHeight + 44;
    that.globalData.navBar.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.navBar.menuTop=  menuButtonInfo.top;
    that.globalData.navBar.menuHeight = menuButtonInfo.height;
  }

})