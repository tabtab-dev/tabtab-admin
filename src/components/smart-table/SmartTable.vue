<script setup lang="ts" generic="T extends Record<string, any>">
import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { computed, h, ref, watch, onUnmounted, nextTick } from 'vue'
import { ChevronDown, ChevronUp, MoreHorizontal, RefreshCw, ChevronLeft, ChevronRight, Filter, X, ChevronDown as ExpandIcon, Eye, Settings2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type {
  SmartTableAction,
  SmartTableColumn,
  SmartTableConfig,
  SmartTableExpose,
} from './types'
import FilterContent from './FilterContent.vue'

/**
 * 组件属性定义
 */
const props = withDefaults(defineProps<SmartTableConfig<T>>(), {
  pagination: () => ({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100],
    show: true,
    hideOnSinglePage: false,
  }),
  showIndex: false,
  selectable: false,
  expandable: false,
  loading: false,
  emptyText: '暂无数据',
  rowClickable: false,
  rowKey: 'id',
  stripe: true,
  bordered: true,
  size: 'default',
  actionColumnWidth: 100,
  actionColumnTitle: '操作',
  actionColumnFixed: 'right',
  resizable: false,
  columnVisibility: false,
  batchActions: () => [],
  stickyHeader: false,
})

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  (e: 'page-change', pagination: PaginationState): void
  (e: 'sort-change', sorting: SortingState): void
  (e: 'selection-change', selectedRows: T[]): void
  (e: 'row-click', row: T, index: number): void
  (e: 'refresh'): void
  (e: 'filter-change', filters: Record<string, any>): void
}>()

/**
 * 表格状态
 */
const sorting = ref<SortingState>([])
const rowSelection = ref<RowSelectionState>({})
const paginationState = ref<PaginationState>({
  pageIndex: Math.max(0, props.pagination.pageIndex - 1),
  pageSize: props.pagination.pageSize,
})

/**
 * 筛选状态
 */
const filters = ref<Record<string, any>>({})

/**
 * 筛选 Popover 打开状态
 */
const filterPopoverOpen = ref<Record<string, boolean>>({})

/**
 * 关闭筛选 Popover
 */
function closeFilterPopover(columnId: string) {
  filterPopoverOpen.value[columnId] = false
}

/**
 * 是否有激活的筛选
 */
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== undefined && value !== '' && value !== null)
})

/**
 * 展开的行
 */
const expandedRows = ref<Set<string>>(new Set())

/**
 * 切换行展开状态
 */
function toggleRowExpand(rowId: string) {
  const newSet = new Set(expandedRows.value)
  if (newSet.has(rowId)) {
    newSet.delete(rowId)
  } else {
    newSet.add(rowId)
  }
  expandedRows.value = newSet
}

/**
 * 是否展开
 */
function isRowExpanded(rowId: string): boolean {
  return expandedRows.value.has(rowId)
}

/**
 * 列宽调整状态
 */
const columnSizes = ref<Record<string, number>>({})
const isResizing = ref(false)
const resizingColumn = ref<string | null>(null)
const startX = ref(0)
const startWidth = ref(0)

/**
 * 列显隐状态
 */
const columnVisibility = ref<Record<string, boolean>>({})

/**
 * 初始化列显隐状态
 */
function initColumnVisibility() {
  const newVisibility: Record<string, boolean> = { ...columnVisibility.value }
  props.columns.forEach(col => {
    if (newVisibility[col.key] === undefined) {
      newVisibility[col.key] = true
    }
  })
  columnVisibility.value = newVisibility
}

/**
 * 切换列显隐
 */
function toggleColumnVisibility(columnKey: string) {
  columnVisibility.value = {
    ...columnVisibility.value,
    [columnKey]: !columnVisibility.value[columnKey],
  }
}

/**
 * 获取可见列
 */
const visibleColumns = computed(() => {
  return props.columns.filter(col => columnVisibility.value[col.key] !== false)
})

// 初始化列显隐
initColumnVisibility()

/**
 * 开始调整列宽
 */
