export { default as SmartForm } from './SmartForm.vue'
export type {
  FieldType,
  SelectOption,
  FieldCondition,
  FormFieldGroup,
  FormFieldConfig,
  SmartFormConfig,
  FormSubmitEvent,
  SmartFormExpose,
  EnhancedFieldCondition,
  ConditionGroup,
  ConditionOperator,
} from './types'

// 导出 composables
export {
  useFieldConditions,
  useFormChange,
  useFieldGroups,
  useFormValidation,
  type EnhancedFieldCondition as UseFieldConditionsEnhanced,
  type ConditionGroup as UseFieldConditionsGroup,
  type ConditionOperator as UseFieldConditionsOperator,
  type FieldGroupResult,
  type FormValidationError,
} from './composables'

// 导出子组件
export { SmartFormField, SmartFormGroup } from './components'

// 导出工具函数
export { zodToFieldConfig, createAutoFormConfig } from './utils'
