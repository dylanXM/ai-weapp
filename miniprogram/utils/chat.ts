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

function replaceMarkdownLinks(text: string) {
  // 匹配 Markdown 链接的正则表达式
  const markdownLinkRegex = /-\s*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let matches;
  let updatedText: string = text;
  let index = 1;

  // 使用 while 循环遍历所有匹配项
  while ((matches = markdownLinkRegex.exec(text)) !== null) {
    const [fullMatch, , link] = matches;

    // 找到当前匹配项的位置
    const positionBeforeLink = updatedText.indexOf(fullMatch);

    // 提取链接前面的段落
    const precedingText = updatedText.slice(0, positionBeforeLink).split('\n').pop().trim();

    // 使用前面的段落文本创建新的链接
    const newLink = `${index++}. [${precedingText}](${link})`;

    // 用新的链接替换原始匹配项
    updatedText =
      updatedText.slice(0, positionBeforeLink - precedingText.length - 1).trim() +
      '\n\n' +
      newLink +
      updatedText.slice(positionBeforeLink + fullMatch.length);
  }

  return updatedText;
}

export const formatAiText = (text: string) => {
  if (text === null) {
    return '无回复内容';
  }
  if (!text) {
    return '';
  }
  let result = text.replace(/↵/g, '\n');

  result = processString(text);
  
  result = replaceMarkdownLinks(result);

  return result;
};