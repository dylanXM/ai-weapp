import { getUserInfo } from '../../api/index';
import { login } from '../../utils/login';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from '../../store/index';

// pages/login/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: [],
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
  
  reLogin() {
    wx.login({
      success: async res => {
        try {
          this.setData({ loading: true });
          const token = await login(res.code);
          if (!token) return;
          const user = await getUserInfo();
          // @ts-ignore
          this.setStates({ user, globalLoading: false });
          wx.navigateTo({
            url: '../index/index',
            fail: function(err) {
              console.error(err);
            }
          });
        } catch (err) {
          wx.showToast({ title: '登录失败，请重试', icon: 'none' });
        } finally {
          this.setData({ loading: false });
        }
      },
    });
  }
})