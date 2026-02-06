/**
 * 排序顺序类型
 */
export type SortOrder = 'ascend' | 'descend' | null

/**
 * 表格尺寸类型
 * @description 表格的大小尺寸
 */
export type TableSize = 'small' | 'middle' | 'large'

/**
 * 表格记录类型
 * @description 表格行数据的通用类型
 */
export type TableRecord = Record<string, unknown>

/**
 * 表格排序结果
 * @description 排序变化时返回的结构
 */
export interface TableSorter {
  /** 排序字段 */
  field: string
  /** 排序方向 */
  order: SortOrder
  /** 列配置 */
  column: TableColumn
}

/**
 * 表格分页信息
 */
export interface TablePagination {
  /** 当前页码 */
  current: number
  /** 每页条数 */
  pageSize: number
  /** 总条数 */
  total: number
}

/**
 * 表格筛选值
 */
export type TableFilterValue = (string | number | boolean)[] | null

/**
 * 表格筛选信息
 */
export type TableFilters = Record<string, TableFilterValue>

/**
 * 行选择类型
 * @description 行选择的类型
 */
export type RowSelectionType = 'checkbox' | 'radio'

/**
 * 对齐方式
 * @description 单元格内容对齐方式
 */
export type AlignType = 'left' | 'center' | 'right'

/**
 * 筛选配置
 * @description 列筛选器的配置
 */
export interface ColumnFilter {
  /** 筛选文本 */
  text: string
  /** 筛选值 */
  value: string | number | boolean
  /** 子筛选项（用于级联筛选） */
  children?: ColumnFilter[]
}

/**
 * 排序配置
 * @description 列排序的配置
 */
export interface ColumnSorter {
  /** 是否支持多列排序 */
  multiple?: number
  /** 自定义排序函数 */
  compare?: (a: TableRecord, b: TableRecord) => number
}

/**
 * 表格列配置
 * @description 单个表格列的完整配置
 */
export interface TableColumn {
  /** 列的唯一标识 */
  key?: string
  /** 列标题 */
  title: string
  /** 数据字段名 */
  dataIndex?: string
  /** 列宽度 */
  width?: number | string
  /** 最小列宽 */
  minWidth?: number | string
  /** 列对齐方式 */
  align?: AlignType
  /** 是否固定列 */
  fixed?: 'left' | 'right' | boolean
  /** 是否允许排序 */
  sorter?: boolean | ColumnSorter | ((a: TableRecord, b: TableRecord) => number)
  /** 默认排序顺序 */
  defaultSortOrder?: SortOrder
  /** 排序优先级 */
  sortOrder?: SortOrder | false
  /** 支持的排序方式 */
  sortDirections?: SortOrder[]
  /** 是否显示排序提示 */
  showSorterTooltip?: boolean
  /** 筛选配置 */
  filters?: ColumnFilter[]
  /** 筛选模式 */
  filterMode?: 'menu' | 'tree'
  /** 是否多选筛选 */
  filterMultiple?: boolean
  /** 默认筛选值 */
  defaultFilteredValue?: string[]
  /** 受控筛选值 */
  filteredValue?: string[]
  /** 自定义筛选函数 */
  onFilter?: (value: string | number | boolean, record: TableRecord) => boolean
  /** 是否省略显示 */
  ellipsis?: boolean | { showTitle?: boolean; tooltip?: boolean }
  /** 是否可编辑 */
  editable?: boolean
  /** 自定义插槽名（用于自定义单元格内容） */
  slot?: string
  /** 自定义表头插槽名 */
  headerSlot?: string
  /** 透传给 antd 列的其他属性 */
  props?: Record<string, unknown>
  /** 自定义渲染函数 */
  customRender?: (params: { text: unknown; record: TableRecord; index: number; column: TableColumn }) => unknown
  /** 自定义表头渲染函数 */
  customHeaderRender?: (params: { title: unknown; column: TableColumn; index: number }) => unknown
  /** 列的类名 */
  className?: string
}

/**
 * 行选择配置
 * @description 表格行选择的配置
 */
export interface RowSelectionConfig {
  /** 选择类型 */
  type?: RowSelectionType
  /** 已选中的行 key */
  selectedRowKeys?: (string | number)[]
  /** 是否显示选择列 */
  show?: boolean
  /** 选择列的宽度 */
  columnWidth?: number | string
  /** 选择列的标题 */
  columnTitle?: string
  /** 是否固定选择列 */
  fixed?: 'left' | 'right' | boolean
  /** 是否隐藏全选框 */
  hideSelectAll?: boolean
  /** 自定义选择项 */
  selections?: Array<'SELECT_ALL' | 'SELECT_INVERT' | 'SELECT_NONE' | { key: string; text: string; onSelect: (changeableRowKeys: (string | number)[]) => void }>
  /** 是否允许选择该行的复选框 */
  getCheckboxProps?: (record: TableRecord) => { disabled?: boolean; indeterminate?: boolean }
  /** 
   * 父子节点选择是否严格独立
   * @description 设置为 true 时，父子节点的选择互不影响；设置为 false 时，选择父节点会自动选中所有子节点
   * @default false
   */
  checkStrictly?: boolean
}

