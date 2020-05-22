export default function debounce(fn, timeout) {
  let timeoutUID;
  return function debounced(...args) {
    clearTimeout(timeoutUID);
    timeoutUID = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
}