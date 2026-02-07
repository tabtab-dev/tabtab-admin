/**
 * 语言包聚合导出
 * 支持懒加载，按需加载语言包
 */

import type { SupportedLocale, LocaleMessages } from '../types';

/**
 * 支持的语言列表
 */
export const supportedLocales = ['zh-CN', 'en-US'] as const;

/**
 * 语言显示名称
 */
export const localeNames: Record<SupportedLocale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

/**
 * 语言包加载器映射
 * 使用动态导入实现懒加载
 */
const localeLoaders: Record<SupportedLocale, () => Promise<{ default: LocaleMessages }>> = {
  'zh-CN': () => import('./zh-CN'),
  'en-US': () => import('./en-US'),
};

/**
 * 加载指定语言包
 * @param locale 语言代码
 * @returns 语言包对象
 */
export async function loadLocaleMessages(locale: SupportedLocale): Promise<LocaleMessages> {
  const loader = localeLoaders[locale];
  if (!loader) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  const module = await loader();
  return module.default;
}

/**
 * 预加载语言包（可选优化）
 * 可以在应用空闲时预加载其他语言
 * @param locale 语言代码
 */
export function preloadLocaleMessages(locale: SupportedLocale): void {
  // 使用 requestIdleCallback 或 setTimeout 在空闲时预加载
  const preload = () => {
    loadLocaleMessages(locale).catch(() => {
      // 预加载失败不影响主流程
    });
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(preload, { timeout: 2000 });
  } else {
    setTimeout(preload, 1000);
  }
}

/**
 * antdv-next 语言包映射
 * 用于 ConfigProvider 的 locale 属性
 */
export const antdvLocaleLoaders: Record<SupportedLocale, () => Promise<unknown>> = {
  'zh-CN': () => import('antdv-next/locale/zh_CN').then(m => m.default),
  'en-US': () => import('antdv-next/locale/en_US').then(m => m.default),
};

/**
 * 获取 antdv-next 语言包
 * @param locale 语言代码
 * @returns antdv locale 对象
 */
export async function getAntdvLocale(locale: SupportedLocale): Promise<unknown> {
  const loader = antdvLocaleLoaders[locale] || antdvLocaleLoaders['en-US'];
  return loader();
}

/**
 * 获取浏览器默认语言
 */
export function getBrowserLocale(): SupportedLocale {
  const browserLang = navigator.language;

  // 检查是否支持浏览器的语言
  if (browserLang.startsWith('zh')) {
    return 'zh-CN';
  }

  // 默认返回英文
  return 'en-US';
}

/**
 * 验证语言是否支持
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

/**
 * 导出类型
 */
export type { SupportedLocale, LocaleMessages } from '../types';