/**
 * 分页配置
 * @description 表格分页的配置
 */
export interface PaginationConfig {
  /** 是否显示分页 */
  show?: boolean
  /** 当前页码 */
  current?: number
  /** 每页条数 */
  pageSize?: number
  /** 总数据条数 */
  total?: number
  /** 每页条数选项 */
  pageSizeOptions?: string[]
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean
  /** 是否显示总条数 */
  showTotal?: boolean | ((total: number, range: [number, number]) => string)
  /** 是否显示每页条数选择器 */
  showSizeChanger?: boolean
  /** 简单分页模式 */
  simple?: boolean
  /** 位置 */
  position?: 'top' | 'bottom' | 'both'
}

/**
 * 滚动配置
 * @description 表格滚动的配置
 */
export interface ScrollConfig {
  /** 横向滚动宽度 */
  x?: number | string | true
  /** 纵向滚动高度 */
  y?: number | string
  /** 滚动区域宽度 */
  scrollToFirstRowOnChange?: boolean
}

/**
 * 表格操作按钮配置
 * @description 表格操作列的按钮配置
 */
export interface TableAction {
  /** 按钮文本 */
  text: string
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'danger' | 'link'
  /** 点击事件 */
  onClick: (record: TableRecord, index: number) => void
  /** 是否显示（支持函数动态判断） */
  show?: boolean | ((record: TableRecord, index: number) => boolean)
  /** 是否禁用（支持函数动态判断） */
  disabled?: boolean | ((record: TableRecord, index: number) => boolean)
  /** 是否需要确认 */
  confirm?: boolean
  /** 确认提示文本 */
  confirmText?: string
  /** 按钮图标 */
  icon?: string
}

/**
 * 展开行配置
 */
export interface ExpandableConfig {
  /** 是否默认展开所有行 */
  defaultExpandAllRows?: boolean
  /** 默认展开的行 */
  defaultExpandedRowKeys?: (string | number)[]
  /** 展开的行（受控） */
  expandedRowKeys?: (string | number)[]
  /** 是否允许展开 */
  rowExpandable?: (record: TableRecord) => boolean
  /** 展开图标是否显示在单元格内 */
  expandIconColumnIndex?: number
  /** 自定义展开图标 */
  expandIcon?: (props: { expanded: boolean; onExpand: (expanded: boolean, record: TableRecord) => void; record: TableRecord; expandable: boolean }) => unknown
  /** 展开行插槽名 */
  expandedRowSlot?: string
  /** 展开行渲染函数 */
  expandedRowRender?: (record: TableRecord, index: number, indent: number, expanded: boolean) => unknown
}

/**
 * 汇总行配置
 */
export interface SummaryConfig {
  /** 汇总行插槽名 */
  slot?: string
  /** 汇总行渲染函数 */
  render?: (data: TableRecord[]) => unknown
}

/**
 * 表格 Schema 配置
 * @description 表格的整体配置结构
 */
export interface TableSchema {
  /** 表格列配置数组 */
  columns: TableColumn[]
  /** 表格尺寸 */
  size?: TableSize
  /** 是否显示边框 */
  bordered?: boolean
  /** 分页配置 */
  pagination?: PaginationConfig | false
  /** 行选择配置 */
  rowSelection?: RowSelectionConfig
  /** 滚动配置 */
  scroll?: ScrollConfig
  /** 是否加载中 */
  loading?: boolean
  /** 行 key 的取值字段 */
  rowKey?: string | ((record: TableRecord) => string | number)
  /** 表格标题 */
  title?: string | ((data: TableRecord[]) => unknown)
  /** 表格尾部 */
  footer?: string | ((data: TableRecord[]) => unknown)
  /** 是否显示表头 */
  showHeader?: boolean
  /** 表格布局 */
  tableLayout?: 'auto' | 'fixed'
  /** 是否支持虚拟列表 */
  virtual?: boolean
  /** 粘性表头配置 */
  sticky?: boolean | { offsetHeader?: number; offsetSummary?: number; offsetScroll?: number; getContainer?: () => HTMLElement }
  /** 展开行配置 */
  expandable?: ExpandableConfig
  /** 操作列配置 */
  actions?: TableAction[]
  /** 操作列宽度 */
  actionWidth?: number | string
  /** 操作列固定位置 */
  actionFixed?: 'left' | 'right'
  /** 操作列标题 */
  actionTitle?: string
  /** 空数据时的显示文本 */
  emptyText?: string
  /** 自定义空状态插槽名 */
  emptySlot?: string
  /** 汇总行配置 */
  summary?: SummaryConfig
  /**
   * 是否在标题旁显示总数徽章
   * @description 启用后会在表格标题旁边显示 "共 X 条" 样式的徽章
   * @default false
   */
  showTotalBadge?: boolean
  /**
   * 树形数据子节点字段名
   * @description 指定数据中作为子节点的字段名，默认为 'children'
   * @default 'children'
   */
  childrenColumnName?: string
  /**
   * 树形层级缩进宽度
   * @description 控制树形表格每一层级的缩进像素值
   * @default 15
   */
  indentSize?: number
}

