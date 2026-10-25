// Every image and sound goes through one resolver. The loader installs a
// resolver that adds the asset root and a content-hash version, so a changed
// file can never be served from a stale cache and tests can use plain paths.
let resolve = path => path;

export function setAssetResolver(fn) {
  resolve = fn;
}

export function assetURL(path) {
  return resolve(path);
}
