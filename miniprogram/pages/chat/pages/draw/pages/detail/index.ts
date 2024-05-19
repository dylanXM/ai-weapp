import { store } from '../../../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    url: '',
    prompt: '',
    downloadDisabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option: any) {
    const { windowWidth } = this.data;
    const { url = '', prompt = '' } = option;
    this.setData({ url, prompt });
    createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['navBar', 'user', 'allPresets'],
      actions: ['setState', 'setStates'],
    });
    const ctx = wx.createCanvasContext('image');
    const _this = this;
    wx.showLoading({ title: '图片加载中...', mask: true });
    wx.getImageInfo({
      src: option.url, // 图片地址
      success: (res) => {
        console.log(res);
        ctx.drawImage(res.path, 0, 0, windowWidth, windowWidth);
        ctx.draw();
        _this.setData({ downloadDisabled: false });
        wx.hideLoading();
      },
      fail: () => {
        wx.showToast({ title: '图片加载失败', icon: 'error' });
        wx.hideLoading();
      }
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
   * 复制prompt
   */
  copyPrompt: function (event: any) {
    const { text } = event.currentTarget.dataset;
    wx.setClipboardData({ data: text });
  },

  /**
   * 绘制同款
   */
  toDrawPicture: function() {
    const url = `../../../draw/pages/draw-picture/index?prompt=${this.data.prompt}`;
    wx.navigateTo({
      url
    });
  },

  /**
   * 点击保存图片
   */
  handleClickSave(event: any) {
    const _this = this;
    const { downloadDisabled } = _this.data;
    if (downloadDisabled) {
      wx.showToast({ title: '图片正在准备中，请稍后重试～', icon: 'none' });
      return;
    }
    const { value } = event.currentTarget.dataset;
    wx.canvasToTempFilePath({
      canvasId: value,
      success: (res) => {
        const tempFilePath = res.tempFilePath;
        // 图片
        wx.getSetting({
          success: (res) => {
            console.log(res);
            const status = res.authSetting['scope.writePhotosAlbum'];
            if (!status) {
              // 引导用户授权...
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                  _this.saveImg(tempFilePath);
                },
                fail: () => {
                  wx.showToast({
                    title: '保存图片失败' ,
                    icon: 'error',
                  });
                }
              })
            } else {
              // 保存图片到系统相册
              _this.saveImg(tempFilePath);
            }
          }
        })
      },
      fail: function(err) {
        console.log(err);
      }
    });
   },
   /* 保存图片 */
   saveImg(tempFilePath: string) {
     wx.saveImageToPhotosAlbum({
       filePath: tempFilePath,
       success: function (res) {
         wx.showToast({
           title: '保存图片成功',
         });
       },
       fail: function (err) {
         wx.showToast({
           title: '保存图片失败' ,
           icon: 'error',
         });
       }
     })
   }
})