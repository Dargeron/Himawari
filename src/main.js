import {useLocale} from './i18n.js';
import locale from './locales/__LOCALE__.js';
import {data} from './generated/pack.js';
import {setAssetResolver} from './assets.js';
import {startGame} from './app.js';

// Entry point of an edition's game.js. The build substitutes __LOCALE__ and
// generates the pack; the loader has already prepared window.HIMAWARI_BOOT.
useLocale({...locale, ...data});
const boot = window.HIMAWARI_BOOT;
if (boot?.assetURL) setAssetResolver(boot.assetURL);
startGame(boot);
