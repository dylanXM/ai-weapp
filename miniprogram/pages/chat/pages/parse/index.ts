import { store } from '../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { uploadFile } from '../../../../utils/upload';
import config from '../../../../const/config/index';
// @ts-ignore
import { requestAnimationFrame } from '@vant/weapp/common/utils';

// pages/chat/pages/parse/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'image',
    files: [] as any,
    value: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['navBar'],
      actions: ['setState', 'setStates'],
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 用户点击返回
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 上传文件
   */
  afterUpload: async function(event: any) {
    const _this = this;
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    try {
      const res = await uploadFile(file.url);
      const stringData = res.data;
      const parseData = JSON.parse(stringData);
      // 上传完成需要更新 fileList
      const { files = [] } = _this.data;
      files.push({ ...file, url: parseData.data });
      _this.setData({ files });
    } catch (err) {

    }
  },

  /**
   * 点击文档解析类型
   * @param event 
   */
  handleUploadTypeChange: function(event: any) {
    const type = event.detail;
    this.setData({ type });
  },

  chatProcess: async function() {
    const _this = this;
    // @ts-ignore
    const { loading,  currentGroup, model, messageMap, userBalance: balance } = _this.data;
    const messages = messageMap[currentGroup.id];
    if (loading) {
      wx.showToast({ title: '请等待当前会话结束', icon: 'none' });
      return;
    }
    const options: Record<string, any> = {};
    this.setData({ loading: true, value: '' });
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
        const handleRequest = function(responseText: string) {
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
            cacheResText = data.text;
            if (data?.userBanance) {
              userBalance = data?.userBanance;
            }
            if (data?.id || data?.is_end) {
              isStreamIn = false;
            }
          } catch (error) {}
        }
        wx.request({
          url: `${config.url}/chatgpt/content-parse`,
          method: 'POST',
          data: {
            appId: currentGroup.appId,
            messages: messages,
          },
          timeout: 360000,
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
              });
              _this.setData({ loading: false });
            }
            handleRequest(res.data as string);
          },
          fail: function (error) {
            _this.updateGroupChat(messages.length - 1, {
              loading: false,
              text: '遇到错误了，请检查积分是否充足或联系系统管理员',
              error: true,
            });
            _this.setData({ loading: false });
          }
        });
      };
      await fetchChatAPIOnce();
    } catch (error) {

    } finally {

    }
  },
})