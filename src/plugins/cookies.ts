import { setting } from './setting';
const { langKey, themeKey } = setting;
// @ts-ignore
import Cookies from 'js-cookie';

export function getLanguage() {
    return Cookies.get(langKey);
}

export function setLanguage(lang: any) {
    return Cookies.set(langKey, lang);
}

export function getSettings() {
    const settings = Cookies.get(themeKey);
    return settings ? JSON.parse(settings) : null;
}

export function setSettings(theme: any) {
    return Cookies.set(themeKey, JSON.stringify(theme));
}
