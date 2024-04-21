// components/bottom-nav/bottom-nav.ts
import { Menu } from '../../api/config/type';
import { IAppOption } from 'typings';
import { values } from 'mobx-miniprogram';

const app = getApp<IAppOption>();

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    menuList: [] as Menu[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleActiveNavChange(event: any) {
      this.triggerEvent("onChange", { key: event.detail });
    }
  },

  lifetimes: {
  }
})