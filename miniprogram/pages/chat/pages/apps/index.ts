import { queryMyPresetsList, queryPresetsCats, queryPresetsList } from '../../../../api/index';
import { formatMyPreset } from '../../../../utils/preset';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottomSafeHeight: 0,
    presets: {
      all: [],
      mine: [],
    },
    query: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['navBar', 'user', 'allPresets', 'allMinePresets'],
      actions: ['setState', 'setStates'],
    });
    this.getMyPresets();
    this.getPresets();
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

  onBack: function() {
    wx.navigateBack();
  },

  // 初始数据获取
  getPresets: async function () {
    const [categories, presets] = await Promise.all([queryPresetsCats(), queryPresetsList()]);
    const newPresets = presets.rows.map((item: any) => ({
      ...item,
    }));
    this.setData({ presets: { ...this.data.presets, all: newPresets } });
    this.setState('allPresets', newPresets);
    this.setState('allCategories', categories.rows);
  },
  getMyPresets: async function() {
    const presets = await queryMyPresetsList();
    const newPresets = presets.rows.map((item: any) => formatMyPreset(item));
    this.setData({ presets: { ...this.data.presets, mine: newPresets } });
    this.setState('allMinePresets', newPresets);
  },
  searchPresets: function () {
    // @ts-ignore
    const { query, allPresets, allMinePresets } = this.data;
    if (!query) {
      this.setData({ presets: { all: allPresets, mine: allMinePresets } });
      return; 
    }
    const formatedQuery = query.toLowerCase().trim();
    const searchAllPresets = allPresets.filter((preset: any) => {
      const name = preset.name || preset.appName;
      const des = preset.des || preset.appDes;
      return name.toLowerCase().includes(formatedQuery) || des.toLowerCase().includes(formatedQuery);
    });
    const searchMinePresets = allMinePresets.filter((preset: any) => {
      const name = preset.name || preset.appName;
      const des = preset.des || preset.appDes;
      return name.toLowerCase().includes(formatedQuery) || des.toLowerCase().includes(formatedQuery);
    });
    this.setData({ presets: { all: searchAllPresets, mine: searchMinePresets } });
  },
  handleClickPreset: function (event: any) {
    const eventChannel = this.getOpenerEventChannel();
    const appId = event.currentTarget.dataset.id;
    wx.navigateBack().then(() => {
      eventChannel.emit('createChatGroup', { detail: { key: appId } });
    });
  },
  handleQueryChange: function(event: any) {
    const query = event.detail;
    this.setData({ query: query });
  },
  toCreatePreset: function() {
    const _this = this;
    wx.navigateTo({
      url: '../create-presets/index',
      events: {
        refresh: () => {
          _this.getMyPresets();
          _this.getPresets();
        }
      }
    })
  }
})