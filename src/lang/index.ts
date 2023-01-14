import { createI18n } from 'vue-i18n';
import { getLanguage } from '@/plugins/cookies';
// element-plus 的ui框架国际化语言配置
import zhCnLocale from 'element-plus/lib/locale/lang/zh-cn';
import enLocale from 'element-plus/lib/locale/lang/en';
import jaLocale from 'element-plus/lib/locale/lang/ja';
// 自定义的语言配置
import componentsLang from './components/index';
import menu from './modules/menu/index';

// 定义语言国际化内容 zh-cn en ja
const messages = {
    [zhCnLocale.name]: {
        ...zhCnLocale,
        ...componentsLang.zh,
        ...menu.zh
    },
    [enLocale.name]: {
        ...enLocale,
        ...componentsLang.en,
        ...menu.en
    },
    [jaLocale.name]: {
        ...jaLocale,
        ...componentsLang.ja,
        ...menu.ja
    },
};
export const getLocale = () => {
    const cookieLanguage = getLanguage();
    if (cookieLanguage) {
        return cookieLanguage;
    }
    const language = navigator.language.toLowerCase();
    const locales = Object.keys(messages);
    for (const locale of locales) {
        if (language.indexOf(locale) > -1) {
            return locale;
        }
    }
    return 'zh-cn';
};
export const i18n = createI18n({
    legacy:false,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false,
    locale: getLocale(), // 采用全局参数配置初始化语言 项目中有`zh-cn`、`en`、`ja`三种
    fallbackLocale: zhCnLocale.name,
    messages,
});
