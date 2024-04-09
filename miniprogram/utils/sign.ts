import { getTimeStampFromString } from './util';

const signWeakMap = new WeakMap();
function generateSignMap(signList: any[]) {
  const signMap: Record<string, boolean> = {};
  signList.forEach(sign => {
    const { isSigned, signInDate } = sign;
    const key = String(getTimeStampFromString(signInDate));
    signMap[key] = isSigned;
  });
  signWeakMap.set(signList, signMap);
}
export function getSignMap(signList: any[]) {
  if (!signList || !Array.isArray(signList)) {
    return {};
  }
  if (!signWeakMap.has(signList)) {
    generateSignMap(signList);
  }
  const signMap = signWeakMap.get(signList);
  return signMap;
}