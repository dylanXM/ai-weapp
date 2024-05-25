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

export function uint8ArrayToString(arrayBuffer: ArrayBuffer) {
  try {
    console.log('step1 - ', arrayBuffer);
    const uint8Array = new Uint8Array(arrayBuffer);
    console.log('step2 - ', uint8Array);
    const decoder = new encoding.TextDecoder('utf-8');
    console.log('step3 - ', decoder.decode(uint8Array), decoder.decode(arrayBuffer));
    const str = decoder.decode(uint8Array);
    return str; 
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

