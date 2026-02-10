/**
 * Vue I18n 配置
 * 使用 Composition API 模式 (legacy: false)
 * 支持语言包懒加载
 */

import { createI18n } from 'vue-i18n';
import type { RouteLocationNormalized } from 'vue-router';
import {
  loadLocaleMessages,
  getBrowserLocale,
  isSupportedLocale,
  type SupportedLocale,
} from './locales';
import { STORAGE_KEYS } from '@/constants/common';

/**
 * 应用标题
 */
const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'TabTab Admin';

/**
 * 从本地存储加载语言设置
 * Pinia store 持久化为 JSON 格式: { "currentLocale": "zh-CN" }
 */
function loadLocaleFromStorage(): SupportedLocale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCALE);
    const parsed = stored ? JSON.parse(stored) : null;
    return parsed?.currentLocale && isSupportedLocale(parsed.currentLocale)
      ? parsed.currentLocale
      : null;
  } catch {
    return null;
  }
}

/**
 * 获取初始语言
 * 优先级: 本地存储 > 浏览器语言 > 默认中文
 */
function getInitialLocale(): SupportedLocale {
  return loadLocaleFromStorage() ?? getBrowserLocale();
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

  // 优先使用 titleKey，如果没有则使用 i18nKey
  const titleKey = to?.meta?.titleKey || to?.meta?.i18nKey;
  if (titleKey) {
    const pageTitle = t(titleKey as string);
    document.title = `${pageTitle} - ${APP_TITLE}`;
  } else {
    // 否则只显示应用标题
    document.title = APP_TITLE;
  }
}

/**
 * 创建 i18n 实例
 * 初始为空 messages，语言包将异步加载
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

  // 初始为空，语言包将异步加载
  messages: {},

  // 禁用警告（生产环境）
  missingWarn: false,
  fallbackWarn: false,

  // 允许在模板中使用 HTML
  warnHtmlMessage: false,
});

/**
 * 异步加载并设置语言包
 * @param locale 语言代码
 * @returns 是否加载成功
 */
export async function loadAndSetLocaleMessages(locale: SupportedLocale): Promise<boolean> {
  try {
    const messages = await loadLocaleMessages(locale);
    i18n.global.setLocaleMessage(locale, messages);
    return true;
  } catch (error) {
    console.error(`Failed to load locale messages for ${locale}:`, error);
    return false;
  }
}

/**
 * 获取当前语言
 */
export function getCurrentLocale(): SupportedLocale {
  return i18n.global.locale.value as SupportedLocale;
}

/**
 * 设置语言
 * @param locale 目标语言
 * @returns 是否设置成功
 */
export async function setLocale(locale: SupportedLocale): Promise<boolean> {
  if (!isSupportedLocale(locale)) {
    console.warn(`Unsupported locale: ${locale}`);
    return false;
  }

  const currentLocale = getCurrentLocale();

  // 如果语言相同，直接返回
  if (locale === currentLocale) {
    return true;
  }

  // 检查语言包是否已加载
  const messages = i18n.global.getLocaleMessage(locale);
  const isLoaded = messages && Object.keys(messages).length > 0;

  // 如果未加载，先异步加载
  if (!isLoaded) {
    const loaded = await loadAndSetLocaleMessages(locale);
    if (!loaded) {
      return false;
    }
  }

  // 更新当前语言
  i18n.global.locale.value = locale;

  // 更新 HTML lang 属性
  updateHtmlLang(locale);

  // 更新文档标题
  updateDocumentTitle();

  return true;
}

/**
 * 切换语言
 * @returns 切换后的语言代码，失败返回 null
 */
export async function toggleLocale(): Promise<SupportedLocale | null> {
  const current = getCurrentLocale();
  const newLocale: SupportedLocale = current === 'zh-CN' ? 'en-US' : 'zh-CN';
  const success = await setLocale(newLocale);
  return success ? newLocale : null;
}

/**
 * 初始化语言设置
 * 应用启动时调用，加载初始语言包
 * @returns 是否初始化成功
 */
export async function initI18n(): Promise<boolean> {
  const initialLocale = getInitialLocale();
  const success = await loadAndSetLocaleMessages(initialLocale);

  if (success) {
    updateHtmlLang(initialLocale);
    updateDocumentTitle();
  }

  return success;
}

/**
 * 导出类型
 */
export type { SupportedLocale, TranslationKeys } from './types';
export type { TypedT } from './types';