function startResize(columnId: string, event: MouseEvent) {
  if (!props.resizable) return
  
  isResizing.value = true
  resizingColumn.value = columnId
  startX.value = event.clientX
  
  const header = table.getHeaderGroups()[0]?.headers.find(h => h.column.id === columnId)
  if (header) {
    startWidth.value = header.getSize()
  }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

/**
 * 处理列宽调整
 */
function handleResize(event: MouseEvent) {
  if (!isResizing.value || !resizingColumn.value) return

  const delta = event.clientX - startX.value
  const newWidth = Math.max(50, startWidth.value + delta)

  columnSizes.value = {
    ...columnSizes.value,
    [resizingColumn.value]: newWidth,
  }
}

/**
 * 停止调整列宽
 */
function stopResize() {
  isResizing.value = false
  resizingColumn.value = null
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

/**
 * 组件卸载时清理事件监听器
 */
onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})

/**
 * 监听分页配置变化
 */
watch(
  () => ({
    pageIndex: props.pagination.pageIndex,
    pageSize: props.pagination.pageSize,
  }),
  (newPagination) => {
    paginationState.value = {
      pageIndex: Math.max(0, newPagination.pageIndex - 1),
      pageSize: newPagination.pageSize,
    }
  }
)

/**
 * 监听列定义变化，更新表格
 */
watch(
  tableColumns,
  (newColumns) => {
    nextTick(() => {
      table.setOptions({
        columns: newColumns,
      })
    })
  },
  { deep: true }
)

/**
 * 处理筛选变化
 */
function handleFilterChange(columnKey: string, value: any) {
  const newFilters = { ...filters.value }
  if (value === '' || value === null || value === undefined) {
    delete newFilters[columnKey]
  } else {
    newFilters[columnKey] = value
  }
  filters.value = newFilters
  // 重置到第一页
  paginationState.value.pageIndex = 0
  emit('filter-change', filters.value)
}

/**
 * 清除所有筛选
 */
function clearAllFilters() {
  filters.value = {}
  paginationState.value.pageIndex = 0
  emit('filter-change', filters.value)
}

/**
 * 获取列的筛选配置
 */
function getColumnFilter(columnId: string): SmartTableColumn<T> | undefined {
  return props.columns.find(col => col.key === columnId && col.filter)
}

/**
 * 获取左侧固定列的 sticky 位置
 */
function getStickyLeft(header: any): number {
  const headers = table.getHeaderGroups()[0]?.headers || []
  const currentIndex = headers.findIndex((h: any) => h.id === header.id)
  let left = 0
  for (let i = 0; i < currentIndex; i++) {
    const h = headers[i]
    if ((h.column.columnDef.meta as any)?.fixed === 'left') {
      left += h.getSize()
    }
  }
  return left
}

/**
 * 获取右侧固定列的 sticky 位置
 */
function getStickyRight(header: any): number {
  const headers = table.getHeaderGroups()[0]?.headers || []
  const currentIndex = headers.findIndex((h: any) => h.id === header.id)
  let right = 0
  for (let i = headers.length - 1; i > currentIndex; i--) {
    const h = headers[i]
    if ((h.column.columnDef.meta as any)?.fixed === 'right') {
      right += h.getSize()
    }
  }
  return right
}

/**
 * 获取左侧固定单元格的 sticky 位置
 */
function getStickyLeftCell(cell: any): number {
  const cells = cell.row.getVisibleCells()
  const currentIndex = cells.findIndex((c: any) => c.column.id === cell.column.id)
  let left = 0
  for (let i = 0; i < currentIndex; i++) {
    const c = cells[i]
    if ((c.column.columnDef.meta as any)?.fixed === 'left') {
      left += c.column.getSize()
    }
  }
  return left
}

/**
 * 获取右侧固定单元格的 sticky 位置
 */
function getStickyRightCell(cell: any): number {
  const cells = cell.row.getVisibleCells()
  const currentIndex = cells.findIndex((c: any) => c.column.id === cell.column.id)
  let right = 0
  for (let i = cells.length - 1; i > currentIndex; i--) {
    const c = cells[i]
    if ((c.column.columnDef.meta as any)?.fixed === 'right') {
      right += c.column.getSize()
    }
  }
  return right
}

/**
 * 渲染操作列
 */
