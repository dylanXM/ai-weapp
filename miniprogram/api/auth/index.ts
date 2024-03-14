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