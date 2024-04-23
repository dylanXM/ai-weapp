export const formatAiText = (text: string) => {
  if (text === null) {
    return '无回复内容';
  }
  if (!text) {
    return '';
  }
  let result = text ;
  // 替换掉所有的“**”字符串
  // let result = text.replace(/\*\*/g, '');
  // let result = text;
  // 将所有大于1的换行符转换为1个换行符
  // result = result.replace(/(\r?\n|\r)+/g, '\n');
  result = result.replace('~', '～');
  return result;
};