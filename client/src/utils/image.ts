export const isWebpSupported = (() => {
  let supported = false;

  try {
    supported =
      document
        .createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') == 0;
  } catch (error) {}

  return supported;
})();
