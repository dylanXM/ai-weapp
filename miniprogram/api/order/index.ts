import config from '../../const/config/index';
import request from '../../utils/api';

/**
 * 获取商品
 */
export async function queryProducts() {
  const res = await request({
    url: `${config.url}/crami/queryAllPackage`,
    method: 'GET',
    data: {
      status: 1,
      type: 1,
      size: 50
    },
  });
  return res.data;
}