// @ts-ignore
import Dialog from '@vant/weapp/dialog/dialog';
import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';

Component({
  behaviors: [storeBindingsBehavior],
  data: {
    activeNav: 'presets',
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
