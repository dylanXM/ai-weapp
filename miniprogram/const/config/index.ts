export const initScrollHeight = 100000;

export default {
  url: 'https://service.winmume.com/api',
  // url: 'http://127.0.0.1:9520/api',
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
};

export const defaultAvatar = 'https://img.zcool.cn/community/01a6095f110b9fa8012066219b67d4.png?x-oss-process=image/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100';

interface RechargeType {
  [key: number]: string
}

export const RechargeTypeMap: RechargeType = {
  1: '注册赠送',
  2: '受邀请赠送',
  3: '邀请他人赠送',
  4: '购买卡密充值',
  5: '管理员赠送',
  6: '扫码购买充值',
  7: 'MJ绘画失败退款',
  8: '签到奖励',
}