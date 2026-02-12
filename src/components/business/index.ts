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
export { TModal, useTModalTheme, getTModalThemeConfig } from './TModal'
// 导出共享的颜色转换函数
export { oklchToHex, oklchToHex as modalOklchToHex } from './theme-shared'
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
export { TDrawer, useTDrawerTheme, getTDrawerThemeConfig } from './TDrawer'
// 导出共享的颜色转换函数（别名）
export { oklchToHex as drawerOklchToHex } from './theme-shared'
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

// 导出 TDataCard 组件及其类型
export { TDataCard, getColorConfig as getDataCardColorConfig, getSizeConfig as getDataCardSizeConfig } from './TDataCard'
export type {
  TrendDirection,
  CardColor,
  CardSize,
  TrendConfig,
  TDataCardProps,
  TDataCardEmits,
  TDataCardExpose
} from './TDataCard'

// 导出 TStatusBadge 组件及其类型
export { TStatusBadge, getStatusColorConfig, getVariantConfig, getSizeConfig as getStatusBadgeSizeConfig } from './TStatusBadge'
export type {
  BadgeSize,
  BadgeVariant,
  StatusType,
  StatusConfig,
  StatusMap,
  TStatusBadgeProps,
  TStatusBadgeEmits,
  TStatusBadgeExpose
} from './TStatusBadge'

// 导出 TPageHeader 组件及其类型
export { TPageHeader } from './TPageHeader'
export type {
  PageAction,
  BreadcrumbItem,
  TPageHeaderProps,
  TPageHeaderEmits,
  TPageHeaderExpose
} from './TPageHeader'

// 导出 TEmptyState 组件及其类型
export { TEmptyState } from './TEmptyState'
export type {
  EmptySize,
  EmptyType,
  EmptyAction,
  TEmptyStateProps,
  TEmptyStateEmits,
  TEmptyStateExpose
} from './TEmptyState'

// 导出 TBatchActions 组件及其类型
export { TBatchActions } from './TBatchActions'
export type {
  BatchAction,
  TBatchActionsProps,
  TBatchActionsEmits,
  TBatchActionsExpose
} from './TBatchActions'

// 导出 TTree 组件及其类型
export { TTree } from './TTree'
export type {
  TreeNode,
  FieldNamesConfig,
  TreeNodeEvent,
  TreeCheckEvent,
  TreeExpandEvent,
  TreeSelectEvent,
  TreeDragEvent,
  TreeToolbarConfig,
  TreeSearchConfig,
  TreeStatisticsConfig,
  TTreeProps,
  TTreeEmits,
  TTreeExpose
} from './TTree'
