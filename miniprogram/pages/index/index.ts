// index.ts
import { IAppOption } from '../../../typings';
// @ts-ignore
import Dialog from '@vant/weapp/dialog/dialog';
import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';

// 获取应用实例
const app = getApp<IAppOption>();

Component({
  behaviors: [storeBindingsBehavior],
  data: {
    // loading: app.globalData.loading,
    activeNav: 'chat',
  },
  // @ts-ignore
  storeBindings: {
    store,
    fields: {
      loading: 'loading',
    },
  },
  methods: {
    handleActiveNavChange(event: any){
      console.log('activeNav', event.detail.key);
      this.setData({ activeNav: event.detail.key });
    },
  },
})
