import { ChatGroup, Message } from 'miniprogram/api/chat/type';
import { listenKeyboardHeightChange } from '../../utils/keyboards';
import { IAppOption } from 'typings';
import { chatProcrssOnce, createChat, queryChat, queryChatGroup } from '../../api/chat/index';
import { UserData } from 'miniprogram/api/auth/type';
import { BaseModelData } from 'miniprogram/api/model/type';
// @ts-ignore
import { requestAnimationFrame } from '@vant/weapp/common/utils';
// @ts-ignore
import Toast from '@vant/weapp/toast/toast';

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
    messages: {} as Message[],
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
    user: app.globalData.user,
    model: app.globalData.model,
    modelList: app.globalData.modelList,
    viewId: '',
    robotAvatar: app.globalData.robotAvatar,
    typingStatusEnd: true,
    scrollTop: 10000,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scrollToBottm: function () {
      const scrollTop = this.data.scrollTop + 1000;
      this.setData({ scrollTop });
    },
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
      const messages = res.map(message => ({
        ...message,
        text: message.inversion ? message.text : app.towxml(message.text, 'markdown', {}),
      }));
      this.setData({ messages });
      this.scrollToBottm();
    },
    addGroupChat: function(message: Message) {
      console.log('addGroupChat', this.data);
      const { messages } = this.data;
      messages.push(message);
      this.setData({ messages });
      this.scrollToBottm();
    },
    updateGroupChat: function(index: number, message: Partial<Message>) {
      const { messages } = this.data;
      const length = messages.length;
      if (length - 1 < index) {
        return;
      }
      if (message.text && typeof message.text === 'string') {
        message.text = app.towxml(message.text, 'markdown', {});
      }
      messages[index] = { ...messages[index], ...message };
      console.log('index', index);
      this.setData({ messages });
      this.scrollToBottm();
    },
    chatProcess: async function() {
      console.log('chatProcess', this.data);
      const _this = this;
      const { value, loading,  currengGroup, messages, model } = _this.data;
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
      this.setData({ loading: true, value: '' });

      const options = {
        groupId: currengGroup.id,
        usingNetwork: false,
      };
      // 增加一条chatgpt虚拟信息
      this.addGroupChat({
        dateTime: new Date().toLocaleString(),
        text: '',
        loading: true,
        inversion: false,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt: value, options: { ...options } },
      });
      // chatProcrssOnce(params);
      const timer: any = null;
      let cacheResText = '';
      let data: any = null;
      let isStreamIn = true;
      let userBanance: any = {};

      // 匀速输出
      try {
        const fetchChatAPIOnce = async () => {
          let i = 0;
          let shouldContinue = true;
          let currentText = '';
          async function update() {
            if (shouldContinue) {
              if (cacheResText && cacheResText[i]) {
                _this.setData({ typingStatusEnd: false });

                /* 如果缓存字数太多则一次全加了 */
                if (cacheResText.length - i > 150) {
                  currentText += cacheResText.substring(i, i + 10)
                  i += 10
                } else if (cacheResText.length - i > 200) {
                  currentText += cacheResText.substring(i)
                  i += cacheResText.length - i
                } else {
                  currentText += cacheResText[i]
                  i++
                }
                _this.updateGroupChat(messages.length - 1, {
                  dateTime: new Date().toLocaleString(),
                  text: currentText,
                  inversion: false,
                  usage: data?.detail?.usage,
                  error: false,
                  loading: true,
                  conversationOptions: { conversationId: data?.conversationId, parentMessageId: data?.id },
                  requestOptions: { prompt: value, options: { ...options } },
                });
              }
              // TODO 如果在底部要继续滚动到底部
              const curLen = currentText ? currentText.length : 0
              const cacheResLen = cacheResText ? cacheResText.length : 0
              if (!isStreamIn && curLen === cacheResLen) {
                _this.setData({ typingStatusEnd: true });
                _this.updateGroupChat(messages.length - 1, {
                  loading: false,
                  conversationOptions: { conversationId: data?.conversationId, parentMessageId: data?.id },
                  requestOptions: { prompt: value, options: { ...options } },
                });
                _this.setData({ loading: false });
                // TODO 更新用户余额

                if (messages.length === 2 && !currengGroup.appId) {
                  const title = messages[1].text.length > 5 ? messages.slice(0, 5) : messages[1].text
                  // TODO 更新组信息
                }
                shouldContinue = false // 结束动画循环
              }
              /* 有多余的再请求下一帧 */
              if (cacheResText.length && cacheResText.length > currentText.length) {
                requestAnimationFrame(update);
              } else {
                setTimeout(() => {
                  requestAnimationFrame(update)
                }, 1000)
              }
            }
          }
          requestAnimationFrame(update) // 启动动画循环
          const requestTask = wx.request({
            url: 'https://service.winmume.com/api/chatgpt/chat-process',
            method: 'POST',
            data: {
              appId: null,
              prompt: `${value}\n`,
              options,
            },
            enableChunked: true,
            header: {
              Authorization: `Bearer ${wx.getStorageSync('token')}`,
            }
          });
          requestTask.onChunkReceived(function (res) {
            const decoder = new TextDecoder('utf-8');
            const responseText = decoder.decode(res.data);
            if ([1].includes(model.modelInfo.keyType)) {
              const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2);
              let chunk = responseText;
              if (lastIndex !== -1) {
                chunk = responseText.substring(lastIndex);
              }

              try {
                data = JSON.parse(chunk);
              } catch (error) {
                /* 二次解析 */
                // const parseData = parseTextToJSON(responseText)
                // TODO 如果出现类似超时错误 会连接上次的内容一起发出来导致无法解析  后端需要处理 下
                console.log('parse data erro from openai: ');
                if (chunk.includes('OpenAI timed out waiting for response')) {
                  Toast.fail('会话超时了、告知管理员吧~~~');
                }
              }
            }

            /* 处理和百度一样格式的模型消息解析 */
            if ([2, 3, 4].includes(model.modelInfo.keyType)) {
              const lines = responseText
                .toString()
                .split('\n')
                .filter((line: string) => line.trim() !== '');

              let cacheResult = ''; // 拿到本轮传入的所有字段信息
              let tem: any = {};
              for (const line of lines) {
                try {
                  const parseData = JSON.parse(line);
                  cacheResult += parseData.result;
                  tem = parseData;
                }
                catch (error) {
                  console.log('Json parse 2 3 type error: ');
                }
              }
              tem.result = cacheResult;
              data = tem;
            }

            try {
              /* 如果出现输出内容不一致就需要处理了 */
              if (model.modelInfo.keyType === 1) {
                cacheResText = data.text;
                if (data?.userBanance) {
                  userBanance = data?.userBanance;
                }
                if (data?.id) {
                  isStreamIn = false;
                }
              }
  
              if ([2, 3, 4].includes(model.modelInfo.keyType)) {
                const { result, is_end } = data;
                cacheResText = result;
                isStreamIn = !is_end;
                data?.userBanance && (userBanance = data?.userBanance);
              }
            } catch (error) {}
          });
        };
        await fetchChatAPIOnce();
      } catch (error) {

      } finally {

      }
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
      console.log('chat data', this.data);
      // 添加监听器
      app.addListener('user', user => {
        console.log('user', user);
        this.setData({ user: user as UserData });
        this.chatGroup();
      });

      app.addListener('model', model => {
        console.log('model', model);
        this.setData({ model: model as BaseModelData });
      });

      // 全局注册键盘高度
      listenKeyboardHeightChange({
        safeHieghtCallback: (safeBottom: number) => {
          this.setData({ bottomSafeHeight: safeBottom });
        },
        keyboardHeightCallback: (keyboardHeight: number) => {
          this.setData({ keyboardHeight });
        }
      });
    }
  }
})