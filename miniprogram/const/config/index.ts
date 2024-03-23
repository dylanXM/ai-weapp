export const initScrollHeight = 100000;

export default {
  url: 'https://service.winmume.com/api',
  // url: 'http://127.0.0.1:9520/api'
  initScroll: {
    height: initScrollHeight,
    scrollTop: initScrollHeight,
    toBottom: false,
  }
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
}