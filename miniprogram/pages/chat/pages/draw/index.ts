import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import { queryAllDrawList, queryMyDrawList } from '../../../../api/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allDrawList: {
      count: 0,
      rows: []
    },
    myDrawList: [] as unknown[],
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

    this.getAllDrawList();
    this.getMyDrawList();
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
    // wx.redirectTo({
    //   url: '../../../index/index',
    //   fail: (err) => {
    //     console.log('err', err);
    //   }
    // });
  },

  /**
   * 获取所有绘画
   */
  getAllDrawList: async function() {
    const list = await queryAllDrawList({
      size: 999,
      rec: 1,
      model: 'DALL-E2',
    });
    this.setData({ allDrawList: { ...list } });
  },

  /**
   * 获取我的绘画
   */
  getMyDrawList: async function() {
    const list = await queryMyDrawList({
      size: 5,
      rec: 1,
      model: 'DALL-E2',
    });
    this.setData({ myDrawList: [...list] });
  },

  /**
   * 跳往我的绘画页面
   */
  toDrawPage: function() {
    const _this = this;
    wx.navigateTo({
      url: '../draw/pages/draw-picture/index',
      events: {
        refreshMyDraws: function() {
          _this.getMyDrawList();
        }
      }
    });
  },

  /**
   * 跳往图片详情页
   */
  toImageDetail: function(event: any) {
    const { image } = event.target.dataset;
    const url = `?url=${image.answer}&prompt=${image.prompt}`;
    wx.navigateTo({
      url: `../draw/pages/detail/index${url}`,
    });
  }
})