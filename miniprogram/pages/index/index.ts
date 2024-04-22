// @ts-ignore
import Dialog from '@vant/weapp/dialog/dialog';
import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { listenSafeHeightChange } from '../../utils/keyboards';
import { getUserInfo } from '../../api/index';

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
    actions: {
      setState: "setState",
    },
  },
  observers: {
    activeNav: function (data) {
      const _this = this;
      if (data === 'user') {
        getUserInfo().then(user => {
          _this.setState('user', user);
        });
      }
    },
  },
  methods: {
    handleActiveNavChange(event: any) {
      this.setData({ activeNav: event.detail.key });
    },
    // 监听键盘高度
    subscribeKeyboard: function () {
      // 全局注册键盘高度
      listenSafeHeightChange({
        safeHieghtCallback: (safeBottom: number) => {
          this.setState('bottomSafeHeight', safeBottom);
        },
      });
    },
    // 调用子组件创建会话方法，并切换到chat组件
    handleToChat: function(event: any) {
      const chatComponent = this.selectComponent('#chat-component'); 
      chatComponent.createChatGroup(event);
      this.setData({ activeNav: 'chat' });
    }
  },
  lifetimes: {
    attached: function () {
      this.subscribeKeyboard();
    }
  }
})
