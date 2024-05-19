import { store } from '../../../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { drawPicture, getUserInfo } from '../../../../../../api/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: {
      hasGenerated: false,
      loading: false,
      url: [] as string[],
    },
    formData: {
      n: 1,
      prompt: '',
      quality: 'standard',
      size: '1024x1024',
    },
    typeActions: ['古风', '二次元', '写实照片', '油画', '水彩画', '油墨画', '黑白雕版画', '雕塑', '3D模型', '手绘草图', '炭笔画', '极简线条画', '电影质感', '机械感'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option: any) {
    createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['navBar', 'user', 'allPresets'],
      actions: ['setState', 'setStates'],
    });
    const { formData } = this.data;
    this.setData({ formData: { ...formData, prompt: option.prompt } });
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
    const { state } = this.data;
    wx.navigateBack().then(() => {
      const eventChannel = this.getOpenerEventChannel();
      if (state.hasGenerated) {
        eventChannel.emit('refreshMyDraws', {});
      }
    });
  },

  /**
   * 描述词变化
   */
  handlePromptChange: function(event: any) {
    const { formData } = this.data;
    const prompt = event.detail;
    this.setData({ formData: { ...formData, prompt } });
  },

  /**
   * 图片质量变化
   */
  handleQualityChange: function(event: any) {
    console.log('event', event);
    const { formData } = this.data;
    const quality = event.detail;
    this.setData({ formData: { ...formData, quality } });
  },

  /**
   * 图片尺寸变化
   */
  handleSizeChange: function(event: any) {
    console.log('event', event);
    const { formData } = this.data;
    const size = event.detail;
    this.setData({ formData: { ...formData, size } });
  },

  /**
   * 图片质量点击
   */
  handleTypeClick: function(event: any) {
    const type = event.currentTarget.dataset.type;
    console.log('event', event, type);
    const { formData } = this.data;
    const { prompt } = formData;
    this.setData({ formData: { ...formData, prompt: `${prompt}${prompt ? '，' : ''}${type}` } });
  },

  /**
   * 生成图片
   */
  generatePicture: async function() {
    const { formData, state } = this.data;
    if (!formData.prompt) {
      wx.showToast({ title: '请填写描述词', icon: 'none' });
      return;
    }
    try {
      this.setData({ state: { ...state, loading: true } });
      const res =  await drawPicture(formData);
      getUserInfo().then(user => this.setState('user', user));
      console.log('res', res);
      const resUrl = res?.[0];
      const url: string[] = [resUrl, ...(state.url || [])];
      this.setData({ state: { ...state, loading: false, url, hasGenerated: true } });
    } catch (error) {
      wx.showToast({ title: '图片生成失败，请重试~', icon: 'error' });
      this.setData({ state: { ...state, loading: false } });
    }
  }
})