function renderActionsCell(row: T, index: number) {
  const actions = props.actions || []
  const visibleActions = actions.filter(action => 
    action.show ? action.show(row) : true
  )

  if (visibleActions.length === 0) {
    return null
  }

  // 如果只有一个操作，直接显示按钮
  if (visibleActions.length === 1) {
    const action = visibleActions[0]
    const isDisabled = action.disabled ? action.disabled(row) : false
    return h(Button, {
      variant: 'ghost',
      size: 'sm',
      disabled: isDisabled,
      class: [
        action.danger && !isDisabled ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : '',
        action.class || '',
      ],
      onClick: (e: Event) => {
        e.stopPropagation()
        if (!isDisabled) {
          action.onClick(row, index)
        }
      },
    }, () => [
      action.icon ? h(action.icon, { class: 'h-4 w-4 mr-1' }) : null,
      action.label,
    ])
  }

  // 多个操作显示下拉菜单
  return h(DropdownMenu, {}, {
    default: () => [
      h(DropdownMenuTrigger, {
        asChild: true,
      }, () => h(Button, {
        variant: 'ghost',
        size: 'icon',
        class: 'h-8 w-8',
        onClick: (e: Event) => e.stopPropagation(),
      }, () => h(MoreHorizontal, { class: 'h-4 w-4' }))),
      h(DropdownMenuContent, {
        align: 'end',
      }, () => visibleActions.map((action, i) => {
        const isDisabled = action.disabled ? action.disabled(row) : false
        const isLast = i === visibleActions.length - 1
        
        return [
          h(DropdownMenuItem, {
            disabled: isDisabled,
            class: [
              'cursor-pointer',
              action.danger ? 'text-red-600 focus:text-red-700 focus:bg-red-50' : '',
              action.class || '',
            ],
            onClick: (e: Event) => {
              e.stopPropagation()
              if (!isDisabled) {
                action.onClick(row, index)
              }
            },
          }, () => [
            action.icon ? h(action.icon, { class: 'h-4 w-4 mr-2' }) : null,
            action.label,
          ]),
          isLast ? null : h(DropdownMenuSeparator),
        ]
      }).flat()),
    ],
  })
}

/**
 * 转换列配置为 TanStack Table 格式
 */
const tableColumns = computed<ColumnDef<T>[]>(() => {
  const columns: ColumnDef<T>[] = []

  // 展开列
  if (props.expandable) {
    columns.push({
      id: 'expand',
      header: '',
      cell: ({ row }) => h(Button, {
        variant: 'ghost',
        size: 'icon',
        class: 'h-8 w-8 transition-transform',
        style: { transform: isRowExpanded(row.id) ? 'rotate(180deg)' : 'rotate(0deg)' },
        onClick: (e: Event) => {
          e.stopPropagation()
          toggleRowExpand(row.id)
        },
      }, () => h(ExpandIcon, { class: 'h-4 w-4' })),
      enableSorting: false,
      enableHiding: false,
      size: 48,
    })
  }

  // 选择列
  if (props.selectable) {
    columns.push({
      id: 'select',
      header: ({ table }) => {
        return h(Checkbox, {
          checked: table.getIsAllPageRowsSelected(),
          'onUpdate:checked': (checked: boolean) => {
            table.toggleAllPageRowsSelected(checked)
          },
        })
      },
      cell: ({ row }) => h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (checked: boolean) => {
          row.toggleSelected(checked)
        },
      }),
      enableSorting: false,
      enableHiding: false,
      size: 48,
    })
  }

  // 序号列
  if (props.showIndex) {
    columns.push({
      id: 'index',
      header: '序号',
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex
        const pageSize = table.getState().pagination.pageSize
        return pageIndex * pageSize + row.index + 1
      },
      enableSorting: false,
      size: 60,
    })
  }

  // 数据列
  visibleColumns.value.forEach((col) => {
    const columnDef: ColumnDef<T> = {
      id: col.key,
      accessorKey: col.accessorKey as string,
      header: col.header
        ? col.header
        : () => col.title || (col.accessorKey as string),
      cell: col.cell
        ? (cellProps) => col.cell!({ row: cellProps.row.original, value: cellProps.getValue(), index: cellProps.row.index })
        : (cellProps) => cellProps.getValue(),
      enableSorting: col.sortable ?? false,
      size: columnSizes.value[col.key] || (col.width as number) || 150,
      meta: {
        align: col.align || 'left',
        resizable: props.resizable,
        fixed: col.fixed,
      },
    }
    columns.push(columnDef)
  })

  // 操作列
  if (props.actions && props.actions.length > 0) {
    // 计算操作列宽度：根据可见操作按钮数量动态计算
    const actionColumnWidth = computed(() => {
      const visibleActions = props.actions!.filter(action => {
        if (action.show) {
          // 使用第一条数据作为参考来估算宽度
          const firstRow = props.data[0]
          if (firstRow) {
            return action.show(firstRow)
          }
        }
        return true
      })
      // 基础宽度 + 每个按钮的宽度
      // 单个按钮约 60px，多个按钮时每个约 40px
      if (visibleActions.length === 1) {
        return Math.max(props.actionColumnWidth, 80)
      }
      return Math.max(props.actionColumnWidth, visibleActions.length * 40 + 20)
    })

    columns.push({
      id: 'actions',
      header: props.actionColumnTitle,
      cell: ({ row }) => renderActionsCell(row.original, row.index),
      enableSorting: false,
      size: actionColumnWidth.value,
      meta: {
        align: 'center',
      },
    })
  }

  return columns
})

