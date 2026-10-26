// The Android app (Capacitor). On the website every function here is inert.
// Plugins come from the native bridge (window.Capacitor.Plugins), so the web
// bundle needs no Capacitor code of its own.
const capacitor = () => globalThis.Capacitor;
const plugin = name => capacitor()?.Plugins?.[name];

export function isNative() {
  return !!capacitor()?.isNativePlatform?.();
}

// The system back button: the handler returns true when it used the press.
// Otherwise, on the cover, the app closes.
export function onBack(handler) {
  const app = plugin('App');
  if (!isNative() || !app) return;
  app.addListener('backButton', () => {
    if (!handler()) app.exitApp();
  });
}

// The app going to the background and coming back, like a hidden tab.
export function onLifecycle(pause, resume) {
  const app = plugin('App');
  if (!isNative() || !app) return;
  app.addListener('pause', pause);
  app.addListener('resume', resume);
}

// WebViews cannot download files, so an exported save goes through the share
// sheet instead (Drive, Files, email…). Resolves false if sharing failed.
export async function shareFile(name, text) {
  const files = plugin('Filesystem'),
    share = plugin('Share');
  if (!isNative() || !files || !share) return false;
  try {
    const {uri} = await files.writeFile({path: name, data: text, directory: 'CACHE', encoding: 'utf8'});
    await share.share({title: name, files: [uri]});
    return true;
  } catch (error) {
    // Closing the share sheet without choosing is not a failure.
    return /cancel/i.test(String(error?.message || error));
  }
}
