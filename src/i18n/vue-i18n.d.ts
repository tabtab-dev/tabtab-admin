/**
 * Vue I18n 模块类型扩展
 * 为 useI18n 和全局 $t 提供类型支持
 */

import type { Ref } from 'vue';
import type { TypedT, SupportedLocale } from './types';

declare module 'vue-i18n' {
  /**
   * 扩展 useI18n 返回类型
   */
  export interface Composer {
    t: TypedT;
    locale: Ref<SupportedLocale>;
  }

  /**
   * 扩展全局 $t 函数类型
   */
  export interface I18nOptions {
    messages?: Record<SupportedLocale, unknown>;
    locale?: SupportedLocale;
    fallbackLocale?: SupportedLocale;
  }
}

declare module '@vue/runtime-core' {
  /**
   * 扩展组件实例属性
   * 使 $t 在模板中有类型支持
   */
  interface ComponentCustomProperties {
    $t: TypedT;
    $i18n: {
      locale: SupportedLocale;
      setLocaleMessage: (locale: SupportedLocale, message: unknown) => void;
    };
  }
}

/**
 * 导出类型供外部使用
 */
export {};
