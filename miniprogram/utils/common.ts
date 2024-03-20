

export function isEmptyObj(obj: Record<string, any>) {
  return Object.keys(obj).length === 0;
}

export function isEmptyArray(array: Array<any>) {
  return array.length === 0;
}