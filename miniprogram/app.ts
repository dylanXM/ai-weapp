import { IAppOption } from '../typings';
import { UserData } from './api/auth/type';
import {
  getWechatSession,
  queryFront,
  wxLogin,
  getUserInfo,
  queryModelList,
  queryBaseModel,
} from './api/index';
import { BaseModelData, ModelData } from './api/model/type';
import { store } from './store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';

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
    // @ts-ignore
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      actions: ['setState', 'setStates'],
    })
    this.initNavBar();
    // 登录
    wx.login({
      success: async res => {
        const session = await getWechatSession({ code: res.code });
        wx.setStorageSync('openId', session.openId);
        wx.setStorageSync('sessionKey', session.sessionKey);
        const token = await wxLogin({ openId: session.openId });
        wx.setStorageSync('token', token);
        if (!token) return;
        const user = await getUserInfo();
        // @ts-ignore
        this.setStates({ user, loading: false });
      },
    });
    // 获取页面配置信息
    // @ts-ignore
    queryFront().then(res => this.setStates({ ...res }));

    // 获取模型数据
    // @ts-ignore
    queryBaseModel().then(res => this.setState('model', res.modelInfo));
    // @ts-ignore
    queryModelList().then(res => this.setState('modelList', res))
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
  }

})