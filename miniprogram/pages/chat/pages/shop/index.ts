import { store } from '../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { queryProducts } from '../../../../api/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [] as any[],
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

    this.getProducts();
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
   * 获取商品
   */
  async getProducts() {
    try {
      const data = await queryProducts();
      console.log('orders', data);
      this.setData({ products: data?.rows });
    } catch (error) {

    }
  },

  /**
   * 唤起支付页面
   */
  async buy() {
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success (res) { },
      fail (res) { }
    });
  }
})