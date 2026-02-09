/**
 * Vue I18n 模块类型扩展
 * 为 useI18n 和全局 $t 提供类型支持
 */

import type { TypedT, SupportedLocale } from './types';

declare module 'vue-i18n' {
  /**
   * 扩展 Composer 接口的 t 方法
   */
  export interface Composer {
    t: TypedT;
  }
}

declare module '@vue/runtime-core' {
  /**
   * 扩展组件实例属性
   * 使 $t 在模板中有类型支持
   */
  interface ComponentCustomProperties {
    $t: TypedT;
  }
}

export {};
