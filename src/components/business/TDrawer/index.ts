/**
 * TDrawer 组件
 *
 * @description 基于 antdv-next 的抽屉组件，样式与 shadcn-vue 主题对齐
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TDrawer } from '@/components/data/TDrawer'
 * import type { TDrawerExpose } from '@/components/data/TDrawer'
 *
 * const drawerRef = ref<TDrawerExpose>()
 * const open = ref(false)
 *
 * const handleClose = () => {
 *   open.value = false
 * }
 * </script>
 *
 * <template>
 *   <TDrawer
 *     ref="drawerRef"
 *     v-model:open="open"
 *     title="标题"
 *     @close="handleClose"
 *   >
 *     <p>内容</p>
 *   </TDrawer>
 * </template>
 * ```
 *
 * @example
 * // 与 TForm 结合使用
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TDrawer, TForm } from '@/components/data'
 * import type { FormSchema } from '@/components/data/TForm'
 *
 * const open = ref(false)
 * const formData = ref({})
 *
 * const schema: FormSchema = {
 *   fields: [
 *     { name: 'name', type: 'input', label: '姓名', rules: [{ required: true }] }
 *   ]
 * }
 *
 * const handleSubmit = (values: any) => {
 *   console.log('提交数据:', values)
 *   open.value = false
 * }
 * </script>
 *
 * <template>
 *   <TDrawer v-model:open="open" title="编辑" :footer="null">
 *     <TForm v-model="formData" :schema="schema" @submit="handleSubmit" />
 *   </TDrawer>
 * </template>
 * ```
 *
 * @example
 * // 与 TTable 结合使用
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TDrawer, TTable } from '@/components/data'
 * import type { TableSchema } from '@/components/data/TTable'
 *
 * const open = ref(false)
 *
 * const tableSchema: TableSchema = {
 *   columns: [
 *     { title: '姓名', dataIndex: 'name' },
 *     { title: '邮箱', dataIndex: 'email' }
 *   ]
 * }
 *
 * const userData = ref([
 *   { id: 1, name: '张三', email: 'zhangsan@example.com' },
 *   { id: 2, name: '李四', email: 'lisi@example.com' }
 * ])
 * </script>
 *
 * <template>
 *   <TDrawer v-model:open="open" title="选择用户" size="large">
 *     <TTable :schema="tableSchema" :data="userData" />
 *   </TDrawer>
 * </template>
 * ```
 *
 * @example
 * // 使用 ref 方法控制抽屉
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TDrawer } from '@/components/data/TDrawer'
 * import type { TDrawerExpose } from '@/components/data/TDrawer'
 *
 * const drawerRef = ref<TDrawerExpose>()
 *
 * // 通过方法控制抽屉
 * const showDrawer = () => {
 *   drawerRef.value?.open()
 * }
 *
 * const hideDrawer = () => {
 *   drawerRef.value?.close()
 * }
 * </script>
 *
 * <template>
 *   <TDrawer ref="drawerRef" title="标题">
 *     <p>内容</p>
 *   </TDrawer>
 * </template>
 * ```
 *
 * @example
 * // 不同方向的抽屉
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TDrawer } from '@/components/data/TDrawer'
 * import type { DrawerPlacement } from '@/components/data/TDrawer'
 *
 * const open = ref(false)
 * const placement = ref<DrawerPlacement>('right')
 *
 * const openDrawer = (p: DrawerPlacement) => {
 *   placement.value = p
 *   open.value = true
 * }
 * </script>
 *
 * <template>
 *   <div class="flex gap-2">
 *     <button @click="openDrawer('left')">左侧</button>
 *     <button @click="openDrawer('right')">右侧</button>
 *     <button @click="openDrawer('top')">顶部</button>
 *     <button @click="openDrawer('bottom')">底部</button>
 *   </div>
 *   <TDrawer v-model:open="open" title="标题" :placement="placement">
 *     <p>内容</p>
 *   </TDrawer>
 * </template>
 * ```
 */

// 导出组件
export { default as TDrawer } from './TDrawer.vue'

// 导出主题配置
export { useTDrawerTheme, getTDrawerThemeConfig } from './theme'
// 从共享主题导出颜色转换函数
export { oklchToHex } from '../theme-shared'

// 导出类型
export type {
  // 核心类型
  DrawerSchema,
  TDrawerProps,
  TDrawerEmits,
  TDrawerExpose,
  // 配置类型
  ClosableType,
  MaskType,
  DrawerPlacement,
  DrawerSize,
  PushConfig,
  ResizableConfig,
  DrawerClassNamesType,
  DrawerStylesType
} from './types'
