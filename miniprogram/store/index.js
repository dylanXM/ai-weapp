import { observable, action } from 'mobx-miniprogram';

export const store = observable({
  // 数据字段
  menuList: [],
  user: {},
  model: {}, 
  modelList: {},
  loading: true,
  navBar: {
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
  },
  userBalance: {
    modelCount: 0,
    useModelToken: 0,
    modelPrice: 0,
    modelType: 1,
  },

  // 计算属性, 暂时不需要
  // get sum() {
  //   return this.numA + this.numB;
  // },

  // actions
  setState: action(function (key, value) {
    this[key] = value;
  }),

  setStates: action(function (values) {
    const keys = Object.keys(values);
    keys.forEach(key => {
      this[key] = values[key];
    });
  }),
});