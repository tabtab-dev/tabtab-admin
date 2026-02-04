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
  type EnhancedFieldCondition as UseFieldConditionsEnhanced,
  type ConditionGroup as UseFieldConditionsGroup,
  type ConditionOperator as UseFieldConditionsOperator,
  type FieldGroupResult,
} from './composables'

// 导出子组件
export { SmartFormField, SmartFormGroup } from './components'
