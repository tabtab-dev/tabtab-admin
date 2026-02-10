/**
 * TModal 组件
 *
 * @description 基于 antdv-next 的对话框组件，样式与 shadcn-vue 主题对齐
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TModal } from '@/components/data/TModal'
 * import type { TModalExpose } from '@/components/data/TModal'
 *
 * const modalRef = ref<TModalExpose>()
 * const open = ref(false)
 *
 * const handleOk = () => {
 *   // 处理确认逻辑
 *   open.value = false
 * }
 * </script>
 *
 * <template>
 *   <TModal
 *     ref="modalRef"
 *     v-model:open="open"
 *     title="标题"
 *     @ok="handleOk"
 *   >
 *     <p>内容</p>
 *   </TModal>
 * </template>
 * ```
 *
 * @example
 * // 与 TForm 结合使用
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TModal, TForm } from '@/components/data'
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
 *   <TModal v-model:open="open" title="编辑" :footer="null">
 *     <TForm v-model="formData" :schema="schema" @submit="handleSubmit" />
 *   </TModal>
 * </template>
 * ```
 *
 * @example
 * // 与 TTable 结合使用
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TModal, TTable } from '@/components/data'
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
 *   <TModal v-model:open="open" title="选择用户" width="800">
 *     <TTable :schema="tableSchema" :data="userData" />
 *   </TModal>
 * </template>
 * ```
 *
 * @example
 * // 使用 ref 方法控制弹窗
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TModal } from '@/components/data/TModal'
 * import type { TModalExpose } from '@/components/data/TModal'
 *
 * const modalRef = ref<TModalExpose>()
 *
 * // 通过方法控制弹窗
 * const showModal = () => {
 *   modalRef.value?.open()
 * }
 *
 * const hideModal = () => {
 *   modalRef.value?.close()
 * }
 *
 * const setLoading = (loading: boolean) => {
 *   modalRef.value?.setConfirmLoading(loading)
 * }
 * </script>
 *
 * <template>
 *   <TModal ref="modalRef" title="标题">
 *     <p>内容</p>
 *   </TModal>
 * </template>
 * ```
 */

// 导出组件
export { default as TModal } from './TModal.vue'

// 导出主题配置
export { useTModalTheme, getTModalThemeConfig } from './theme'
// 从共享主题导出颜色转换函数
export { oklchToHex } from '../theme-shared'

// 导出类型
export type {
  // 核心类型
  ModalSchema,
  TModalProps,
  TModalEmits,
  TModalExpose,
  // 配置类型
  ClosableType,
  MaskType,
  MousePosition,
  FooterRenderParams,
  ModalClassNamesType,
  ModalStylesType,
  // 静态方法类型
  ModalStaticConfig,
  ModalStaticRef,
  UseModalReturn,
  // TForm 集成类型
  TFormExpose
} from './types'
