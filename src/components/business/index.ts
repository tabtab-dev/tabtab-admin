/**
 * Business 组件库
 *
 * @description 基于 antdv-next 和 lucide-vue-next 封装的数据展示与录入组件
 * 包含：TTable（表格）、TForm（表单）、TModal（对话框）、TDrawer（抽屉）、TIcon（图标选择器）
 *
 * @example
 * ```ts
 * import { TTable, TForm, TModal, TDrawer, TIcon } from '@/components/business'
 * ```
 */

// 导出 TTable 组件及其类型
export { TTable } from './TTable'
export type {
  TableSchema,
  TableColumn,
  TableSize,
  AlignType,
  ColumnFilter,
  ColumnSorter,
  RowSelectionConfig,
  RowSelectionType,
  PaginationConfig,
  ScrollConfig,
  TableAction,
  TTableProps,
  TTableExpose,
  TTableEmits,
  TableState,
  TableRecord,
  TableSorter,
  TablePagination,
  TableFilters,
  TableFilterValue,
  ExpandableConfig,
  SummaryConfig
} from './TTable'

// 导出 TForm 组件及其类型
export { TForm } from './TForm'
export type {
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
  TFormProps,
  TFormExpose,
  TFormEmits,
  FormInstance,
  FormValidateError,
  FormValidateErrorInfo,
  FieldChangeInfo,
  FormVariant,
  ScrollToFirstErrorOptions,
  FieldTooltip,
  VirtualScrollConfig
} from './TForm'

// 导出 TModal 组件及其类型
export { TModal, useTModalTheme, getTModalThemeConfig, oklchToHex as modalOklchToHex } from './TModal'
export type {
  ModalSchema,
  TModalProps,
  TModalEmits,
  TModalExpose,
  ClosableType,
  MaskType,
  MousePosition,
  FooterRenderParams,
  ModalClassNamesType,
  ModalStylesType,
  ModalStaticConfig,
  ModalStaticRef,
  UseModalReturn
} from './TModal'

// 导出 TDrawer 组件及其类型
export { TDrawer, useTDrawerTheme, getTDrawerThemeConfig, oklchToHex as drawerOklchToHex } from './TDrawer'
export type {
  DrawerSchema,
  TDrawerProps,
  TDrawerEmits,
  TDrawerExpose,
  DrawerPlacement,
  DrawerSize,
  PushConfig,
  ResizableConfig,
  DrawerClassNamesType,
  DrawerStylesType
} from './TDrawer'

// 导出 TIcon 组件及其类型
export { TIcon, TIconPicker, ICON_CATEGORIES, DEFAULT_CATEGORIES, getCategoryName, getAllIconNames } from './TIcon'
export type {
  IconCategory,
  IconItem,
  TIconProps,
  TIconEmits,
  TIconExpose,
  TIconPickerProps,
  TIconPickerEmits,
} from './TIcon'
