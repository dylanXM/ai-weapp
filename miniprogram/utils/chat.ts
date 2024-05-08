function processString(input: string) {
  // 使用正则表达式匹配所有以“检索”开头，以“...”结尾的字符串，并增加换行符
  const regex = /检索.*?\.{3}(?![\s\S]*检索.*?\.{3})/g;
  let processedString = input.replace(regex, (match) => {
    console.log('match', match);
      return match + '\n';
  });

  // 将所有链接转换为markdown格式的链接
  processedString = processedString.replace(/(?:^|\s)(http[s]?:\/\/[^\s]+)(?:\s|$)/g, ' [$1]($1)\n\n');

  return processedString;
}

export const formatAiText = (text: string) => {
  if (text === null) {
    return '无回复内容';
  }
  if (!text) {
    return '';
  }
  let result = processString(text);
  console.log('result', result);
  // 替换掉所有的“**”字符串
  // let result = text.replace(/\*\*/g, '');
  // let result = text;
  // 将所有大于1的换行符转换为1个换行符
  // result = result.replace(/(\n|\r|↵)+/g, '\n');
  // result = result.replace('~', '～');
  return result;
};