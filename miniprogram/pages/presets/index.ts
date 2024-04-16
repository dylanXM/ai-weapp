import { IAppOption } from '../../../typings';
import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { queryPresetsCats, queryPresetsList } from '../../api/category/index';
import { getRandom, colors, icons } from '../../utils/icon';

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
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
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

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始数据获取
    getPresets: async function () {
      const [categories, presets] = await Promise.all([queryPresetsCats(), queryPresetsList()]);
      console.log('categories', categories, presets);
      // const presets = await queryPresetsList();
      // const newcategories = [firstCategory, ...categories.rows.map((cat: any) => {
      //   const list = presets.rows.filter((it: any) => it.catId === cat.id);
      //   return { ...cat, list };
      // })];
      const newPresets = presets.rows.map((item: any) => ({
        ...item,
        color: getRandom(colors),
        icon: getRandom(icons),
      }))
      this.setData({ presets: newPresets, allPresets: newPresets });
      this.setState('allPresets', newPresets);
    },
    searchPresets: function (event: any) {
      const query = event.detail;
      // @ts-ignore
      const { allPresets } = this.data;
      if (!query) {
        this.setData({ presets: allPresets });
        this.setState('allPresets', allPresets);    
      }
      const formatedQuery = query.toLowerCase();
      const newPresets = allPresets.filter((preset: any) => {
        const { name, des } = preset;
        return name.toLowerCase().includes(formatedQuery) || des.toLowerCase().includes(formatedQuery);
      });
      this.setData({ presets: newPresets });
    },
    handleClickPreset: function (event: any) {
      const appId = event.currentTarget.dataset.id;
      this.triggerEvent("clickApp", { key: appId });
    }
  },
  lifetimes: {
    attached() {
      this.getPresets();
    },
  }
})