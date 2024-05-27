import { store } from '../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { queryNotice } from '../../../../api/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: '',
    title: '',
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

    this.getNotice();
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
   * 获取通知
   */
  getNotice: async function() {
    try {
      const res = await queryNotice();
      console.log('res', res);
      this.setData({ notice: res.noticeInfo || '', title: res.noticeTitle || 'sweetAI 欢迎您' });
    } catch (err) {
      console.error(err);
    }
  },
})