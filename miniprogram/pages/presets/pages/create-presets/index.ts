import { presetError } from '../../../../const/config/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import { createMinePreset } from '../../../../api/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appClassify: {
      chooseApp: {},
      options: [],
      visible: false,
    },
    appName: '',
    preset: '',
    appDesc: '',
    demo: '',
    logos: [],
    checked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['allCategories'],
      actions: ['setState', 'setStates'],
    })
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
  onBack: function() {
    wx.navigateBack();
  },

  /**
   * 点击应用分类显示picker
   */
  openAppPicker: function(){ 
    const { appClassify, allCategories } = this.data;
    const options = allCategories?.map(cat => cat.name);
    this.setData({ appClassify: { ...appClassify, visible: true, options } });
  },

  /**
   * 关闭应用分类picker
   */
  closeAppPicker: function() {
    const { appClassify } = this.data;
    this.setData({ appClassify: { ...appClassify, visible: false } });
  },

  /**
   * 选择应用分类
   */
  selectApp: function(event: any) {
    const { allCategories, appClassify } = this.data;
    const { value } = event.detail;
    const appId = allCategories.find(cat => cat.name === value).id;
    console.log('selectApp', allCategories, value, appId);
    this.setData({ appClassify: { ...appClassify, chooseApp: { label: value, value: appId }, visible: false } });
  },

  /**
   * 是否共享的change监听
   * @param event 
   */
  onCheckedChange: function(event: any) {
   // 需要手动对 checked 状态进行更新
   this.setData({ checked: event.detail });
  },

  /**
   * 上传文件
   */
  afterUpload(event: any) {
    const _this = this;
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://chat.winmume.com/api/upload/file',
      filePath: file.url,
      name: 'file',
      formData: {},
      success(res) {
        const stringData = res.data;
        const parseData = JSON.parse(stringData);
        // 上传完成需要更新 fileList
        const { logos = [] } = _this.data;
        logos.push({ ...file, url: parseData.data });
        _this.setData({ logos });
      },
    });
  },

  /**
   * 新建预设应用
   */
  createPreset: async function() {
    console.log(this.data);
    const { appClassify, appDesc, appName, checked, demo, logos, preset } = this.data;
    const params = {
      catId: Number(appClassify.chooseApp.value),
      name: appName,
      preset,
      des: appDesc,
      demoData: demo,
      coverImg: logos[0]?.url,
      public: checked,
    };
    for (let key in params) {
      if (!params[key] && key !== 'public') {
        wx.showToast({ title: presetError[key], icon: 'none' });
        return;
      }
    }
    console.log('params', params);
    createMinePreset(params).then(() => {
      // 返回
      this.onBack();
    });
  },
})