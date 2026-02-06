/**
 * 语言包聚合导出
 * 按语言分文件夹的专业组织方式
 */
import zhCN from './zh-CN';
import enUS from './en-US';

/**
 * 支持的语言列表
 */
export const supportedLocales = ['zh-CN', 'en-US'] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

/**
 * 语言显示名称
 */
export const localeNames: Record<SupportedLocale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

/**
 * 所有语言包
 */
export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

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
