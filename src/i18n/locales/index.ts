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
 * antdv-next 语言包映射
 * 用于 ConfigProvider 的 locale 属性
 */
export const antdvLocales = {
  'zh-CN': () => import('antdv-next/locale/zh_CN').then(m => m.default),
  'en-US': () => import('antdv-next/locale/en_US').then(m => m.default),
};

/**
 * 获取 antdv-next 语言包
 * @param locale 语言代码
 * @returns antdv locale 对象
 */
export async function getAntdvLocale(locale: SupportedLocale) {
  const loader = antdvLocales[locale] || antdvLocales['en-US'];
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