/**
 * TTable 组件 Props
 */
export interface TTableProps {
  /** 表格 Schema 配置 */
  schema: TableSchema
  /** 表格数据（支持 v-model:data） */
  data?: TableRecord[]
  /** 加载状态 */
  loading?: boolean
}

/**
 * TTable 组件暴露的方法
 * @description 通过 ref 可以调用的方法
 */
export interface TTableExpose {
  /**
   * 获取当前选中的行数据
   */
  getSelectedRows: () => TableRecord[]
  /**
   * 获取当前选中的行 key
   */
  getSelectedRowKeys: () => (string | number)[]
  /**
   * 设置选中的行
   * @param selectedRowKeys - 选中的行 key 数组
   */
  setSelectedRows: (selectedRowKeys: (string | number)[]) => void
  /**
   * 清空选中
   */
  clearSelection: () => void
  /**
   * 获取 antd Table 实例
   */
  getTableInstance: () => TableInstance | undefined
  /**
   * 刷新表格数据
   */
  refresh: () => void
  /**
   * 获取当前分页信息
   */
  getPagination: () => TablePagination
  /**
   * 设置分页
   * @param pagination - 分页配置
   */
  setPagination: (pagination: Partial<TablePagination>) => void
  /**
   * 展开指定行
   * @param record - 行数据
   * @param expanded - 是否展开
   */
  expandRow: (record: TableRecord, expanded?: boolean) => void
  /**
   * 展开所有行
   */
  expandAllRows: () => void
  /**
   * 收起所有行
   */
  collapseAllRows: () => void
}

/**
 * TTable 组件事件
 */
export interface TTableEmits {
  /** 更新表格数据 */
  (e: 'update:data', value: TableRecord[]): void
  /** 分页、排序、筛选变化时触发 */
  (
    e: 'change',
    pagination: TablePagination,
    filters: TableFilters,
    sorter: TableSorter
  ): void
  /** 行选择变化时触发 */
  (e: 'selectChange', selectedRowKeys: (string | number)[], selectedRows: TableRecord[]): void
  /** 行点击时触发 */
  (e: 'rowClick', record: TableRecord, index: number, event: MouseEvent): void
  /** 行双击时触发 */
  (e: 'rowDblclick', record: TableRecord, index: number, event: MouseEvent): void
  /** 展开行变化时触发 */
  (e: 'expand', expanded: boolean, record: TableRecord): void
  /** 展开行变化时触发（更新 expandedRowKeys） */
  (e: 'update:expandedRowKeys', keys: (string | number)[]): void
}

/**
 * 表格状态
 * @description 内部使用的表格状态
 */
export interface TableState {
  /** 当前页码 */
  current: number
  /** 每页条数 */
  pageSize: number
  /** 总条数 */
  total: number
  /** 选中的行 key */
  selectedRowKeys: (string | number)[]
  /** 展开的行 key */
  expandedRowKeys: (string | number)[]
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: SortOrder
  /** 筛选条件 */
  filters: TableFilters
}

/**
 * 表格实例类型（基于 antd Table 实例）
 */
export interface TableInstance {
  /** 获取选中的行 */
  getSelectedRows: () => TableRecord[]
  /** 获取选中的行 key */
  getSelectedRowKeys: () => (string | number)[]
  /** 设置选中的行 */
  setSelectedRowKeys: (keys: (string | number)[]) => void
  /** 清空选中 */
  clearSelection: () => void
  /** 获取分页信息 */
  getPagination: () => TablePagination
  /** 设置分页 */
  setPagination: (pagination: Partial<TablePagination>) => void
  /** 展开行 */
  expandRow: (record: TableRecord, expanded?: boolean) => void
  /** 展开所有行 */
  expandAllRows: () => void
  /** 收起所有行 */
  collapseAllRows: () => void
}
