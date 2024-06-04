import { store } from '../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { queryProducts, queryOrder, getUserInfo } from '../../../../api/index';

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
  async buy(event: any) {
    const _this = this;
    const { product } = event.target.dataset;
    const order: any = await queryOrder({ goodsId: product.id });
    wx.requestPayment({
      timeStamp: order?.timeStamp,
      nonceStr: order?.nonceStr,
      package: order?.package,
      signType: order?.signType,
      paySign: order?.paySign,
      success (res) {
        setTimeout(() => {
          getUserInfo().then(user => _this.setState('user', user));
          wx.showToast({ title: '积分已增加', icon: 'success' });
        }, 1000);
      },
      fail (error) {
        // wx.showToast({ title: '支付失败', icon: 'error' });
      }
    });
  }
})