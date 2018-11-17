export default function createCache(cacheCount) {
  let cache = [];

  function add(canvas) {
    const item = new Image();

    item.src = canvas.toDataURL();

    cache.push(item);
  }

  function reset() {
    cache = [];
  }

  function get(index) {
    const cachedIndex = index % cacheCount;
    const cachedItem = cache[cachedIndex];

    return cachedItem;
  }

  return {
    add,
    reset,
    get
  };
}
