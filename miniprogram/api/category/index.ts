import config from '../../const/config/index';
import request from '../../utils/api';

/**
 * 获取预设模版分类
 */
export const queryPresetsCats = async (): Promise<any> => {
  const res = await request<any[]>({
    url: `${config.url}/app/queryCats`,
    method: 'GET',
    data: {},
  });
  return res.data;
};

/**
 * 获取预设模版列表
 */
export const queryPresetsList = async (): Promise<any> => {
  const res = await request<any[]>({
    url: `${config.url}/app/list`,
    method: 'GET',
    data: {},
  });
  return res.data;
};