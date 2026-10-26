// The active language pack. A built edition installs exactly one pack before
// the game starts; tests install one explicitly. Modules read the pack when they
// run, never while they are being imported, so one source serves every edition.
export const L = {};

export function useLocale(pack) {
  for (const key of Object.keys(L)) delete L[key];
  Object.assign(L, pack);
  return L;
}

// Interface strings with {named} placeholders. A missing key shows itself, so
// an untranslated string is obvious in review rather than silently blank.
export function t(key, vars) {
  let text = L.strings?.[key] ?? key;
  if (vars) text = text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
  return text;
}
