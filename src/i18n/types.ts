/**
 * i18n 类型定义
 * 提供翻译键类型推断
 */

import type zhCN from './locales/zh-CN';

/**
 * 中文语言包类型（作为主类型源）
 */
export type ZhCNMessages = typeof zhCN;

/**
 * 提取对象的所有键路径
 * 例如: { a: { b: 'value' } } => 'a' | 'a.b'
 */
type KeyPaths<T extends Record<string, unknown>, Prefix extends string = ''> = {
  [K in keyof T]: K extends string
    ? T[K] extends Record<string, unknown>
      ? `${Prefix}${K}` | `${Prefix}${K}.${KeyPaths<T[K], ''>}`
      : `${Prefix}${K}`
    : never;
}[keyof T];

/**
 * 所有可用的翻译键
 * 使用示例: t('common.confirm') 或 t('pages.dashboard.title')
 */
export type TranslationKeys = KeyPaths<ZhCNMessages>;

/**
 * 翻译函数类型
 * 提供键补全支持
 */
export type TypedT = {
  (key: TranslationKeys, params?: Record<string, string | number>): string;
};

/**
 * 支持的语言代码
 */
export type SupportedLocale = 'zh-CN' | 'en-US';

/**
 * 语言包结构类型
 */
export type LocaleMessages = ZhCNMessages;

/**
 * 语言配置项
 */
export interface LocaleConfig {
  value: SupportedLocale;
  label: string;
}

/**
 * 语言状态
 */
export interface LocaleState {
  currentLocale: SupportedLocale;
  isLoading: boolean;
  error: string | null;
}
