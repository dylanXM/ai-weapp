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
  const uint8Array = new Uint8Array(arrayBuffer);
  let str = '';
  console.log('unit8Array', uint8Array, );
  [].forEach.call(uint8Array, (byte) => {
      str += String.fromCharCode(byte);
  });
  return str;
}
