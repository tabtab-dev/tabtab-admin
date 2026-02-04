import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

/**
 * 操作菜单项
 */
export interface SmartTableAction<T = any> {
  /**
   * 操作项唯一标识
   */
  key: string
  /**
   * 显示文本
   */
  label: string
  /**
   * 图标组件
   */
  icon?: any
  /**
   * 是否显示
   */
  show?: (row: T) => boolean
  /**
   * 是否禁用
   */
  disabled?: (row: T) => boolean
  /**
   * 点击回调
   */
  onClick: (row: T, index: number) => void
  /**
   * 自定义样式类
   */
  class?: string
  /**
   * 是否危险操作（红色样式）
   */
  danger?: boolean
}

/**
 * 筛选配置
 */
export interface SmartTableFilter {
  /**
   * 筛选类型
   */
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange'
  /**
   * 筛选选项（用于 select 类型）
   */
  options?: { label: string; value: any }[]
  /**
   * 占位文本
   */
  placeholder?: string
  /**
   * 自定义筛选函数
   */
  filterFn?: (value: any, filterValue: any) => boolean
}

/**
 * 表格列配置
 */
export interface SmartTableColumn<T = any> extends Omit<ColumnDef<T, any>, 'accessorKey' | 'id'> {
  /**
   * 列唯一标识
   */
  key: string
  /**
   * 列标题
   */
  title?: string
  /**
   * 数据字段名
   */
  accessorKey?: keyof T | string
  /**
   * 列宽度
   */
  width?: string | number
  /**
   * 是否可排序
   */
  sortable?: boolean
  /**
   * 是否可筛选
   */
  filterable?: boolean
  /**
   * 筛选配置
   */
  filter?: SmartTableFilter
  /**
   * 列对齐方式
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 是否固定列
   */
  fixed?: 'left' | 'right'
  /**
   * 自定义单元格渲染
   */
  cell?: (props: { row: T; value: any; index: number }) => any
  /**
   * 自定义表头渲染
   */
  header?: () => any
}

/**
 * 分页配置
 */
export interface SmartTablePagination {
  /**
   * 当前页码
   */
  pageIndex: number
  /**
   * 每页条数
   */
  pageSize: number
  /**
   * 总条数
   */
  total?: number
  /**
   * 每页条数选项
   */
  pageSizeOptions?: number[]
  /**
   * 是否显示分页
   */
  show?: boolean
}

/**
 * 表格配置
 */
export interface SmartTableConfig<T = any> {
  /**
   * 表格数据
   */
  data: T[]
  /**
   * 列配置
   */
  columns: SmartTableColumn<T>[]
  /**
   * 分页配置
   */
  pagination?: SmartTablePagination
  /**
   * 是否显示序号列
   */
  showIndex?: boolean
  /**
   * 是否显示选择列
   */
  selectable?: boolean
  /**
   * 是否可展开行
   */
  expandable?: boolean
  /**
   * 是否加载中
   */
  loading?: boolean
  /**
   * 空数据提示文本
   */
  emptyText?: string
  /**
   * 是否启用行点击
   */
  rowClickable?: boolean
  /**
   * 行唯一键字段名
   */
  rowKey?: keyof T | string
  /**
   * 表格高度
   */
  height?: string | number
  /**
   * 是否启用斑马纹
   */
  stripe?: boolean
  /**
   * 是否显示边框
   */
  bordered?: boolean
  /**
   * 表格尺寸
   */
  size?: 'sm' | 'default' | 'lg'
  /**
   * 操作列配置
   */
  actions?: SmartTableAction<T>[]
  /**
   * 操作列宽度
   */
  actionColumnWidth?: number
  /**
   * 操作列标题
   */
  actionColumnTitle?: string
  /**
   * 是否固定操作列
   */
  actionColumnFixed?: 'left' | 'right'
  /**
   * 是否启用列宽调整
   */
  resizable?: boolean
  /**
   * 是否启用列显隐控制
   */
  columnVisibility?: boolean
  /**
   * 批量操作配置
   */
  batchActions?: SmartTableAction<T>[]
  /**
   * 是否固定表头
   */
  stickyHeader?: boolean
}

/**
 * 表格事件
 */
export interface SmartTableEmits {
  /**
   * 分页变化事件
   */
  (e: 'page-change', pagination: PaginationState): void
  /**
   * 排序变化事件
   */
  (e: 'sort-change', sorting: SortingState): void
  /**
   * 选择变化事件
   */
  (e: 'selection-change', selectedRows: any[]): void
  /**
   * 行点击事件
   */
  (e: 'row-click', row: any, index: number): void
  /**
   * 刷新事件
   */
  (e: 'refresh'): void
}

/**
 * 表格暴露的方法
 */
export interface SmartTableExpose {
  /**
   * 获取选中行数据
   */
  getSelectedRows: () => any[]
  /**
   * 清除选中
   */
  clearSelection: () => void
  /**
   * 设置选中行
   */
  setSelectedRows: (keys: string[]) => void
  /**
   * 获取当前分页状态
   */
  getPaginationState: () => PaginationState
  /**
   * 设置分页
   */
  setPageIndex: (index: number) => void
  /**
   * 设置每页条数
   */
  setPageSize: (size: number) => void
}

/**
 * 表格插槽
 */
export interface SmartTableSlots<T = any> {
  /**
   * 工具栏插槽
   */
  toolbar?: () => any
  /**
   * 工具栏右侧插槽
   */
  'toolbar-extra'?: () => any
  /**
   * 操作列插槽
   */
  actions?: (props: { row: T; index: number }) => any
  /**
   * 自定义空状态
   */
  empty?: () => any
  /**
   * 加载状态
   */
  loading?: () => any
  /**
   * 分页器前置内容
   */
  'pagination-prefix'?: () => any
  /**
   * 分页器后置内容
   */
  'pagination-suffix'?: () => any
  /**
   * 单元格插槽 - 动态列名
   * 例如：cell-name, cell-email
   */
  [key: `cell-${string}`]: (props: { row: T; value: any; index: number }) => any
  /**
   * 表头插槽 - 动态列名
   * 例如：header-name, header-email
   */
  [key: `header-${string}`]: (props: { column: any; title: any }) => any
  /**
   * 行展开内容插槽
   */
  expand?: (props: { row: T; index: number }) => any
}
