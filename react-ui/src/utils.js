export function debounce(fun, debounceInterval) {
  let lastTimeout = null;
  debounceInterval = debounceInterval || 300;

  return function() {
    const args = arguments;
    
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(() => {
      fun.apply(this, args);
    }, debounceInterval);
  }
}