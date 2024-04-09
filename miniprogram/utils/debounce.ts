export const debounce = (fn: Function, delay: number = 300) => {
  let timer: number | null = null;
  const _this = this;
  return (...args: any) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      fn.apply(_this, args);
    }, delay);
  }
}