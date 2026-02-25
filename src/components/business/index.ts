/**
 * Business 组件库
 *
 * @description 基于 antdv-next 和 lucide-vue-next 封装的数据展示与录入组件
 * 包含：
 * - TTable（表格）、TForm（表单）、TModal（对话框）、TDrawer（抽屉）、TIcon（图标选择器）
 * - TDataCard（统计卡片）、TStatusBadge（状态徽章）、TPageHeader（页面头部）
 * - TEmptyState（空状态）、TBatchActions（批量操作栏）
 *
 * @example
 * ```ts
 * import { TTable, TForm, TModal, TDrawer, TIcon, TDataCard, TStatusBadge } from '@/components/business'
 * ```
 */

// 导出 TBatchActions 组件及其类型
export { TBatchActions } from './TBatchActions'
export type {
  BatchAction,
  TBatchActionsEmits,
  TBatchActionsExpose,
  TBatchActionsProps,
} from './TBatchActions'

// 导出 TDataCard 组件及其类型
export { getColorConfig as getDataCardColorConfig, getSizeConfig as getDataCardSizeConfig, TDataCard } from './TDataCard'
export type {
  CardColor,
  CardSize,
  TDataCardEmits,
  TDataCardExpose,
  TDataCardProps,
  TrendConfig,
  TrendDirection,
} from './TDataCard'

// 导出 TDrawer 组件及其类型
export { getTDrawerThemeConfig, TDrawer, useTDrawerTheme } from './TDrawer'
export type {
  DrawerClassNamesType,
  DrawerPlacement,
  DrawerSchema,
  DrawerSize,
  DrawerStylesType,
  PushConfig,
  ResizableConfig,
  TDrawerEmits,
  TDrawerExpose,
  TDrawerProps,
} from './TDrawer'
// 导出 TEmptyState 组件及其类型
export { TEmptyState } from './TEmptyState'

export type {
  EmptyAction,
  EmptySize,
  EmptyType,
  TEmptyStateEmits,
  TEmptyStateExpose,
  TEmptyStateProps,
} from './TEmptyState'
// 导出 TForm 组件及其类型
export { TForm } from './TForm'
export type {
  AsyncOptionsLoader,
  FieldChangeInfo,
  FieldDependency,
  FieldTooltip,
  FieldWatch,
  FormActions,
  FormField,
  FormFieldType,
  FormInstance,
  FormLayout,
  FormMeta,
  FormMethods,
  FormOption,
  FormRule,
  FormSchema,
  FormSize,
  FormValidateError,
  FormValidateErrorInfo,
  FormVariant,
  GroupFieldConfig,
  LabelAlign,
  ListFieldConfig,
  ScrollToFirstErrorOptions,
  TFormEmits,
  TFormExpose,
  TFormProps,
  VirtualScrollConfig,
} from './TForm'

// 导出共享的颜色转换函数
export { oklchToHex as modalOklchToHex, oklchToHex } from './theme-shared'
// 导出共享的颜色转换函数（别名）
export { oklchToHex as drawerOklchToHex } from './theme-shared'

// 导出 TIcon 组件及其类型
export { DEFAULT_CATEGORIES, getAllIconNames, getCategoryName, ICON_CATEGORIES, TIcon, TIconPicker } from './TIcon'
export type {
  IconCategory,
  IconItem,
  TIconEmits,
  TIconExpose,
  TIconPickerEmits,
  TIconPickerProps,
  TIconProps,
} from './TIcon'

// 导出 TModal 组件及其类型
export { getTModalThemeConfig, TModal, useTModalTheme } from './TModal'
export type {
  ClosableType,
  FooterRenderParams,
  MaskType,
  ModalClassNamesType,
  ModalSchema,
  ModalStaticConfig,
  ModalStaticRef,
  ModalStylesType,
  MousePosition,
  TModalEmits,
  TModalExpose,
  TModalProps,
  UseModalReturn,
} from './TModal'

// 导出 TPageHeader 组件及其类型
export { TPageHeader } from './TPageHeader'
export type {
  BreadcrumbItem,
  PageAction,
  TPageHeaderEmits,
  TPageHeaderExpose,
  TPageHeaderProps,
} from './TPageHeader'

// 导出 TStatusBadge 组件及其类型
export { getSizeConfig as getStatusBadgeSizeConfig, getStatusColorConfig, getVariantConfig, TStatusBadge } from './TStatusBadge'
export type {
  BadgeSize,
  BadgeVariant,
  StatusConfig,
  StatusMap,
  StatusType,
  TStatusBadgeEmits,
  TStatusBadgeExpose,
  TStatusBadgeProps,
} from './TStatusBadge'

// 导出 TTable 组件及其类型
export { TTable } from './TTable'
export type {
  AlignType,
  ColumnFilter,
  ColumnSorter,
  ExpandableConfig,
  PaginationConfig,
  RowSelectionConfig,
  RowSelectionType,
  ScrollConfig,
  SummaryConfig,
  TableAction,
  TableCellSlotProps,
  TableColumn,
  TableFilters,
  TableFilterValue,
  TablePagination,
  TableRecord,
  TableSchema,
  TableSize,
  TableSlotProps,
  TableSorter,
  TableState,
  TTableEmits,
  TTableExpose,
  TTableProps,
} from './TTable'

// 导出 TTree 组件及其类型
export { TTree } from './TTree'
export type {
  FieldNamesConfig,
  TreeCheckEvent,
  TreeDragEvent,
  TreeExpandEvent,
  TreeNode,
  TreeNodeEvent,
  TreeSearchConfig,
  TreeSelectEvent,
  TreeStatisticsConfig,
  TreeToolbarConfig,
  TTreeEmits,
  TTreeExpose,
  TTreeProps,
} from './TTree'
