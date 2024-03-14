import Store from '../sdks/store';
import { UserData } from 'miniprogram/api/auth/type';
import { BaseModelData, ModelData } from 'miniprogram/api/model/type';
import { GlobalData } from 'typings';

const store = new Store<GlobalData>({
  menuList: [],
  user: {} as UserData,
  model: {} as BaseModelData, 
  modelList: {} as ModelData,
  loading: true,
  navBar: {
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
  },
});

export function connect(pageConfig: any, mapStateToData: Function | Object) {
  const mapState = typeof mapStateToData === 'function' ? mapStateToData(store.getState()) : { ...mapStateToData };
  pageConfig.data = { ...pageConfig.data, ...mapState };
  return pageConfig;
}

export default store;

