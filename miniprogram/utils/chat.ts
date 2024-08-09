function processString(input: string) {
  // 使用正则表达式匹配所有以“检索”开头，以“...”结尾的字符串，并增加换行符
  const regex = /检索.*?\.{3}(?![\s\S]*检索.*?\.{3})/g;
  let processedString = input.replace(regex, (match) => {
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
    const precedingText = updatedText.slice(0, positionBeforeLink).split('\n').pop().trim().replace(/_/g, '-');

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

function processString2(input: string) {
  // 匹配以"检索"开头，以"..."结尾的字符串
  const regex = /检索[^(检索)]*\.\.\./g;
  const matches = input.match(regex);

  if (!matches) {
    return input; // 如果没有匹配项，返回原始输入
  }

  // 处理每一个匹配项
  const processedMatches = matches.map((match, index) => {
    // 替换链接为Markdown格式
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const processedMatch = match.replace(linkRegex, '[$1]($1)');
    
    // 为匹配项添加编号
    return `${processedMatch}\n\n`;
  });

  // 创建新的字符串，替换原始匹配项
  let result = input;
  matches.forEach((match, index) => {
    result = result.replace(match, processedMatches[index]);
  });

  return result;
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

  result = processString2(result);
  
  result = replaceMarkdownLinks(result);

  return result;
};