import config from '../../const/config/index';
import request from '../../utils/api';
import { DrawParams } from './type';

/**
 * 获取所有绘画
 */
export const queryAllDrawList = async (params: DrawParams): Promise<any> => {
  const res = await request<any>({
    url: `${config.url}/chatLog/drawAll`,
    method: 'GET',
    data: { ...params },
  });
  return res.data;
};

/**
 * 获取我的绘画
 */
export const queryMyDrawList = async (params: DrawParams): Promise<any> => {
  const res = await request<any>({
    url: `${config.url}/chatLog/draw`,
    method: 'GET',
    data: { ...params },
  });
  return res.data;
};

/**
 * 绘画
 */
export const drawPicture = async (params: any): Promise<any> => {
  const res = await request<any>({
    url: `${config.url}/chatgpt/chat-draw`,
    method: 'POST',
    data: { ...params },
  });
  return res.data;
}

