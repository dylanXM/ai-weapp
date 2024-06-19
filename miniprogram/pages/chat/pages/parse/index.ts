import { store } from '../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { uploadFile } from '../../../../utils/upload';
import config from '../../../../const/config/index';
// @ts-ignore
import { requestAnimationFrame } from '@vant/weapp/common/utils';
import { parseParams } from '../../../../utils/parse-params';
import { getUserInfo } from '../../../../api/index';

const bottomId = 'id-bottom-bar';

// pages/chat/pages/parse/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'image' as 'image' | 'file',
    files: [] as any,
    loading: false,
    error: false,
    value: '',
    toView: bottomId,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['navBar', 'user'],
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

  scrollIntoBottom: function() {
    const _this = this;
    _this.setData({ toView: '' }, () => {
      _this.setData({ toView: bottomId });
    });
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

  parse: async function() {
    const _this = this;
    // @ts-ignore
    const { type, loading, files } = _this.data;
    if (loading) {
      wx.showToast({ title: '请等待当前解析结束', icon: 'none' });
      return;
    }
    const fileUrl = files?.[0]?.url;
    if (!fileUrl) {
      wx.showToast({ title: `请上传${type === 'image' ? '图片' : '聊天记录文档'}`, icon: 'none' });
      return;
    }
    this.setData({ loading: true, value: '', error: false });
    let cacheResText = '';
    let data: any = null;
    let isStreamIn = true;

    // 匀速输出
    try {
      const fetchChatAPIOnce = async () => {
        let i = 0;
        let shouldContinue = true;
        let currentText = '';
        async function update() {
          if (shouldContinue) {
            if (cacheResText && cacheResText[i]) {
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
              _this.setData({ loading: true, value: currentText, error: false });
              _this.scrollIntoBottom();
            }
            const curLen = currentText ? currentText.length : 0
            const cacheResLen = cacheResText ? cacheResText.length : 0
            if (!isStreamIn && curLen === cacheResLen) {
              _this.setData({ loading: false, error: false });
              shouldContinue = false // 结束动画循环
            }
            /* 有多余的再请求下一帧 */
            if (cacheResText?.length && cacheResText?.length > currentText?.length) {
              requestAnimationFrame(update);
            } else {
              setTimeout(() => {
                requestAnimationFrame(update);
              }, 1000)
            }
          }
        }
        requestAnimationFrame(update) // 启动动画循环
        const handleRequest = function(responseText: string) {
          cacheResText = responseText;
          isStreamIn = false;
        }
        const params = parseParams(type, fileUrl);
        wx.request({
          url: `${config.url}/chatgpt/contentParse`,
          method: 'POST',
          data: { ...params },
          timeout: 360000,
          header: {
            Authorization: `Bearer ${wx.getStorageSync('token')}`,
            Accept: 'application/json;charset=UTF-8',
          },
          success: function (res) {
            if (res.statusCode !== 200) {
              wx.showToast({ title: res?.data?.message || '遇到错误了，请检查积分是否充足或联系系统管理员', icon: 'none' });
              _this.setData({ loading: false, text: res?.data?.message || '遇到错误了，请检查积分是否充足或联系系统管理员', error: true });
            }
            handleRequest(res?.data?.data?.text as string);
            setTimeout(() => {
              getUserInfo().then(user => _this.setState('user', user));
            }, 100);
          },
          fail: function (error) {
            _this.setData({ loading: false, text: '遇到错误了，请检查积分是否充足或联系系统管理员', error: true })
          }
        });
      };
      await fetchChatAPIOnce();
    } catch (error) {

    } finally {

    }
  },

  /**
   * 复制解析结果
   */
  copyValue: function (event: any) {
    const { text } = event.currentTarget.dataset;
    wx.setClipboardData({ data: text });
  },
})