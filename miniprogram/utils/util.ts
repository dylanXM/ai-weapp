import encoding from './encoding/encoding.js';

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

let lastString = '';

function findLastJsonString(input: string) {
  const jsonObjects = [];
  let stack = [];
  let jsonString = '';
  let inString = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Toggle the inString flag when encountering a double-quote, if it's not escaped
    if (char === '"' && (i === 0 || input[i - 1] !== '\\')) {
      inString = !inString;
    }

    if (inString) {
      jsonString += char;
      continue;
    }

    if (char === '{') {
      if (stack.length === 0) {
        jsonString = '';
      }
      stack.push(char);
    }

    if (stack.length > 0) {
      jsonString += char;
    }

    if (char === '}') {
      stack.pop();
      if (stack.length === 0) {
        jsonObjects.push(jsonString);
        jsonString = '';
      }
    }
  }

  console.log(jsonObjects)

  if (!jsonObjects.length) {
    const newInput = lastString + input;
    lastString = '';
    return findLastJsonString(newInput);
  }

  if (jsonObjects && jsonObjects.length > 0) {
    // 返回最后一个匹配项
    const len = jsonObjects.length;
      for (let i = len - 1; i >= 0; i--) {
        try {
            if (jsonObjects[i].startsWith('{') && jsonObjects[i].endsWith('}')) {
              lastString = input;
              return jsonObjects[i];
            }
        } catch (err) {
            continue;
        }
      }
  }
  lastString = input;
  return input;
}

export function uint8ArrayToString(arrayBuffer: ArrayBuffer) {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    const decoder = new encoding.TextDecoder('utf-8');
    const str = decoder.decode(uint8Array);
    const res = findLastJsonString(str) || str;
    return res;
  } catch (err) {
    console.error(err);
    return '';
  }
}

export function getFirstDayOfMonthTimestamp() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return firstDayOfMonth.getTime();
}

export function getLastDayOfMonthTimestamp() {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const lastDayOfMonth = new Date(nextMonth - 1);
  return lastDayOfMonth.getTime();
}

export function getTimeStampFromString(dateString: string) {
  // 使用给定的时间字符串创建一个Date对象
  const date = new Date(dateString);
  // 重置时间为00:00:00
  date.setHours(0, 0, 0, 0);
  // 返回时间戳
  return date.getTime();
}

