import config from '../../const/config/index';
import request from '../../utils/api';
import { GetWechatSessionReq, GetWechatSessionRes, UserData } from './type';

/**
 * 根据微信code获取openId和sessionKey
 * @param {string} code
 * @returns
 */
export const getWechatSession = async ({ code }: GetWechatSessionReq): Promise<GetWechatSessionRes> => {
  const res = await request<GetWechatSessionRes>({
    url: `${config.url}/official/getWechatSession`,
    method: 'GET',
    data: { code },
  });
  return res.data;
};

/**
 * 使用openId登录
 * @param {string} openId
 */
export const wxLogin = async ({ openId }: { openId: string }): Promise<string> => {
  const res = await request<string>({
    url: `${config.url}/auth/registerOrLoginByWechat`,
    method: 'POST',
    data: { openId },
  });
  return res.data;
};

/**
 * 获取用户信息
 */
export const getUserInfo = async (): Promise<UserData> => {
  const res = await request<UserData>({
    url: `${config.url}/auth/getInfo`,
    method: 'GET',
    data: {},
  });
  return res.data;
}

/**
 * 更新用户信息
 */
export const updateUserInfo = async ({ username, avatar }: { username: string; avatar: string }): Promise<any> => {
  const res = await request<any>({
    url: `${config.url}/user/updateUserNameAndAvatar`,
    method: 'POST',
    data: { username, avatar },
  });
  return res.data;
}

/**
 * 获取签到列表
 */
export const getSignList = async () => {
  const res = await request<any>({
    url: `${config.url}/signin/signinLog`,
    method: 'GET',
    data: {},
  });
  return res.data;
};

/**
 * 签到
 */
export const signOn = async () => {
  const res = await request<any>({
    url: `${config.url}/signin/sign`,
    method: 'POST',
    data: {},
  });
  return res.data;
};

/**
 * 激活卡密
 */
export const useKami = async ({ code }: { code: string }) => {
  const res = await request<any>({
    url: `${config.url}/crami/useCrami`,
    method: 'POST',
    data: { code },
  });
  return res.data;
};

/**
 * 广告奖励
 */
export const advCharge = async ({ id, count }: { id: number; count?: number }) => {
  const res = await request<any>({
    url: `${config.url}/user/advcharge`,
    method: 'POST',
    data: {
      model3Count: count || 10,
      model4Count: count || 10,
      drawMjCount: count || 10,
      userId: id,
  },
  });
  return res.data;
}

/**
 * 激活卡密
 */
export const userConnectEmail = async (data: { email: string; password: string; }) => {
  const res = await request<any>({
    url: `${config.url}/auth/updateUserInfoUseEmail`,
    method: 'POST',
    data,
  });
  return res.data;
};

/**
 * 获取个人积分详情
 */
export const queryBounsDetail = async ({ page = 1, pageSize = 10 }) => {
  const res = await request<any>({
    url: `${config.url}/balance/rechargeLog`,
    method: 'GET',
    data: { page, pageSize },
  });
  return res.data;
};