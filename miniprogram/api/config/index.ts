import config from '../../const/config/index';
import request from '../../utils/api';
import { Menu, QueryFrontRes } from './type';

/**
 * 获取页面配置
 */
export const queryFront = async (): Promise<QueryFrontRes> => {
  const res = await request<QueryFrontRes>({
    url: `${config.url}/config/queryFronet`,
    method: 'GET',
    data: { domain: '' },
  });
  return res.data;
};

/**
 * 获取底部导航
 */
export const queryMenuList = async (): Promise<Menu[]> => {
  const res = await request<Menu[]>({
    url: `${config.url}/menu/list`,
    method: 'GET',
    data: { menuPlatform: 0 },
  });
  return res.data;
}