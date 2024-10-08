interface ListenKeyboardHeightChangeParams {
  safeHieghtCallback: (height: number) => void;
}

// 监听键盘弹出事件并动态调整底部安全高度
export const listenSafeHeightChange = ({ safeHieghtCallback }: ListenKeyboardHeightChangeParams) => {
  // 获取系统信息
  const systemInfo = wx.getSystemInfoSync();
  // 判断是否为iPhone
  const isIphone = systemInfo.model.indexOf('iPhone') > -1;
  // 获取底部安全区域高度
  const safeBottom = systemInfo.safeArea ? systemInfo.screenHeight - systemInfo.safeArea.bottom : 0;

  if (isIphone) {
      // 设置页面样式，预留出底部安全区域的高度
      safeHieghtCallback && safeHieghtCallback(safeBottom);
  }
}