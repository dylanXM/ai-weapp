import { store } from '../../../../store/index';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { useKami } from '../../../../api/index';
import { getUserInfo } from '../../../../api/index';
import { login } from 'miniprogram/utils/login';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kami: '',
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['navBar'],
      actions: ['setState', 'setStates'],
    });
  },

  /**
   * 监听卡密变化
   */
  handleKamiChange(event: any) {
    this.setData({ kami: event.detail });
  },

  /**
   * 使用卡密
   */
  usekami: async function() {
    try {
      const { kami } = this.data;
      if (!kami) {
        wx.showToast({ title: '请输入兑换码！', icon: 'none' });
        return;
      }
      this.setData({ loading: true });
      await useKami({ code: kami });
      getUserInfo().then(user => this.setState('user', user));
      wx.showToast({ title: '积分兑换成功！', icon: 'none' });
    } catch (err) {
      wx.showToast({ title: err?.message || '接口出错了，请重试', icon: 'none' });
    } finally {
      setTimeout(() => this.setData({ loading: false }), 3000);
    }
  },

  /**
   * 用户点击返回
   */
  onBack() {
    wx.navigateBack();
  },
})