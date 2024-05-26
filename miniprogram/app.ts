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
    const _this = this;
    const queryFrontFn = async function() {
      try {
        const res = await queryFront();
        // @ts-ignore 获取页面配置信息
        _this.setStates({ ...res })
      } catch (err) {
        queryFrontFn();
      }
    }
    queryFrontFn();

    const queryBaseModelFn = async function() {
      try {
        const res = await queryBaseModel();
        // @ts-ignore 获取模型数据
        _this.setState('model', res.modelInfo)
      } catch (err) {
        queryBaseModelFn();
      }
    };
    queryBaseModelFn();

    const queryModelListFn = async function() {
      try {
        const res = await queryModelList();
        // @ts-ignore
        _this.setState('modelList', res)
      } catch (err) {
        queryModelListFn();
      }
    };
    queryModelListFn();

    const queryPresetsListFn = async function() {
      try {
        const res = await queryPresetsList();
        // @ts-ignore 获取所有预设数据
        _this.setState('allPresets', res.rows)
      } catch (err) {
        queryPresetsListFn();
      }
    };
    queryPresetsListFn();

    const queryMyPresetsListFn = async function() {
      try {
        const res = await queryMyPresetsList();
        // @ts-ignore 获取所有我的预设数据
        _this.setState('allMinePresets', res.rows.map((item: any) => formatMyPreset(item)))
      } catch (err) {
        queryMyPresetsListFn();
      }
    };
    queryMyPresetsListFn();
  },

  shareConfig() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  async loginSuccess(code: string) {
    const _this = this;
    try {
      const token = await login(code);
      if (!token) return;
      // 获取签到数据
      getSignList().then(res => this.setState('signList', res));
      const user = await getUserInfo();
      // @ts-ignore
      this.setStates({ user, globalLoading: false });
    } catch (err) {
      wx.navigateTo({
        url: '../login/index',
        fail: function(err) {
          console.error('err', err);
        },
        events: {
          'reLogin': function() {
            _this.getConfigs();
          }
        }
      })
      // this.loginSuccess(code);
    }
  },

})