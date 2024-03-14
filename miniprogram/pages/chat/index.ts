import { ChatGroup, Message } from 'miniprogram/api/chat/type';
import { listenKeyboardHeightChange } from '../../utils/keyboards';
import { IAppOption } from 'typings';
import { chatProcrssOnce, createChat, queryChat, queryChatGroup } from '../../api/chat/index';

const app = getApp<IAppOption>();

// pages/chat/index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    groups: [] as ChatGroup[],
    messages: [] as Message[],
    currengGroup: {} as ChatGroup,
    value: '',
    bottomSafeHeight: 0,
    keyboardHeight: 0,
    navBar: {
      navBarHeight: app.globalData.navBar.navBarHeight,
      menuRight: app.globalData.navBar.menuRight,
      menuTop: app.globalData.navBar.menuTop,
      menuHeight: app.globalData.navBar.menuHeight,
    },
    popupVisible: false,
    loading: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chatGroup: async function() {
      const res = await queryChatGroup();
      this.setData({ groups: res });
      const firstGroup = res?.[0];
      if (!firstGroup) return;
      this.setData({ currengGroup: firstGroup });
      this.queryChatList(firstGroup.id);
    },
    createChatGroup: async function(event: any) {
      const res = await createChat({ appId: event.detail.key });
      const groups = this.data.groups;
      console.log('groups', groups);
      groups.unshift(res);
      this.setData({ groups });
      this.queryChatList(res.id);
    },
    queryChatList: async function(groupId: number) {
      const res = await queryChat({ groupId });
      console.log('chatList', res);
      this.setData({ messages: res });
    },
    addGroupChat: function(params: Message) {
      console.log('addGroupChat', this.data);
      const { messages } = this.data;
      messages.push(params);
      this.setData({ messages });
    },
    chatProcess: async function() {
      console.log('chatProcess', this.data);
      const { value, loading,  currengGroup } = this.data;
      if (!value || value.trim() === '' || loading) {
        return;
      }
      // 增加一条用户虚拟信息
      this.addGroupChat({
        dateTime: new Date().toLocaleString(),
        text: value,
        inversion: true,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt: value, options: null },
      });
      this.setData({ loading: true });

      const options = {
        groupId: currengGroup.appId,
        usingNetwork: false,
      };
  
      const params = {
        appId: null,
        prompt: `${value}\n`,
        options,
      };
      // 增加一条chatgpt虚拟信息
      this.addGroupChat({
        dateTime: new Date().toLocaleString(),
        text: 'AI思考中',
        loading: true,
        inversion: false,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt: value, options: { ...options } },
      });
      // chatProcrssOnce(params);
      this.setData({ loading: false });
    },
    showPopup: function() {
      this.setData({ popupVisible: true });
    },
    closePopup: function() {
      this.setData({ popupVisible: false });
    },
    handleValueChange: function(event: any) {
      this.setData({ value: event.detail });
    }
  },

  lifetimes: {
    attached() {
      // 添加监听器
      if (Object.keys(app.globalData.user || {}).length > 0) {
        this.chatGroup();
      } else {
        app.addListener('user', this.chatGroup.bind(this));
      }

      // 全局注册键盘高度
      listenKeyboardHeightChange({
        safeHieghtCallback: (safeBottom: number) => {
          console.log('safeBottom', safeBottom);
          this.setData({ bottomSafeHeight: safeBottom });
        },
        keyboardHeightCallback: (keyboardHeight: number) => {
          console.log('keyboardHeight', keyboardHeight);
          this.setData({ keyboardHeight });
        }
      });
    }
  }
})