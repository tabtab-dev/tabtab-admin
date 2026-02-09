/**
 * TIcon 组件
 *
 * @description 基于 lucide-vue-next 的图标选择器组件，支持图标浏览、搜索和选择
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TIcon } from '@/components/business/TIcon'
 * import type { TIconExpose } from '@/components/business/TIcon'
 *
 * const iconRef = ref<TIconExpose>()
 * const selectedIcon = ref('')
 *
 * // 通过 ref 调用组件方法
 * // iconRef.value?.open()
 * // iconRef.value?.clear()
 * </script>
 *
 * <template>
 *   <TIcon
 *     ref="iconRef"
 *     v-model="selectedIcon"
 *     placeholder="请选择图标"
 *     :show-clear="true"
 *     @change="(name) => console.log('选中图标:', name)"
 *     @clear="() => console.log('清空图标')"
 *   />
 * </template>
 * ```
 */

// 导出组件
export { default as TIcon } from './TIcon.vue'
export { default as TIconPicker } from './TIconPicker.vue'

// 导出常量
export {
  ICON_CATEGORIES,
  DEFAULT_CATEGORIES,
  getCategoryName,
  getAllIconNames,
} from './constants'

// 导出类型
export type {
  IconCategory,
  IconItem,
  TIconProps,
  TIconEmits,
  TIconExpose,
  TIconPickerProps,
  TIconPickerEmits,
} from './types'
