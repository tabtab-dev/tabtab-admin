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

// 导出组件
export { default as TForm } from './TForm.vue'
export { default as TFormItem } from './TFormItem.vue'
export { default as TFormList } from './TFormList.vue'
export { default as TFormGroup } from './TFormGroup.vue'

// 导出 composables
export {
  useFieldState,
  useFormMeta,
  useFormWatch,
  getFieldKey
} from './composables'

// 导出主题配置
export {
  useTFormTheme,
  getTFormThemeConfig,
  oklchToHex
} from './theme'

// 导出类型
export type {
  // 核心类型
  FormSchema,
  FormField,
  FormFieldType,
  FormOption,
  FormRule,
  FieldDependency,
  FieldWatch,
  FormMethods,
  ListFieldConfig,
  GroupFieldConfig,
  FormActions,
  FormLayout,
  LabelAlign,
  FormSize,
  AsyncOptionsLoader,
  FormMeta,
  // 组件类型
  TFormProps,
  TFormExpose,
  TFormEmits
} from './types'
