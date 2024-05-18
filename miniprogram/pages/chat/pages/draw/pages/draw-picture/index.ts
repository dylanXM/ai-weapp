import { store } from '../../../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      prompt: '',
      quality: 'standard',
      size: '1024x1024',
    },
    typeActions: ['古风', '二次元', '写实照片', '油画', '水彩画', '油墨画', '黑白雕版画', '雕塑', '3D模型', '手绘草图', '炭笔画', '极简线条画', '电影质感', '机械感'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['navBar', 'user', 'allPresets'],
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
   * 描述词变化
   */
  handlePromptChange: function(event: any) {
    console.log('event', event);
    const { formData } = this.data;
    const prompt = event.detail;
    this.setData({  })
  }
})