/**
 * 创建表格实例
 */
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return tableColumns.value
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    emit('sort-change', sorting.value)
  },
  onRowSelectionChange: (updater) => {
    rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original)
    emit('selection-change', selectedRows)
  },
  onPaginationChange: (updater) => {
    paginationState.value = typeof updater === 'function' ? updater(paginationState.value) : updater
    emit('page-change', paginationState.value)
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get pagination() {
      return paginationState.value
    },
  },
  manualPagination: true,
  manualSorting: true,
  enableRowSelection: props.selectable,
  enableMultiRowSelection: props.selectable,
  getRowId: (row) => {
    const key = props.rowKey as string
    return String(row[key] ?? Math.random().toString(36).substr(2, 9))
  },
})

/**
 * 监听列定义变化，更新表格
 */
watch(
  tableColumns,
  (newColumns) => {
    table.setOptions({
      columns: newColumns,
    })
  },
  { deep: true }
)

/**
 * 计算总页数
 */
const pageCount = computed(() => {
  if (!props.pagination.total) return 1
  return Math.ceil(props.pagination.total / paginationState.value.pageSize)
})

/**
 * 计算显示的页码范围
 */
const visiblePages = computed(() => {
  const current = paginationState.value.pageIndex + 1
  const total = pageCount.value
  const pages: (number | string)[] = []

  if (total <= 1) return pages

  const delta = 2
  const range: number[] = []

  // 计算中间显示的页码范围
  const startPage = Math.max(2, current - delta)
  const endPage = Math.min(total - 1, current + delta)

  for (let i = startPage; i <= endPage; i++) {
    range.push(i)
  }

  // 添加第一页
  pages.push(1)

  // 添加前省略号
  if (startPage > 2) {
    pages.push('...')
  } else if (startPage === 2) {
    pages.push(2)
  }

  // 添加中间页码（排除已经添加的）
  for (const page of range) {
    if (page > 2 && page < total) {
      pages.push(page)
    }
  }

  // 添加后省略号
  if (endPage < total - 1) {
    pages.push('...')
  } else if (endPage === total - 1 && total > 2) {
    pages.push(total - 1)
  }

  // 添加最后一页
  if (total > 1) {
    pages.push(total)
  }

  return pages
})

/**
 * 处理行点击
 */
function handleRowClick(row: T, index: number) {
  if (props.rowClickable) {
    emit('row-click', row, index)
  }
}

/**
 * 处理刷新
 */
function handleRefresh() {
  emit('refresh')
}

/**
 * 处理每页条数变化
 */
function handlePageSizeChange(size: string) {
  paginationState.value.pageSize = parseInt(size)
  paginationState.value.pageIndex = 0
  emit('page-change', paginationState.value)
}

/**
 * 跳转到指定页
 */
function goToPage(page: number) {
  if (page < 1 || page > pageCount.value) return
  paginationState.value.pageIndex = page - 1
  emit('page-change', paginationState.value)
}

/**
 * 跳转页输入
 */
