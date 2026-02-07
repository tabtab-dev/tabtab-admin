/**
 * i18n 类型定义
 * 提供完整的翻译键类型推断和参数类型检查
 */

import type zhCN from './locales/zh-CN';

/**
 * 提取对象的所有键路径（支持嵌套）
 * 例如: { a: { b: 'value' } } => 'a' | 'a.b'
 */
type KeyPaths<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${KeyPaths<T[K]>}`
    : `${K}`
  : never;

/**
 * 根据键路径获取对应的值类型
 */
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * 提取翻译字符串中的插值参数
 * 例如: '共 {total} 条' => { total: string | number }
 */
type ExtractParams<T extends string> = T extends `${infer _Start}{${infer Param}}${infer Rest}`
  ? { [K in Param | keyof ExtractParams<Rest>]: string | number }
  : Record<string, never>;

/**
 * 翻译消息类型
 */
type MessageValue = string | Record<string, unknown>;

/**
 * 中文语言包类型（作为主类型源）
 */
export type ZhCNMessages = typeof zhCN;

/**
 * 所有可用的翻译键
 * 使用示例: t('common.confirm') 或 t('pages.dashboard.title')
 */
export type TranslationKeys = KeyPaths<ZhCNMessages>;

/**
 * 获取指定键的翻译值类型
 */
export type TranslationValue<K extends TranslationKeys> = PathValue<ZhCNMessages, K>;

/**
 * 获取指定键的参数类型（如果翻译字符串包含插值）
 */
export type TranslationParams<K extends TranslationKeys> = TranslationValue<K> extends string
  ? ExtractParams<TranslationValue<K>>
  : Record<string, never>;

/**
 * 翻译函数类型
 * 提供完整的类型推断：键补全、参数检查、返回值类型
 */
export type TypedT = {
  <K extends TranslationKeys>(
    key: K,
    ...args: TranslationParams<K> extends Record<string, never>
      ? [] // 无参数时不需要第二个参数
      : [params: TranslationParams<K>] // 有参数时必须传入
  ): TranslationValue<K> extends string ? string : string;
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
