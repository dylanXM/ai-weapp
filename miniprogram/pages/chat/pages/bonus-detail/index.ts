import { store } from '../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { queryBounsDetail } from '../../../../api/index';
import { RechargeTypeMap } from '../../../../const/config/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    loading: false,
    data: [],
    isDone: false,
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

    this.getBounsDetail({ page: 1 });
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
   * 获取积分详情
   */
  getBounsDetail: async function(props: { page: number }) {
    try {
      const { page, pageSize, data } = { ...this.data, ...props };
      this.setData({ loading: false });
      const res: any = await queryBounsDetail({ page, pageSize });
      console.log('res', res);
      const { count, rows } = res || {};
      const bounds = (page === 1 ? rows : [...data, rows]).map(item => ({ ...item, rechargeType: RechargeTypeMap[item.rechargeType] }));
      const isDone = bounds.length === count;
      this.setData({ ...this.data, ...props, data: bounds, isDone });
    } catch (err) {

    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 获取下一页数据
   */
  loadMore: function() {
    const { page, loading, isDone } = this.data;
    if (isDone || loading) {
      return;
    }
    this.getBounsDetail({ page: page + 1 });
  }
})