export function throttle(func: (...args: any[]) => void, delay: number = 300) {
  let prev = 0;
  const _this = this;
  
  return function(...args: any[]) {
    const now = Date.now();
    if (now - prev > delay) {
      console.log('throttle', func);
      func.apply(_this, args);
      prev = now;
    }
  };
}