export const formatAiText = (text: string) => {
  // 替换掉所有的“**”字符串
  let result = text.replace(/\*\*/g, '');
  // 将所有大于1的换行符转换为1个换行符
  result = result.replace(/(\r?\n|\r)+/g, '\n');
  return result;
};