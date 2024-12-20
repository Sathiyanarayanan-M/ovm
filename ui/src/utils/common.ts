export const randomStr = (start?: number, end?: number) =>
  Math.random()
    .toString(36)
    .substring(start || 2, end || 9);

export const debounce = (func: any, timeout = 300) => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
