/**
 * Vue I18n 配置
 * 使用 Composition API 模式 (legacy: false)
 */
import { createI18n } from 'vue-i18n';
import type { RouteLocationNormalized } from 'vue-router';
import { messages, getBrowserLocale, isSupportedLocale, type SupportedLocale } from './locales';

/**
 * 本地存储键名
 */
const STORAGE_KEY = 'app-locale';

/**
 * 应用标题
 */
const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'TabTab Admin';

/**
 * 从本地存储加载语言设置
 */
function loadLocaleFromStorage(): SupportedLocale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isSupportedLocale(stored)) {
      return stored;
    }
  } catch {
    // 忽略存储错误
  }
  return null;
}

/**
 * 获取初始语言
 * 优先级: 本地存储 > 浏览器语言 > 默认中文
 */
function getInitialLocale(): SupportedLocale {
  return loadLocaleFromStorage() ?? getBrowserLocale();
}

/**
 * 保存语言设置到本地存储
 */
export function saveLocaleToStorage(locale: SupportedLocale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // 忽略存储错误
  }
}

/**
 * 更新 HTML lang 属性
 * @param locale 语言代码
 */
export function updateHtmlLang(locale: SupportedLocale): void {
  document.documentElement.setAttribute('lang', locale);
}

/**
 * 更新文档标题
 * @param to 目标路由
 */
export function updateDocumentTitle(to?: RouteLocationNormalized): void {
  const t = i18n.global.t;
  
  // 如果有传入路由，使用路由的 titleKey
  if (to?.meta?.titleKey) {
    const pageTitle = t(to.meta.titleKey as string);
    document.title = `${pageTitle} - ${APP_TITLE}`;
  } else {
    // 否则只显示应用标题
    document.title = APP_TITLE;
  }
}

/**
 * 创建 i18n 实例
 */
export const i18n = createI18n({
  // 使用 Composition API 模式
  legacy: false,
  
  // 全局注入 $t 等方法
  globalInjection: true,
  
  // 当前语言
  locale: getInitialLocale(),
  
  // 回退语言
  fallbackLocale: 'en-US',
  
  // 语言包
  messages,
  
  // 禁用警告（生产环境）
  missingWarn: false,
  fallbackWarn: false,
  
  // 允许在模板中使用 HTML
  warnHtmlMessage: false,
});

/**
 * 获取当前语言
 */
export function getCurrentLocale(): SupportedLocale {
  return i18n.global.locale.value as SupportedLocale;
}

/**
 * 设置语言
 */
export function setLocale(locale: SupportedLocale): void {
  if (isSupportedLocale(locale)) {
    i18n.global.locale.value = locale;
    saveLocaleToStorage(locale);
    
    // 更新 HTML lang 属性
    updateHtmlLang(locale);
    
    // 更新文档标题
    updateDocumentTitle();
  }
}

/**
 * 切换语言
 */
export function toggleLocale(): SupportedLocale {
  const current = getCurrentLocale();
  const newLocale: SupportedLocale = current === 'zh-CN' ? 'en-US' : 'zh-CN';
  setLocale(newLocale);
  return newLocale;
}

/**
 * 导出类型
 */
export type { SupportedLocale } from './locales';
