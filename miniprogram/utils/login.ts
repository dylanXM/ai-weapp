import { getWechatSession, wxLogin } from '../api/index';

export async function login(code: string) {
  // const openId = wx.getStorageSync('openId');
  // const sessionKey = wx.getStorageSync('sessionKey');
  // const token = wx.getStorageSync('token');

  // if (token && sessionKey && openId) {
  //   return token;
  // }

  const session = await getWechatSession({ code: code });
  wx.setStorageSync('openId', session.openId);
  wx.setStorageSync('sessionKey', session.sessionKey);
  const newToken = await wxLogin({ openId: session.openId });
  wx.setStorageSync('token', newToken);
  return newToken;
}