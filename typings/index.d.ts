/// <reference path="./types/index.d.ts" />

import { UserData } from 'miniprogram/api/auth/type';
import { BaseModelData, ModelData } from 'miniprogram/api/model/type';
import { Menu, QueryFrontRes } from '../miniprogram/api/config/type';

interface NavBar {
  navBarHeight: number; // 导航栏高度
  menuRight: number; // 胶囊距右方间距（方保持左、右间距一致）
  menuTop: number; // 胶囊距底部间距（保持底部间距一致）
  menuHeight: number; // 胶囊高度（自定义内容可与胶囊高度保证一致）
}

interface GlobalData extends Partial<QueryFrontRes> {
  menuList: Menu[];
  user: UserData;
  model: BaseModelData;
  modelList: ModelData;
  loading: boolean;
  navBar: NavBar;
}

export type GlobalDataKey = keyof GlobalData;
export type ListenersType = Record<GlobalDataKey, ListenerCallback[]>;
export type ListenerCallback = <T extends GlobalDataKey>(value: GlobalData[T]) => void;

interface IAppOption {
  towxml: any;
  initNavBar: () => void;
}