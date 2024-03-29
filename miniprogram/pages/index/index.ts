// index.ts
import { IAppOption } from '../../../typings';
// @ts-ignore
import Dialog from '@vant/weapp/dialog/dialog';

// 获取应用实例
const app = getApp<IAppOption>();

Component({
  data: {
    loading: app.globalData.loading,
    activeNav: 'chat',
  },
  methods: {
    handleActiveNavChange(event: any){
      console.log('activeNav', event.detail.key);
      this.setData({ activeNav: event.detail.key });
    },

  },
  lifetimes: {
    attached() {
      app.addListener('loading', loading => {
        this.setData({ loading: loading as boolean });
      })
    },
  },
})
