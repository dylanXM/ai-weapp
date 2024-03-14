interface ListenKeyboardHeightChangeParams {
  safeHieghtCallback: (height: number) => void;
  keyboardHeightCallback: (height: number) => void;
}

// 监听键盘弹出事件并动态调整底部安全高度
export const listenKeyboardHeightChange = ({ safeHieghtCallback, keyboardHeightCallback }: ListenKeyboardHeightChangeParams) => {
  // 获取系统信息
  const systemInfo = wx.getSystemInfoSync();
  const screenHeight = systemInfo.screenHeight;
  // 判断是否为iPhone
  const isIphone = systemInfo.model.indexOf('iPhone') > -1;
  // 获取底部安全区域高度
  const safeBottom = systemInfo.safeArea ? systemInfo.screenHeight - systemInfo.safeArea.bottom : 0;

  console.log('safeBottom',safeBottom);

  if (isIphone) {
      // 设置页面样式，预留出底部安全区域的高度
      safeHieghtCallback(safeBottom);
  }

  // 监听键盘高度变化事件
  wx.onKeyboardHeightChange((event: any) => {
    console.log('keyboardHeight', event.height);
    keyboardHeightCallback(event.height);
  });
}