const jumpPage = ref('')

/**
 * 处理跳转页
 */
function handleJumpPage() {
  const page = parseInt(jumpPage.value)
  if (page && page >= 1 && page <= pageCount.value) {
    goToPage(page)
    jumpPage.value = ''
  }
}

/**
 * 容器样式
 */
const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  if (props.stickyHeader) {
    style.maxHeight = style.height || '400px'
    style.height = 'auto'
  }
  return style
})

/**
 * 暴露方法
 */
defineExpose<SmartTableExpose>({
  getSelectedRows: () => table.getSelectedRowModel().rows.map((row) => row.original),
  clearSelection: () => table.resetRowSelection(),
  setSelectedRows: (keys: string[]) => {
    const selection: RowSelectionState = {}
    keys.forEach((key) => {
      const row = table.getRow(key)
      if (row) {
        selection[key] = true
      }
    })
    rowSelection.value = selection
  },
  getPaginationState: () => paginationState.value,
  setPageIndex: (index: number) => {
    paginationState.value.pageIndex = index
    emit('page-change', paginationState.value)
  },
  setPageSize: (size: number) => {
    paginationState.value.pageSize = size
    emit('page-change', paginationState.value)
  },
})
</script>

<template>
  <div class="smart-table flex flex-col gap-4">
    <!-- 批量操作栏 -->
    <div
      v-if="selectable && table.getSelectedRowModel().rows.length > 0 && batchActions.length > 0"
      class="flex items-center justify-between py-2 px-4 bg-primary/5 rounded-lg border border-primary/20"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">
          已选择 {{ table.getSelectedRowModel().rows.length }} 项
        </span>
      </div>
      <div class="flex items-center gap-2">
        <Button
          v-for="action in batchActions"
          :key="action.key"
          size="sm"
          :variant="action.danger ? 'destructive' : 'default'"
          :disabled="action.batchDisabled ? action.batchDisabled(table.getSelectedRowModel().rows.map(r => r.original)) : false"
          @click="action.onClick(table.getSelectedRowModel().rows.map(r => r.original), -1)"
        >
          <component :is="action.icon" v-if="action.icon" class="h-4 w-4 mr-1" />
          {{ action.label }}
        </Button>
        <Button variant="ghost" size="sm" @click="table.resetRowSelection()">
          取消选择
        </Button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div v-if="$slots.toolbar || $slots['toolbar-extra'] || hasActiveFilters" class="flex items-center justify-between py-2">
      <div class="flex items-center gap-2">
        <slot name="toolbar" />
        <!-- 清除筛选按钮 -->
        <Button
          v-if="hasActiveFilters"
          variant="ghost"
          size="sm"
          @click="clearAllFilters"
        >
          <X class="h-4 w-4 mr-1" />
          清除筛选
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <!-- 列显隐控制 -->
        <DropdownMenu v-if="columnVisibility">
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon" class="h-9 w-9">
              <Settings2 class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-40">
            <DropdownMenuLabel>显示列</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              v-for="col in props.columns"
              :key="col.key"
              :checked="columnVisibility[col.key]"
              @select="(e) => { e.preventDefault(); toggleColumnVisibility(col.key) }"
            >
              {{ col.title || col.key }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="icon"
          :disabled="loading"
          @click="handleRefresh"
          class="h-9 w-9"
        >
          <RefreshCw :class="['h-4 w-4', { 'animate-spin': loading }]" />
        </Button>
        <slot name="toolbar-extra" />
      </div>
    </div>

    <!-- 表格容器 -->
    <div
      class="relative rounded-lg border bg-card"
      :class="{ 'overflow-auto': height || stickyHeader }"
      :style="containerStyle"
    >
      <!-- 加载遮罩 -->
      <div
        v-if="loading"
        class="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <slot name="loading">
          <div class="flex items-center gap-3 px-4 py-3 bg-background rounded-lg shadow-lg border">
            <RefreshCw class="h-5 w-5 animate-spin text-primary" />
            <span class="text-sm text-muted-foreground">加载中...</span>
          </div>
        </slot>
      </div>

      <Table :class="[{ 'border-collapse': bordered }]">
        <TableHeader :class="['bg-muted/50', stickyHeader && 'sticky top-0 z-10']">
          <TableRow class="hover:bg-transparent border-b">
            <TableHead
              v-for="header in table.getHeaderGroups()[0]?.headers"
              :key="header.id"
              :style="{
                width: header.getSize() ? `${header.getSize()}px` : undefined,
                position: (header.column.columnDef.meta as any)?.fixed ? 'sticky' : undefined,
                left: (header.column.columnDef.meta as any)?.fixed === 'left' ? `${getStickyLeft(header)}px` : undefined,
                right: (header.column.columnDef.meta as any)?.fixed === 'right' ? `${getStickyRight(header)}px` : undefined,
                zIndex: (header.column.columnDef.meta as any)?.fixed ? 20 : undefined,
              }"
              :class="[
                'h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground relative',
                header.column.getCanSort() ? 'cursor-pointer select-none hover:text-foreground' : '',
                (header.column.columnDef.meta as any)?.align === 'center' && 'text-center',
                (header.column.columnDef.meta as any)?.align === 'right' && 'text-right',
                isResizing && resizingColumn === header.column.id && 'bg-muted',
                (header.column.columnDef.meta as any)?.fixed && 'bg-muted/80 backdrop-blur-sm',
              ]"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center gap-1.5" :class="[
                (header.column.columnDef.meta as any)?.align === 'center' && 'justify-center',
                (header.column.columnDef.meta as any)?.align === 'right' && 'justify-end',
              ]">
                <!-- 优先使用表头插槽渲染 -->
                <slot
                  :name="`header-${header.column.id}`"
                  :column="header.column"
                  :title="header.column.columnDef.header"
                >
                  <!-- 其次使用 header 函数渲染 -->
                  <FlexRender
                    v-if="!header.isPlaceholder && header.column.columnDef.header"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <!-- 默认渲染 -->
                  <template v-else>
                    {{ header.column.columnDef.header }}
                  </template>
                </slot>
                <template v-if="header.column.getIsSorted() === 'asc'">
                  <ChevronUp class="h-3.5 w-3.5 text-primary" />
                </template>
                <template v-else-if="header.column.getIsSorted() === 'desc'">
                  <ChevronDown class="h-3.5 w-3.5 text-primary" />
                </template>
                <!-- 筛选按钮 -->
                <Popover v-if="getColumnFilter(header.column.id)" v-model:open="filterPopoverOpen[header.column.id]">
                  <PopoverTrigger as-child @click.stop>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-5 w-5 ml-1"
                      :class="{ 'text-primary': filters[header.column.id] }"
                    >
                      <Filter class="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="p-0 w-auto" align="start">
                    <FilterContent
                      :column="getColumnFilter(header.column.id)!"
                      v-model:filters="filters"
                      @filter-change="handleFilterChange"
                      @close="closeFilterPopover(header.column.id)"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <!-- 列宽调整手柄 -->
              <div
                v-if="resizable && !['select', 'expand', 'index', 'actions'].includes(header.column.id)"
                class="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors"
                :class="{ 'bg-primary': isResizing && resizingColumn === header.column.id }"
                @mousedown.stop="startResize(header.column.id, $event)"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="(row, index) in table.getRowModel().rows" :key="`${row.id}-${index}`">
              <TableRow
                :data-state="row.getIsSelected() && 'selected'"
                :class="[
                  'transition-colors border-b',
                  rowClickable && 'cursor-pointer hover:bg-muted/60',
                  stripe && index % 2 === 1 && 'bg-muted/20',
                  row.getIsSelected() && 'bg-primary/5 hover:bg-primary/10',
                  isRowExpanded(row.id) && 'border-b-0',
                ]"
                @click="handleRowClick(row.original, index)"
              >
                <TableCell
                  v-for="(cell, cellIndex) in row.getVisibleCells()"
                  :key="`${row.id}-${cell.column.id}-${cellIndex}`"
                  :style="{
                    position: (cell.column.columnDef.meta as any)?.fixed ? 'sticky' : undefined,
                    left: (cell.column.columnDef.meta as any)?.fixed === 'left' ? `${getStickyLeftCell(cell)}px` : undefined,
                    right: (cell.column.columnDef.meta as any)?.fixed === 'right' ? `${getStickyRightCell(cell)}px` : undefined,
                    zIndex: (cell.column.columnDef.meta as any)?.fixed ? 10 : undefined,
                  }"
                  :class="[
                    'py-3 px-4 text-sm',
                    (cell.column.columnDef.meta as any)?.align === 'center' && 'text-center',
                    (cell.column.columnDef.meta as any)?.align === 'right' && 'text-right',
                    (cell.column.columnDef.meta as any)?.fixed && 'bg-background',
                  ]"
                >
                  <!-- 优先使用插槽渲染 -->
                  <slot
                    :name="`cell-${cell.column.id}`"
                    :row="cell.row.original"
                    :value="cell.getValue()"
                    :index="cell.row.index"
                  >
                    <!-- 其次使用 cell 函数渲染 -->
                    <FlexRender
                      v-if="cell.column.columnDef.cell"
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                    <!-- 默认渲染 -->
                    <template v-else>
                      {{ cell.getValue() }}
                    </template>
                  </slot>
                </TableCell>
              </TableRow>
              <!-- 展开行内容 -->
              <TableRow v-if="expandable && isRowExpanded(row.id)" class="bg-muted/30">
                <TableCell :colspan="row.getVisibleCells().length" class="py-4 px-4">
                  <slot name="expand" :row="row.original" :index="index">
                    <div class="text-sm text-muted-foreground">
                      自定义展开内容插槽: #expand="{ row, index }"
                    </div>
                  </slot>
                </TableCell>
              </TableRow>
            </template>
          </template>
          <template v-else>
            <TableRow>
              <TableCell
                :colspan="table.getAllColumns().length"
                class="h-40 text-center"
              >
                <slot name="empty">
                  <div class="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span class="text-sm">{{ emptyText }}</span>
                  </div>
                </slot>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- 分页器 -->
    <div
      v-if="pagination.show && pagination.total !== undefined && pagination.total > 0 && !(pagination.hideOnSinglePage && pageCount <= 1)"
      class="flex items-center justify-between px-1"
    >
      <slot name="pagination-prefix" />

      <div class="flex items-center gap-6">
        <!-- 分页信息 -->
        <div class="text-sm text-muted-foreground">
          共 <span class="font-medium text-foreground">{{ pagination.total }}</span> 条
        </div>

        <!-- 每页条数选择 -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">每页</span>
          <Select
            :model-value="String(paginationState.pageSize)"
            @update:model-value="handlePageSizeChange"
          >
            <SelectTrigger class="h-8 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="size in pagination.pageSizeOptions"
                :key="size"
                :value="String(size)"
                class="text-xs"
              >
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
          <span class="text-sm text-muted-foreground">条</span>
        </div>

        <!-- 简洁分页 -->
        <div class="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8"
            :disabled="paginationState.pageIndex === 0"
            @click="goToPage(paginationState.pageIndex)"
          >
            <ChevronLeft class="h-4 w-4" />
          </Button>
          
          <div class="flex items-center gap-1 px-2">
            <template v-for="page in visiblePages" :key="page">
              <span v-if="page === '...'" class="px-2 text-muted-foreground">...</span>
              <Button
                v-else
                variant="outline"
                size="sm"
                :class="[
                  'h-8 min-w-[32px] px-2.5 text-xs font-medium',
                  page === paginationState.pageIndex + 1
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary'
                    : 'hover:bg-muted',
                ]"
                @click="goToPage(page as number)"
              >
                {{ page }}
              </Button>
            </template>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8"
            :disabled="paginationState.pageIndex >= pageCount - 1"
            @click="goToPage(paginationState.pageIndex + 2)"
          >
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>

        <!-- 跳转到指定页 -->
        <div class="flex items-center gap-2 ml-4">
          <span class="text-sm text-muted-foreground">跳至</span>
          <Input
            :model-value="jumpPage"
            type="number"
            min="1"
            :max="pageCount"
            class="h-8 w-16 text-xs"
            @keyup.enter="handleJumpPage"
            @update:model-value="(v: string | number) => jumpPage = String(v)"
          />
          <span class="text-sm text-muted-foreground">页</span>
        </div>
      </div>

      <slot name="pagination-suffix" />
    </div>
  </div>
</template>
