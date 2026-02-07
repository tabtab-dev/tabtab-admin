/**
 * Store 统一导出
 * @description 统一导出所有 Store 和 Pinia 配置
 */

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

/**
 * 创建 Pinia 实例并配置持久化插件
 */
export function createStore() {
  const pinia = createPinia();
  
  // 使用持久化插件
  pinia.use(piniaPluginPersistedstate);
  
  return pinia;
}

export * from './global';
