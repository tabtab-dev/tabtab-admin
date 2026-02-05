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
  compare?: (a: any, b: any) => number
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
  sorter?: boolean | ColumnSorter | ((a: any, b: any) => number)
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
  onFilter?: (value: string | number | boolean, record: any) => boolean
  /** 是否省略显示 */
  ellipsis?: boolean | { showTitle?: boolean; tooltip?: boolean }
  /** 是否可编辑 */
  editable?: boolean
  /** 自定义插槽名（用于自定义单元格内容） */
  slot?: string
  /** 自定义表头插槽名 */
  headerSlot?: string
  /** 透传给 antd 列的其他属性 */
  props?: Record<string, any>
  /** 自定义渲染函数 */
  customRender?: (params: { text: any; record: any; index: number; column: TableColumn }) => any
  /** 自定义表头渲染函数 */
  customHeaderRender?: (params: { title: any; column: TableColumn; index: number }) => any
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
  getCheckboxProps?: (record: any) => { disabled?: boolean; indeterminate?: boolean }
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
  onClick: (record: any, index: number) => void
  /** 是否显示（支持函数动态判断） */
  show?: boolean | ((record: any, index: number) => boolean)
  /** 是否禁用（支持函数动态判断） */
  disabled?: boolean | ((record: any, index: number) => boolean)
  /** 是否需要确认 */
  confirm?: boolean
  /** 确认提示文本 */
  confirmText?: string
  /** 按钮图标 */
  icon?: string
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
  rowKey?: string | ((record: any) => string | number)
  /** 表格标题 */
  title?: string | ((data: any[]) => any)
  /** 表格尾部 */
  footer?: string | ((data: any[]) => any)
  /** 是否显示表头 */
  showHeader?: boolean
  /** 表格布局 */
  tableLayout?: 'auto' | 'fixed'
  /** 是否支持虚拟列表 */
  virtual?: boolean
  /** 粘性表头配置 */
  sticky?: boolean | { offsetHeader?: number; offsetSummary?: number; offsetScroll?: number; getContainer?: () => HTMLElement }
  /** 展开行配置 */
  expandable?: {
    /** 是否默认展开所有行 */
    defaultExpandAllRows?: boolean
    /** 默认展开的行 */
    defaultExpandedRowKeys?: (string | number)[]
    /** 展开的行（受控） */
    expandedRowKeys?: (string | number)[]
    /** 是否允许展开 */
    rowExpandable?: (record: any) => boolean
    /** 展开图标是否显示在单元格内 */
    expandIconColumnIndex?: number
    /** 自定义展开图标 */
    expandIcon?: (props: { expanded: boolean; onExpand: (expanded: boolean, record: any) => void; record: any; expandable: boolean }) => any
    /** 展开行插槽名 */
    expandedRowSlot?: string
    /** 展开行渲染函数 */
    expandedRowRender?: (record: any, index: number, indent: number, expanded: boolean) => any
  }
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
  summary?: {
    /** 汇总行插槽名 */
    slot?: string
    /** 汇总行渲染函数 */
    render?: (data: any[]) => any
  }
}

/**
 * TTable 组件 Props
 */
export interface TTableProps {
  /** 表格 Schema 配置 */
  schema: TableSchema
  /** 表格数据（支持 v-model:data） */
  data?: any[]
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
  getSelectedRows: () => any[]
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
  getTableInstance: () => any
  /**
   * 刷新表格数据
   */
  refresh: () => void
  /**
   * 获取当前分页信息
   */
  getPagination: () => { current: number; pageSize: number; total: number }
  /**
   * 设置分页
   * @param pagination - 分页配置
   */
  setPagination: (pagination: Partial<{ current: number; pageSize: number; total: number }>) => void
  /**
   * 展开指定行
   * @param record - 行数据
   * @param expanded - 是否展开
   */
  expandRow: (record: any, expanded?: boolean) => void
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
  (e: 'update:data', value: any[]): void
  /** 分页、排序、筛选变化时触发 */
  (
    e: 'change',
    pagination: { current: number; pageSize: number; total: number },
    filters: Record<string, (string | number | boolean)[] | null>,
    sorter: { field: string; order: SortOrder; column: TableColumn }
  ): void
  /** 行选择变化时触发 */
  (e: 'selectChange', selectedRowKeys: (string | number)[], selectedRows: any[]): void
  /** 行点击时触发 */
  (e: 'rowClick', record: any, index: number, event: MouseEvent): void
  /** 行双击时触发 */
  (e: 'rowDblclick', record: any, index: number, event: MouseEvent): void
  /** 展开行变化时触发 */
  (e: 'expand', expanded: boolean, record: any): void
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
  filters: Record<string, (string | number | boolean)[] | null>
}
