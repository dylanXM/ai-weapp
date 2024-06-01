import { store } from '../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { validateEmail } from '../../../../utils/email';
// @ts-ignore
import Dialog from '@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    password: '',
    loading: false,
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
   * 邮箱字段的变化函数
   */
  handleEmailChange: function(event: any) {
    const value = event.detail;
    this.setData({ email: value });
  },

  /**
   * 密码字段的变化函数
   */
  handlePasswordChange: function(event: any) {
    const value = event.detail;
    this.setData({ password: value });
  },

  /**
   * 使用邮箱关联用户信息
   */
  updateUserInfoFromEmail: function() {
    const { email, password } = this.data;
    if (!email || !validateEmail(email)) {
      wx.showToast({ title: '邮箱格式错误', icon: 'error' });
      return;
    }
    if (!password) {
      wx.showToast({ title: '请填写密码', icon: 'error' });
      return;
    }
    Dialog.confirm({
      title: '是否确定关联邮箱',
      message: '如果邮箱已被注册，则将原绑定邮箱的账户删除，并将邮箱关联至该账号，原账号积分将加在该账号',
    })
      .then(() => {
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  }
})