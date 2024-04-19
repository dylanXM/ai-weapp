import { IAppOption } from '../../../typings';
import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { queryPresetsCats, queryPresetsList, queryMyPresetsList } from '../../api/category/index';

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
    presets: [],
    activeKey: 'list' as 'list' | 'mineApps',
    myPresets: {
      list: [],
      all: [],
    },
    query: '',
  },

  // @ts-ignore
  storeBindings: {
    store,
    fields: {
      navBar: 'navBar',
      user: 'user',
      allPresets: 'allPresets'
    },
    actions: {
      setState: "setState",
    },
  },

  observers: {
    activeKey: function(data) {
      if (data === 'mineApps') {
        this.getMyPresets().then(() => this.searchPresets());
      } else {
        this.searchPresets();
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始数据获取
    getPresets: async function () {
      const [categories, presets] = await Promise.all([queryPresetsCats(), queryPresetsList()]);
      // console.log('categories', categories, presets);
      const firstCategory = {
        id: 0,
        name: 'ALL',
        list: presets.rows,
      };
      // const presets = await queryPresetsList();
      const newcategories = [firstCategory, ...categories.rows.map((cat: any) => {
        const list = presets.rows.filter((it: any) => it.catId === cat.id);
        return { ...cat, list };
      })];
      // console.log('newcategories', newcategories);
      const newPresets = presets.rows.map((item: any) => ({
        ...item,
      }))
      this.setData({ presets: newPresets, allPresets: newPresets });
      this.setState('allPresets', newPresets);
    },
    getMyPresets: async function() {
      const presets = await queryMyPresetsList();
      const newPresets = presets.rows.map((item: any) => ({
        ...item,
      }));
      this.setData({ myPresets: { list: newPresets, all: newPresets }, presets: newPresets });
    },
    searchPresets: function () {
      const { activeKey, query } = this.data;
      // @ts-ignore
      const { allPresets, myPresets } = this.data;
      const searchPresets = activeKey === 'list' ? allPresets : myPresets.all;
      if (!query) {
        this.setData({ presets: searchPresets });
        this.setState('allPresets', allPresets);    
      }
      const formatedQuery = query.toLowerCase().trim();
      const newPresets = searchPresets.filter((preset: any) => {
        const { name, des } = preset;
        return name.toLowerCase().includes(formatedQuery) || des.toLowerCase().includes(formatedQuery);
      });
      this.setData({ presets: newPresets });
    },
    handleClickPreset: function (event: any) {
      const appId = event.currentTarget.dataset.id;
      this.triggerEvent("clickApp", { key: appId });
    },
    handleClickActiveTab: function(event: any) {
      this.setData({ activeKey: event.currentTarget.dataset.tab });
    },
    handleQueryChange: function(event: any) {
      const query = event.detail;
      this.setData({ query: query });
    },
    handleClickAddPresets: function() {
      wx.showToast({ title: '功能开发中～', icon: 'none', duration: 2000 });
    }
  },
  lifetimes: {
    attached() {
      this.getPresets();
    },
  }
})