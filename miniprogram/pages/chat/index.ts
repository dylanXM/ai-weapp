import { ChatGroup, Message } from 'miniprogram/api/chat/type';
import { createChat, delGroup, queryChat, queryChatGroup, updateGroup, clearGroup } from '../../api/chat/index';
// @ts-ignore
import { requestAnimationFrame } from '@vant/weapp/common/utils';
// @ts-ignore
import Dialog from '@vant/weapp/dialog/dialog';
import { formatModelOptions, getChooseModel, getChooseModelInfo } from '../../utils/model';
import { formatAiText } from '../../utils/chat';
import { isEmptyObj } from '../../utils/common';
import config, { groupActions, modelTypeMap } from '../../const/config/index';
import { store } from '../../store/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
const plugin = requirePlugin("WechatSI");
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager();

// pages/chat/index.ts
Component({
  behaviors: [storeBindingsBehavior],

  /**
   * 组件的初始数据
   */
  data: {
    groups: [] as ChatGroup[],
    messageMap: {} as Record<string, Message[]>,
    currentGroup: {} as ChatGroup,
    value: '',
    keyboardHeight: 0,
    popupVisible: false,
    loading: false,
    viewId: '',
    typingStatusEnd: true,
    scrollTop: 10000,
    modelConfig: {
      visible: false,
      options: [] as any[],
    },
    groupScroll: {},
    groupOperate: {
      visible: false,
      group: {} as ChatGroup,
      actions: groupActions,
      renameVisible: false,
      newName: '',
    },
    currentApp: {} as any,
    isScrollToLower: true,
    toView: '',
    deviceScrollMinis: -100,
    appImg: config.appImg,
    searchStatus: {
      active: false,
    },
    settings: {
      visible: false,
    },
    inputState: 'text' as 'text' | 'voice',
    recordState: {
      isSpeeching: false,
      speechText: '按住 说话'
    }
  },

  // @ts-ignore
  storeBindings: {
    store,
    fields: {
      navBar: 'navBar',
      modelList: 'modelList',
      robotAvatar: 'robotAvatar',
      user: 'user',
      AIName: 'siteName',
      model: 'model',
      userBalance: 'userBalance',
      bottomSafeHeight: 'bottomSafeHeight',
      allPresets: 'allPresets',
      allMinePresets: 'allMinePresets',
      allGroups: 'allGroups'
    },
    actions: {
      setState: "setState",
    },
  },

  /**
   * 字段监听
   */
  observers: {
    user: function (data) {
      if (isEmptyObj(data)) return;
      const { currentGroup } = this.data;
      // @ts-ignore
      if (!isEmptyObj(this.data.model)) {
        // @ts-ignore
        this.updateUserBalance(data, this.data.model);
      }
      if (currentGroup.id) return;
      this.chatGroup();
    },
    model: function (data) {
      if (isEmptyObj(data)) return;
      // @ts-ignore
      if (!isEmptyObj(this.data.user)) {
        // @ts-ignore
        this.updateUserBalance(this.data.user, data);
      }
    },
    currentGroup: function (data) {
      this.setData({ isScrollToLower: true });
      const { allPresets, allMinePresets } = this.data;
      if (!data.id) {
        return;
      }
      const { appId: currentAppId, config } = data;
      const { modelInfo } = JSON.parse(config);
      if (!currentAppId || !allPresets?.length) {
        this.setData({ currentApp: {} });
        this.setState('model', modelInfo);
        return;
      } 
      let currentApp = allPresets.find((item: any) => item.id === currentAppId);
      if (!currentApp) {
        currentApp = allMinePresets.find((item: any) => item.id === currentAppId);
      }
      const appDemo = currentApp?.demoData?.split('\n').filter((item: string) => item) || [];
      this.setState('model', modelInfo);
      this.setData({ currentApp: { ...currentApp, appDemo }, model: modelInfo }, () => {
        this.scrollToBottom();
      });
    },
    currentApp: function (data) {
      if (data.coverImg) {
        this.setData({ coverImg: data.coverImg });
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scrollToBottom: function () {
      this.setData({ toView: 'id_bottom_container' });
    },
    chatGroup: async function(groupId?: number) {
      const res = await queryChatGroup();
      this.setData({ groups: res });
      this.setState('allGroups', res);
      if (!groupId) {
        const firstGroup = res?.[0];
        if (!firstGroup) return;
        this.queryChatList(firstGroup.id);
      }
    },
    updateGroup: async function(title: string) {
      // @ts-ignore
      const { currentGroup } = this.data;
      const currentGroupId = currentGroup.id;
      await updateGroup({ groupId: currentGroupId, title });
      this.chatGroup(currentGroupId);
    },
    createChatGroup: async function(event: any) {
      const appId = event.detail.key;
      const { allGroups, loading } = this.data;
      if (loading) {
        wx.showToast({ title: '请等待当前会话结束', icon: 'none' });
        return;
      }
      const alreadyHasGroup = allGroups.find((group: { appId: string; }) => group.appId === appId);
      if (alreadyHasGroup) {
        this.setData({ currentGroup: alreadyHasGroup });
        this.queryChatList(alreadyHasGroup.id);
        return;
      }
      const res = await createChat({ appId });
      const groups = this.data.groups;
      groups.unshift(res);
      this.setData({ groups });
      this.setState('allGroups', groups);
      this.queryChatList(res.id);
      this.closePopup();
    },
    searchChatGroup: function (event: any) {
      const query = event.detail;
      const { allGroups } = this.data;
      if (!query) {
        this.setData({ groups: allGroups });  
      }
      const newGroups = allGroups.filter((group: { title: string; }) => group.title.toLowerCase().includes(query.toLowerCase()));
      this.setData({ groups: newGroups });
    },
    queryChatList: async function(groupId: number) {
      const { messageMap, groups } = this.data;
      const res = await queryChat({ groupId });
      const messages = res.map(message => {
        return {
          ...message,
          originText: formatAiText(message.text),
        }
      });
      const chooseGroup = groups.find(group => group.id === groupId)
      this.setData({ messageMap: { ...messageMap, [groupId]: messages }, currentGroup: chooseGroup }, () => {
        this.scrollToBottom();
      });
    },
    addGroupChat: function(message: Message) {
      // @ts-ignore
      const { currentGroup, messageMap } = this.data;
      const messages = messageMap[currentGroup.id];
      messages.push(message);
      this.setData({ messageMap: { ...messageMap, [currentGroup.id]: messages } }, () => {
        this.scrollToBottom();
      });
    },
    updateGroupChat: function(index: number, message: Partial<Message>) {
      const { currentGroup, messageMap, loading } = this.data;
      if (!loading) {
        return;
      }
      const messages = messageMap[currentGroup.id];
      if (message.text && typeof message.text === 'string') {
        message.originText = formatAiText(message.text);
      }
      messages[index] = { ...messages[index], ...message };
      this.setData({ messageMap: { ...messageMap, [currentGroup.id]: messages } }, () => {
        this.scrollToBottom();
      });
      if (!message.loading) {
        setTimeout(this.scrollToBottom.bind(this), 400);
      }
    },
    chatProcess: async function(text?: string) {
      const _this = this;
      // @ts-ignore
      const { loading,  currentGroup, model, messageMap, userBalance: balance } = _this.data;
      const value = typeof text === 'string' && text ? text : _this.data.value;
      if (!value || value.trim() === '') {
        return;
      }
      const messages = messageMap[currentGroup.id];
      if (loading) {
        wx.showToast({ title: '请等待当前会话结束', icon: 'none' });
        return;
      }
      const options: Record<string, any> = {
        groupId: currentGroup.id,
        usingNetwork: false,
      };
      if (messages.length >= 2 && messages[messages.length - 1]?.conversationOptions?.parentMessageId) {
        options.parentMessageId = messages[messages.length - 1].conversationOptions.parentMessageId;
      }
      // 增加一条用户虚拟信息
      this.addGroupChat({
        dateTime: new Date().toLocaleString(),
        text: value,
        inversion: true,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt: value, options: null },
        chatId: Date.now(),
      });
      this.setData({ loading: true, value: '' });
      // 增加一条chatgpt虚拟信息
      this.addGroupChat({
        dateTime: new Date().toLocaleString(),
        text: '',
        loading: true,
        inversion: false,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt: value, options: { ...options } },
        chatId: Date.now(),
      });
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

                if (messages.length === 2 && !currentGroup.appId) {
                  const message = messages[1].originText || messages[1].text;
                  const title = message.length > 15 ? message.slice(0, 15) : message;
                  _this.updateGroup(title);
                }
                shouldContinue = false // 结束动画循环
              }
              /* 有多余的再请求下一帧 */
              if (cacheResText?.length && cacheResText?.length > currentText?.length) {
                requestAnimationFrame(update);
              } else {
                setTimeout(() => {
                  requestAnimationFrame(update)
                }, 1000)
              }
            }
          }
          requestAnimationFrame(update) // 启动动画循环
          wx.request({
            url: 'https://service.winmume.com/api/chatgpt/chat-process',
            method: 'POST',
            data: {
              appId: currentGroup.appId,
              prompt: `${value}\n`,
              options,
            },
            header: {
              Authorization: `Bearer ${wx.getStorageSync('token')}`,
              Accept: 'application/json;charset=UTF-8',
            },
            success: function (res) {
              if (res.statusCode !== 200) {
                wx.showToast({ title: res?.data?.message || '遇到错误了，请检查积分是否充足或联系系统管理员', icon: 'none' });
                _this.updateGroupChat(messages.length - 1, {
                  loading: false,
                  text: res?.data?.message || '遇到错误了，请检查积分是否充足或联系系统管理员',
                  error: true,
                  conversationOptions: { conversationId: data?.conversationId, parentMessageId: data?.id },
                  requestOptions: { prompt: value, options: { ...options } },
                });
                _this.setData({ loading: false });
              }
              const responseText: string = res.data as string;
              if (typeof responseText !== 'string') {
                data = responseText;
              } else if ([2, 3, 4].includes(model.keyType) && typeof responseText === 'string') {
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
                  }
                }
                tem.result = cacheResult;
                data = tem;
              } else {
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
                  if (chunk.includes('OpenAI timed out waiting for response')) {
                    wx.showToast({ title: '会话超时了、告知管理员吧~~~', icon: 'none' });
                  }
                }
              } 
  
              try {
                /* 如果出现输出内容不一致就需要处理了 */
                if ([1, 5].includes(model.keyType)) {
                  cacheResText = data.text;
                  if (data?.userBanance) {
                    userBalance = data?.userBanance;
                  }
                  if (data?.id || data?.is_end) {
                    isStreamIn = false;
                  }
                } else {
                  const { text, is_end } = data;
                  cacheResText = text;
                  isStreamIn = !is_end;
                  data?.userBanance && (userBalance = data?.userBanance);
                }
              } catch (error) {}
            },
            fail: function (error) {
              console.log('error', error);
            },
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
      this.setData({ popupVisible: false, searchStatus: { active: false } });
    },
    handleValueChange: function(event: any) {
      this.setData({ value: event.detail });
    },
    showModelActionSheet: function (event: any) {    
      const { loading } = this.data;
      if (loading) {
        wx.showToast({ title: '请等待当前对话结束', icon: 'none' });
        return;
      }
      // @ts-ignore
      const { modelConfig, model, modelList, messageMap, currentGroup } = this.data;
      const messages = messageMap[currentGroup.id];
      if (messages?.length) {
        this.showGroupOperate(event);
        return;
      }
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
      const chooseModel = { model: event.detail.model, modelName: event.detail.modelName };
      // @ts-ignore
      const model = getChooseModel(this.data.modelList.modelMaps, chooseModel);
      this.setState('model', model);
      // @ts-ignore
      this.updateUserBalance(this.data.user, model);
      const { currentGroup } = this.data;
      if (!currentGroup.appId) {
        const modelTypeInfo = getChooseModelInfo(this.data.modelList.modelTypeList, String(model.keyType));
        updateGroup({ groupId: currentGroup.id, modelConfig: JSON.stringify({ modelInfo: model, modelTypeInfo }) }).then(() => {
          this.chatGroup(currentGroup.id);
        });
      }
    },
    chooseGroup: async function (event: any) {
      const { loading } = this.data;
      if (loading) {
        wx.showToast({ title: '请等待当前会话结束', icon: 'none' });
        return;
      }
      const groupId = event.target.dataset.text;
      await this.queryChatList(groupId);
      this.closePopup();
    },
    cancelChatProcess: function () {
      const { loading, messageMap, currentGroup } = this.data;
      const messages = messageMap[currentGroup.id];
      if (!loading) {
        return;
      }
      const lastMessage = messages[messages.length - 1];
      const lastText = lastMessage.originText;
      this.updateGroupChat(messages.length - 1, {
        ...lastMessage,
        loading: false,
        text: `${lastText || ''}（用户手动取消）`,
      });
      this.setData({ loading: false });
    },
    // 消息区滚动事件
    onScroll: function(event: any) {
      const { navBar, bottomSafeHeight, deviceScrollMinis, keyboardHeight } = this.data;
      const { detail: { scrollHeight, scrollTop } } = event;
      const scrollMinis = scrollHeight - scrollTop - navBar?.navBarHeight - bottomSafeHeight;
      if (deviceScrollMinis === -100) {
        this.setData({ deviceScrollMinis: scrollMinis });
      } else {
        this.setData({ isScrollToLower: scrollMinis - deviceScrollMinis - keyboardHeight - 70 <= 0 });
      }
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
      // @ts-ignore
      this.setState('userBalance', { ...this.data.userBalance, ...userBalance });
    },
    handlekeyboardHeightChange: function(event: any) {
      this.setData({ keyboardHeight: event.detail.height }, () => {
        this.scrollToBottom();
        setTimeout(() => this.setData({ isScrollToLower: true, viewId: 'id_bottom_container' }), 100);
      });
    },
    // 新增应用dispatch
    dispatchAppId: function (appId: string) {
      // 跳转到chat页面
      this.triggerEvent("onChange", { key: 'chat' });
      // 新建会话
      this.createChatGroup(appId);
    },
    // 点击group的操作
    showGroupOperate: function (event: any) {
      const { loading } = this.data;
      if (loading) {
        wx.showToast({ title: '请等待当前对话结束', icon: 'none' });
        return;
      }
      const { group } = event.currentTarget.dataset;
      const { messageMap } = this.data;
      let actions = group.appId ? groupActions.filter(g => g.action !== 'rename') : groupActions;
      const messageList = messageMap[group.id];
      actions = messageList?.length ? actions : actions.filter(g => g.action !== 'clear');
      this.setData({ groupOperate: { visible: true, group, actions, renameVisible: false, newName: '' } });
    },
    closeGroupOperate: function () {
      const { groupOperate } = this.data;
      this.setData({ groupOperate: { ...groupOperate ,visible: false } });
    },
    // 操作对话组
    operateChatGroup: function (event: any) {
      const _this = this;
      const { action } = event.detail;
      const { groupOperate, currentGroup } = _this.data;
      const { group, visible } = groupOperate;
      if (!visible) {
        return;
      }
      if (action === 'del') {
        Dialog.confirm({
          title: '操作确认',
          message: `是否删除对话【${group.title}】`,
        }).then(() => {
          delGroup({ groupId: group.id }).then(() => {
            _this.chatGroup(currentGroup.id === group.id ? '' : currentGroup.id);
          });
        });
      }

      if (action === 'rename') {
        this.setData({ groupOperate: { ...groupOperate, renameVisible: true } })
      }

      if (action === 'clear') {
        Dialog.confirm({
          title: '操作确认',
          message: `是否清除【${group.title}】中的会话`,
        }).then(() => {
          clearGroup({ groupId: group.id }).then(() => {
            _this.queryChatList(group.id);
          });
        });
      }
    },
    confirmRenameGroup: async function () {
      const { groupOperate, currentGroup } = this.data;
      const { newName, group } = groupOperate;
      if (!newName) {
        return;
      }
      await updateGroup({ groupId: group.id, title: newName });
      this.chatGroup(currentGroup.id);
    },
    groupNewNameChange: function (event: any) {
      const { groupOperate } = this.data;
      this.setData({ groupOperate: { ...groupOperate, newName: event.detail } });
    },
    clickPrompt: function (event: any) {
      const { text } = event.currentTarget.dataset;
      this.chatProcess(text);
    },
    continuePrompt: function() {
      this.chatProcess('继续');
    },
    // 复制gpt回答的内容
    copyGptResult: function (event: any) {
      const { text } = event.currentTarget.dataset;
      wx.setClipboardData({ data: text });
    },
    /**
     * 搜索框激活事件
     */
    handleSearchGroupFocus: function() {
      this.setData({ searchStatus: { active: true } });
    },
    /**
     * 搜索框失活事件
     */
    handleSearchGroupBlur: function() {
      this.setData({ searchStatus: { active: false } });
    },
    /**
     * 点击预设探索按钮
     */
    handleClickExplore: function(event: any) {
      this.closePopup();
      wx.navigateTo({
        url: '../chat/pages/apps/index',
        events: {
          createChatGroup: (event: any) => {
            this.createChatGroup(event);
          },
        }
      });
    },

    /**
     * 点击图片生成
     */
    handleClickDraw: function(event: any) {
      wx.showToast({ title: '功能开发中，敬请期待～', icon: 'none' });
      // this.closePopup();
      // wx.navigateTo({
      //   url: '../chat/pages/draw/index',
      //   events: {
      //     createChatGroup: (event: any) => {
      //       this.createChatGroup(event);
      //     },
      //   }
      // });
    },

    /**
     * 点击文件分析
     */
    handleClickAnalyze: function(event: any) {
      wx.showToast({ title: '功能开发中，敬请期待～', icon: 'none' });
      // this.closePopup();
      // wx.navigateTo({
      //   url: '../chat/pages/draw/index',
      //   events: {
      //     createChatGroup: (event: any) => {
      //       this.createChatGroup(event);
      //     },
      //   }
      // });
    },

    /**
     * 点击个人信息（setting）
     */
    handleClickSetting: function() {
      this.setData({ settings: { visible: true } });
    },
    closeSetting: function() {
      this.setData({ settings: { visible: false } });
    },

    /**
     * 点击公众号
     */
    handleClickWXofficial: function() {
      wx.navigateTo({
        url: '../chat/pages/wx-official/index',
      });
    },

    /**
     * 点击管理员
     */
    handleClickWXAdmin: function() {
      console.log('wx-admin to');
      wx.navigateTo({
        url: '../chat/pages/wx-admin/index',
      });
    },

    /**
     * 点击积分兑换
     */
    handleClickKaimi: function() {
      wx.navigateTo({
        url: '../chat/pages/kami/index',
      });
    },

    /**
     * 点击签到
     */
    handleClickSignIn: function() {
      wx.navigateTo({
        url: '../chat/pages/sign-in/index',
      });
    },

    /**
     * 点击语音
     */
    handleClickVoice: function() {
      this.setData({ inputState: 'voice', keyboardHeight: 0 }, () => {
        this.scrollToBottom();
        setTimeout(() => this.setData({ isScrollToLower: true, viewId: 'id_bottom_container' }), 100);
      });
    },

    /**
     * 点击取消语音
     */
    handleClickCancelVoice: function() {
      this.setData({ inputState: 'text', keyboardHeight: 0 }, () => {
        this.scrollToBottom();
        setTimeout(() => this.setData({ isScrollToLower: true, viewId: 'id_bottom_container' }), 100);
      });
    },

    /**
     * 开始录音事件
     */
    startRecord: function () {
      this.setData({ recordState: { isSpeeching: true, speechText: '松开 发送' } });
      wx.showToast({ title: '相关功能正在审核中，敬请期待～', icon: 'none' });
      return;

      // 语音开始识别
      // manager.start({ duration: 10000, lang: 'zh_CN' });
    },

    /**
     * 结束录音事件
     */
    stopRecord: function () {
      this.setData({ recordState: { isSpeeching: false, speechText: '按住 说话' } });
      manager.stop();
    },

    /**
     * 识别语音 -- 初始化
     */
    initRecord: function () {
      const that = this;

      manager.onStart = function (res: any) {
        wx.showToast({ title: '语音正在识别中...', icon: 'none' });
      };
      // 识别错误事件
      manager.onError = function (res: any) {
        console.error("error msg", res)
        if (res.retcode == -30011) {
          manager.stop();
        }
      };

      //识别结束事件
      manager.onStop = function (res: any) {
        if (res.result == '') {
          wx.showToast({ title: '听不清楚，请重新说一遍！', icon: 'none' });
          return;
        }
        let msg = res.result.substr(0, res.result.length - 1);
        console.log('msg', msg);
        that.chatProcess(msg);
      };
    },

    /**
     * text =》 speech =》 play
     */
    playTextSpeech: function(event: any) {
      const { text } = event.currentTarget.dataset;
      plugin.textToSpeech({
        lang: "zh_CN",
        tts: true,
        content: text,
        success: function(res: any) {
          console.log("succ tts", res.filename);
          const innerAudioContext = wx.createInnerAudioContext({
            useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
          });
          innerAudioContext.src = res.filename;
          innerAudioContext.play() // 播放
        },
        fail: function(res: any) {
            console.log("fail tts", res)
        }
      })
    }
  },

  lifetimes: {
    attached() {
      this.initRecord();
    },
    detached() {
    }
  }
})