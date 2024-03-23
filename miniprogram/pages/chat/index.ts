import { ChatGroup, Message } from 'miniprogram/api/chat/type';
import { listenKeyboardHeightChange } from '../../utils/keyboards';
import { IAppOption } from 'typings';
import { createChat, queryChat, queryChatGroup, updateGroup } from '../../api/chat/index';
import { UserData } from 'miniprogram/api/auth/type';
import { BaseModelData } from 'miniprogram/api/model/type';
// @ts-ignore
import { requestAnimationFrame } from '@vant/weapp/common/utils';
// @ts-ignore
import Toast from '@vant/weapp/toast/toast';
import { formatModelOptions, getChooseModel } from '../../utils/model';
import { formatAiText } from '../../utils/chat';
import { isEmptyObj } from '../../utils/common';
import { modelTypeMap } from '../../const/config/index';

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
    allGroups: [] as ChatGroup[],
    messages: {} as Message[],
    currentGroup: {} as ChatGroup,
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
    model: {
      ...app.globalData?.model?.modelInfo
    },
    modelList: app.globalData.modelList,
    viewId: '',
    robotAvatar: app.globalData.robotAvatar || 'https://shop.winmume.com/uploads/images/chatgpt.png',
    typingStatusEnd: true,
    scrollTop: 10000,
    modelConfig: {
      visible: false,
      options: [] as any[],
    },
    AIName: app.globalData.siteName,
    requestTask: null as any,
    groupScroll: {},
    userBalance: {
      modelCount: 0,
      useModelToken: 0,
      modelPrice: 0,
      modelType: 1,
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scrollToBottm: function () {
      const scrollTop = this.data.scrollTop + 100;
      this.setData({ scrollTop });
    },
    chatGroup: async function(groupId?: number) {
      const res = await queryChatGroup();
      this.setData({ groups: res, allGroups: res });
      if (!groupId) {
        const firstGroup = res?.[0];
        if (!firstGroup) return;
        this.queryChatList(firstGroup.id);
      }
    },
    updateGroup: async function(title: string) {
      const { currentGroup } = this.data;
      const currentGroupId = currentGroup.id;
      await updateGroup({ groupId: currentGroupId, title });
      this.chatGroup(currentGroupId);
    },
    createChatGroup: async function(event: any) {
      const res = await createChat({ appId: event.detail.key });
      const groups = this.data.groups;
      groups.unshift(res);
      this.setData({ groups, allGroups: groups });
      this.queryChatList(res.id);
      this.closePopup();
    },
    searchChatGroup: function (event: any) {
      const query = event.detail;
      const { allGroups } = this.data;
      if (!query) {
        this.setData({ groups: allGroups, allGroups });        
      }
      const newGroups = allGroups.filter(group => group.title.includes(query));
      this.setData({ groups: newGroups });
    },
    queryChatList: async function(groupId: number) {
      const res = await queryChat({ groupId });
      const messages = res.map(message => ({
        ...message,
        text: message.inversion ? message.text : app.towxml(formatAiText(message.text), 'markdown', {}),
      }));
      const chooseGroup = this.data.groups.find(group => group.id === groupId)
      this.setData({ messages, currentGroup: chooseGroup });
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
        message.originText = message.text;
        message.text = app.towxml(formatAiText(message.text), 'markdown', {});
      }
      messages[index] = { ...messages[index], ...message };
      this.setData({ messages });
      this.scrollToBottm();
    },
    chatProcess: async function() {
      const _this = this;
      const { value, loading,  currentGroup, messages, model } = _this.data;
      if (!value || value.trim() === '') {
        Toast('请输入你的问题或需求');
        return;
      }
      if (loading) {
        Toast('请等待当前会话结束');
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
        groupId: currentGroup.id,
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
      let userBalance: any = {};

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
                _this.updateUserBalance({ userBalance }, model);

                if (messages.length === 2 && currentGroup.id) {
                  const message = messages[1].originText || messages[1].text;
                  const title = message.length > 5 ? message.slice(0, 5) : message;
                  _this.updateGroup(title);
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
            if ([1].includes(model.keyType)) {
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
            if ([2, 3, 4].includes(model.keyType)) {
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
              if (model.keyType === 1) {
                cacheResText = data.text;
                if (data?.userBanance) {
                  userBalance = data?.userBanance;
                }
                if (data?.id) {
                  isStreamIn = false;
                }
              }
  
              if ([2, 3, 4].includes(model.keyType)) {
                const { text, is_end } = data;
                cacheResText = text;
                isStreamIn = !is_end;
                data?.userBanance && (userBalance = data?.userBanance);
              }
            } catch (error) {}
          });
          this.setData({ requestTask });
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
    },
    showModelActionSheet: function () {
      const { modelConfig, model, modelList } = this.data;
      const options = formatModelOptions(modelList.modelMaps, model);
      modelConfig.visible = true;
      modelConfig.options = options;
      this.setData({ modelConfig });
    },
    closeModelActionSheet: function () {
      const { modelConfig } = this.data;
      modelConfig.visible = false;
      this.setData({ modelConfig });
    },
    onSelectModel: function (event: any) {
      console.log('model', event);
      const chooseModel = { model: event.detail.model, modelName: event.detail.modelName };
      const model = getChooseModel(this.data.modelList.modelMaps, chooseModel);
      console.log('model', model);
      this.setData({ model: model as any });
      this.updateUserBalance(this.data.user, model);
    },
    chooseGroup: async function (event: any) {
      const { loading } = this.data;
      if (loading) {
        Toast('请等待当前会话结束');
        return;
      }
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '会话加载中...',
      });
      const groupId = event.target.dataset.text;
      await this.queryChatList(groupId);
      this.closePopup();
      Toast.clear();
    },
    cancelChatProcess: function () {
      const { loading, requestTask, messages } = this.data;
      if (!loading || !requestTask) {
        return;
      }
      requestTask.offChunkReceived();
      requestTask.abort();
      this.setData({ loading: false });
      this.updateGroupChat(messages.length - 1, {
        loading: false,
        text: '',
        conversationOptions: {},
        requestOptions: { prompt: '', options: {} },
      });
    },
    // 消息区滚动事件
    onScroll: function(e: any) {
      // console.log(e.detail.scrollTop, this.data.scrollTop);
    },
    // 更新userBalance
    updateUserBalance: function(user: any, model: any) {
      const userBalance: any = {};
      const { deduct, deductType } = model;
      userBalance.modelPrice = deduct;
      userBalance.modelType = deductType;
      const { count, useToken, countKey, useTokenKey } = modelTypeMap[deductType as '1' | '2'];
      // @ts-ignore
      userBalance[countKey] = user.userBalance[count] || 0;
      // @ts-ignore
      userBalance[useTokenKey] = user.userBalance[useToken] || 0;
      this.setData({ userBalance: { ...this.data.userBalance, ...userBalance } });
    },
    // 监听全局变量
    subscribeGlobalData: function () {
      console.log('chat data', this.data);
      const { user, model, modelList, AIName, robotAvatar } = this.data;
      // 添加监听器
      if (isEmptyObj(user)) {
        app.addListener('user', user => {
          this.setData({ user: user as UserData });
          this.chatGroup();
          if (!isEmptyObj(this.data.model)) {
            this.updateUserBalance(user, this.data.model);
          }
        });
      } else {
        const { user, model } = this.data;
        if (!isEmptyObj(model)) {
          this.updateUserBalance(user, model);
        }
      }

      if (isEmptyObj(model)) {
        app.addListener('model', (model: any) => {
          this.setData({ model: model.modelInfo as BaseModelData['modelInfo'] });
          if (!isEmptyObj(this.data.user)) {
            this.updateUserBalance(this.data.user, model);
          }
        });
      } else {
        const { user, model } = this.data;
        if (!isEmptyObj(user)) {
          this.updateUserBalance(user, model);
        }
      }

      if (isEmptyObj(modelList)) {
        app.addListener('modelList', (modelList: any) => {
          this.setData({ modelList });
        });
      }

      if (!AIName) {
        app.addListener('siteName', (siteName: any) => {
          this.setData({ AIName: siteName });
        });
      }

      if (!robotAvatar) {
        app.addListener('robotAvatar', (robotAvatar: any) => {
          this.setData({ robotAvatar });
        });
      }
    },
    // 监听键盘高度
    subscribeKeyboard: function () {
      // 全局注册键盘高度
      listenKeyboardHeightChange({
        safeHieghtCallback: (safeBottom: number) => {
          this.setData({ bottomSafeHeight: safeBottom });
        },
        keyboardHeightCallback: (keyboardHeight: number) => {
          this.setData({ keyboardHeight });
          this.scrollToBottm();
        }
      });
    },
  },

  lifetimes: {
    attached() {
      this.subscribeGlobalData();

      this.subscribeKeyboard();
    },
    detached() {
      this.setData({ requestTask: null });
    }
  }
})