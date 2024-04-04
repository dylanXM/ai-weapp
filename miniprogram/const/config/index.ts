export const initScrollHeight = 100000;

export default {
  url: 'https://service.winmume.com/api',
  // url: 'http://127.0.0.1:9520/api'
  initScroll: {
    height: initScrollHeight,
    scrollTop: initScrollHeight,
    toBottom: false,
  },
  appImg: 'https://mp.weixin.qq.com/wxopen/basicprofile?action=get_headimg&token=566327976&t=1712204421778'
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
];