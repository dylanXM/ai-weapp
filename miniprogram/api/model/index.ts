import config from '../../const/config/index';
import request from '../../utils/api';
import { BaseModelData, ModelData } from './type';
/**
 * 获取全量模型数据
 */
export const queryModelList = async (): Promise<ModelData> => {
  const res = await request<ModelData>({
    url: `${config.url}/models/list`,
    method: 'GET',
    data: {},
  });
  return res.data;
};

/**
 * 获取当前使用的模型
 */
export const queryBaseModel = async (): Promise<BaseModelData> => {
  const res = await request<BaseModelData>({
    url: `${config.url}/models/baseConfig`,
    method: 'GET',
    data: {},
  });
  return res.data;
}