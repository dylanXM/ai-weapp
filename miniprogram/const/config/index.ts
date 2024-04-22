export const initScrollHeight = 100000;

export default {
  url: 'https://service.winmume.com/api',
  // url: 'http://127.0.0.1:9520/api'
  initScroll: {
    height: initScrollHeight,
    scrollTop: initScrollHeight,
    toBottom: false,
  },
  appImg: 'https://shop.winmume.com/uploads/images/1111712880633_.pic.png',
};

export const modelTypeMap = {
  '1': {
    count: 'model3Count',
    useToken: 'useModel3Token',
    countKey: 'modelCount',
    useTokenKey: 'useModelToken',
  },
  '2': {
    count: 'model4Count',
    useToken: 'useModel4Token',
    countKey: 'modelCount',
    useTokenKey: 'useModelToken',
  }
};

export const groupActions = [
  { name: '删除', color: '#ee0a24', action: 'del' },
  { name: '重命名', action: 'rename' },
  { name: '清空聊天消息', action: 'clear' },
];

export const presetError = {
  catId: '请填写【应用分类】',
  name: '请填写【应用名称】',
  preset: '请填写【预设指令】',
  des: '请填写【应用描述】',
  demoData: '请填写【示例内容】',
  coverImg: '请填写【应用Logo】',
  public: '请填写【是否共享】',
}