/**
 * TForm 组件
 *
 * @description 基于 antdv-next 的 JSON 配置化表单组件，样式与 shadcn-vue 主题对齐
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { TForm } from '@/components/data/TForm'
 * import type { FormSchema, TFormExpose } from '@/components/data/TForm'
 *
 * const formRef = ref<TFormExpose>()
 * const formData = ref({})
 *
 * const schema: FormSchema = {
 *   layout: 'horizontal',
 *   labelCol: { span: 6 },
 *   wrapperCol: { span: 18 },
 *   fields: [
 *     {
 *       name: 'name',
 *       type: 'input',
 *       label: '姓名',
 *       placeholder: '请输入姓名',
 *       rules: [{ required: true, message: '姓名不能为空' }]
 *     },
 *     {
 *       name: 'email',
 *       type: 'input',
 *       label: '邮箱',
 *       rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }]
 *     }
 *   ],
 *   actions: {
 *     submitText: '保存',
 *     resetText: '重置',
 *     showReset: true,
 *     align: 'right'
 *   }
 * }
 *
 * const handleSubmit = (values: any) => {
 *   console.log('提交数据:', values)
 * }
 * </script>
 *
 * <template>
 *   <TForm
 *     ref="formRef"
 *     v-model="formData"
 *     :schema="schema"
 *     @submit="handleSubmit"
 *   />
 * </template>
 * ```
 */

// 从共享主题导出颜色转换函数
export { oklchToHex } from '../theme-shared'
// 导出 composables
export {
  getFieldKey,
  useFieldState,
  useFormMeta,
  useFormWatch,
} from './composables'
// 导出组件
export { default as TForm } from './TForm.vue'
export { default as TFormGroup } from './TFormGroup.vue'

export { default as TFormItem } from './TFormItem.vue'

export { default as TFormList } from './TFormList.vue'
// 导出主题配置
export {
  getTFormThemeConfig,
  useTFormTheme,
} from './theme'

// 导出类型
export type {
  AsyncOptionsLoader,
  FieldChangeInfo,
  FieldDependency,
  FieldTooltip,
  FieldWatch,
  FormActions,
  FormField,
  FormFieldType,
  // 新增类型
  FormInstance,
  FormLayout,
  FormMeta,
  FormMethods,
  FormOption,
  FormRule,
  // 核心类型
  FormSchema,
  FormSize,
  FormValidateError,
  FormValidateErrorInfo,
  // antdv-next 新特性类型
  FormVariant,
  GroupFieldConfig,
  LabelAlign,
  ListFieldConfig,
  ScrollToFirstErrorOptions,
  TFormEmits,
  TFormExpose,
  // 组件类型
  TFormProps,
  VirtualScrollConfig,
} from './types'
