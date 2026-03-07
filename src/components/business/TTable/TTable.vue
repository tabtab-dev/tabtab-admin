<script setup lang="ts">
import type {
  ResponsiveConfig,
  SortOrder,
  TableCellSlotProps,
  TableFilters,
  TableHeaderSlotProps,
  TablePagination,
  TableRecord,
  TableSize,
  TableToolbarConfig,
  TTableExpose,
  TTableProps,
} from './types'
import { ConfigProvider, Tooltip } from 'antdv-next'
/**
 * TTable - 基于 antdv-next 的 JSON 配置化表格组件
 *
 * @description 支持通过 JSON Schema 配置生成表格，样式与 shadcn-vue 主题对齐
 */
import { computed, ref, shallowRef, useSlots, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Columns3, Maximize2, Minimize2, RefreshCw, Settings2 } from 'lucide-vue-next'
import { useResponsive } from '@/composables/useResponsive'
import { useTableColumns } from '@/composables/useTableColumns'
import { getAntdvLocale } from '@/i18n/locales'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useTTableTheme } from './theme'

/**
 * 导入样式
 */
import './TTable.css'

/**
 * 组件选项
 */
defineOptions({
  name: 'TTable',
})

/**
 * Props 定义
 */
const props = withDefaults(defineProps<TTableProps>(), {
  data: () => [],
  loading: false,
})

/**
 * Emits 定义
 */
const emit = defineEmits([
  'update:data',
  'change',
  'selectChange',
  'expand',
  'update:expandedRowKeys',
])

/**
 * 插槽定义
 */
defineSlots<{
  [slotName: string]: (props: TableCellSlotProps | TableHeaderSlotProps) => any
}>()

/**
 * i18n
 */
const { t, locale } = useI18n()

const { currentBreakpoint, isMobile: _isMobile, smallerThan } = useResponsive()

const responsiveConfig = computed<ResponsiveConfig>(() => {
  return props.schema.responsive || { enabled: true }
})

const isResponsiveEnabled = computed(() => responsiveConfig.value.enabled !== false)

const mobileBreakpoint = computed(() => responsiveConfig.value.mobileBreakpoint || 'md')

const isMobileView = computed(() => {
  if (!isResponsiveEnabled.value)
    return false
  return smallerThan(mobileBreakpoint.value)
})

/**
 * TTable 主题配置
 * @description 组件级主题配置，不影响全局 antdv-next 主题
 */
const ttableTheme = useTTableTheme()

/**
 * antdv locale
 */
const antdvLocale = ref<any>(null)

/**
 * 加载 antdv locale
 */
async function loadAntdvLocale() {
  const currentLocale = locale.value as 'zh-CN' | 'en-US'
  antdvLocale.value = await getAntdvLocale(currentLocale)
}

/**
 * 监听语言变化
 */
watch(locale, loadAntdvLocale, { immediate: true })

/**
 * 插槽
 */
const slots = useSlots()

/**
 * Table 实例引用
 * @description 使用 shallowRef 优化，表格实例不需要深层响应式
 */
const tableRef = shallowRef<any>(null)

/**
 * 表格状态
 */
const state = ref({
  selectedRowKeys: [] as (string | number)[],
  selectedRows: [] as TableRecord[],
  expandedRowKeys: [] as (string | number)[],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
})

/**
 * 工具栏状态
 */
const tableSize = ref<TableSize>('middle')
const isFullscreen = ref(false)
const isRefreshing = ref(false)
const columnSettingsVisible = ref(false)
const visibleColumnKeys = ref<(string | number)[]>([])

/**
 * 工具栏配置
 */
const toolbarConfig = computed<TableToolbarConfig>(() => {
  if (typeof props.schema.toolbar === 'boolean') {
    return {
      enabled: props.schema.toolbar,
      showRefresh: true,
      showDensity: true,
      showColumnSettings: true,
      showFullscreen: false,
    }
  }
  return {
    enabled: true,
    showRefresh: true,
    showDensity: true,
    showColumnSettings: true,
    showFullscreen: false,
    ...props.schema.toolbar,
  }
})

/**
 * 密度选项
 */
const densityOptions = computed(() => {
  return toolbarConfig.value.densityOptions || [
    { label: t('common.compact'), value: 'small' as TableSize },
    { label: t('common.default'), value: 'middle' as TableSize },
    { label: t('common.loose'), value: 'large' as TableSize },
  ]
})

/**
 * 初始化可见列
 */
function initVisibleColumns() {
  if (visibleColumnKeys.value.length === 0) {
    visibleColumnKeys.value = props.schema.columns
      .filter(col => col.dataIndex || col.key)
      .map(col => col.key || col.dataIndex as string)
  }
}

/**
 * 刷新表格
 */
async function handleRefresh() {
  if (isRefreshing.value)
    return
  isRefreshing.value = true
  emit('change', { ...state.value.pagination }, {}, { field: '', order: undefined, column: undefined } as TableSorter)
  setTimeout(() => {
    isRefreshing.value = false
  }, 300)
}

/**
 * 切换表格密度
 */
function handleDensityChange(size: TableSize) {
  tableSize.value = size
}

/**
 * 切换全屏
 */
function handleFullscreenToggle() {
  isFullscreen.value = !isFullscreen.value
  toolbarConfig.value.onFullscreen?.(isFullscreen.value)
}

/**
 * 切换列可见性
 */
function toggleColumnVisibility(key: string, checked: boolean) {
  if (checked) {
    if (!visibleColumnKeys.value.includes(key)) {
      visibleColumnKeys.value.push(key)
    }
  }
  else {
    visibleColumnKeys.value = visibleColumnKeys.value.filter(k => k !== key)
  }
}

/**
 * 计算表格数据
 */
const tableData = computed({
  get: () => props.data || [],
  set: val => emit('update:data', val),
})

/**
 * 计算行 key
 * @description 优先使用 schema 配置的 rowKey，支持函数或字符串，默认使用 'id'
 */
const rowKey = computed(() => {
  if (typeof props.schema.rowKey === 'function') {
    return props.schema.rowKey
  }
  // 默认使用 'id' 作为 rowKey
  return props.schema.rowKey || 'id'
})

/**
 * 获取行的 key 值
 * @param record - 行数据
 * @returns 行的唯一标识
 */
function getRowKey(record: TableRecord): string | number {
  // 如果配置了函数类型的 rowKey，直接使用
  if (typeof rowKey.value === 'function') {
    return rowKey.value(record)
  }
  // 如果配置了字符串类型的 rowKey，使用对应字段
  if (typeof rowKey.value === 'string') {
    const key = record[rowKey.value] as string | number | undefined
    if (key !== undefined) {
      return key
    }
  }
  // 默认尝试 'id' 字段
  if (record.id !== undefined) {
    return record.id as string | number
  }
  // 最后尝试 'key' 字段
  if (record.key !== undefined) {
    return record.key as string | number
  }
  // 兜底：返回字符串化的 record（避免 undefined 导致的选择问题）
  return JSON.stringify(record)
}

/**
 * 使用 useTableColumns 管理列配置
 */
const { tableColumns, showActionColumn: _showActionColumn } = useTableColumns({
  columns: computed(() => props.schema.columns || []),
  actions: computed(() => props.schema.actions || []),
  actionTitle: computed(() => props.schema.actionTitle),
  actionWidth: computed(() => props.schema.actionWidth || 150),
  actionFixed: computed(() => props.schema.actionFixed || 'right'),
})

const filteredColumns = computed(() => {
  let columns = tableColumns.value

  if (isResponsiveEnabled.value && isMobileView.value && responsiveConfig.value.enableHorizontalScrollOnMobile === false) {
    const hideColumns = responsiveConfig.value.hideColumnsOnMobile || []
    const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

    columns = columns.filter((col) => {
      const colKey = col.key || col.dataIndex
      if (colKey && hideColumns.includes(String(colKey))) {
        return false
      }

      const colWithResponsive = col as any
      if (colWithResponsive.hiddenOn) {
        const currentIndex = breakpointOrder.indexOf(currentBreakpoint.value)
        const shouldHide = colWithResponsive.hiddenOn.some((bp: string) => {
          const bpIndex = breakpointOrder.indexOf(bp as any)
          return bpIndex >= currentIndex
        })
        if (shouldHide)
          return false
      }

      if (colWithResponsive.showOn) {
        const currentIndex = breakpointOrder.indexOf(currentBreakpoint.value)
        const shouldShow = colWithResponsive.showOn.some((bp: string) => {
          const bpIndex = breakpointOrder.indexOf(bp as any)
          return bpIndex <= currentIndex
        })
        if (!shouldShow)
          return false
      }

      return true
    })
  }

  if (toolbarConfig.value.enabled && visibleColumnKeys.value.length > 0) {
    columns = columns.filter((col) => {
      const colKey = col.key || col.dataIndex
      // 操作列（key 为 'action'）始终显示，不受列设置过滤
      if (colKey === 'action')
        return true
      if (!colKey)
        return true
      return visibleColumnKeys.value.includes(colKey)
    })
  }

  return columns
})

const responsiveScroll = computed(() => {
  const originalScroll = props.schema.scroll || {}

  if (!isResponsiveEnabled.value || !isMobileView.value) {
    return originalScroll
  }

  if (responsiveConfig.value.enableHorizontalScrollOnMobile !== false) {
    if (responsiveConfig.value.scrollXOnMobile !== undefined) {
      return {
        ...originalScroll,
        x: responsiveConfig.value.scrollXOnMobile,
      }
    }

    const totalMinWidth = tableColumns.value.reduce((sum, col) => {
      const colWidth = col.width
      const colMinWidth = col.minWidth

      if (typeof colWidth === 'number') {
        return sum + colWidth
      }
      if (typeof colMinWidth === 'number') {
        return sum + colMinWidth
      }
      return sum + 120
    }, 0)

    return {
      ...originalScroll,
      x: Math.max(totalMinWidth, 600),
    }
  }

  return originalScroll
})

/**
 * 计算行选择配置
 */
const rowSelection = computed(() => {
  if (!props.schema.rowSelection || props.schema.rowSelection.show === false) {
    return undefined
  }

  const config = props.schema.rowSelection

  return {
    type: config.type || 'checkbox',
    selectedRowKeys: state.value.selectedRowKeys,
    columnWidth: config.columnWidth,
    columnTitle: config.columnTitle,
    fixed: config.fixed,
    hideSelectAll: config.hideSelectAll,
    selections: config.selections,
    getCheckboxProps: config.getCheckboxProps,
    preserveSelectedRowKeys: config.preserveSelectedRowKeys,
    checkStrictly: config.checkStrictly,
    onChange: (selectedRowKeys: (string | number)[], selectedRows: TableRecord[]) => {
      state.value.selectedRowKeys = selectedRowKeys
      // 直接使用 antd 返回的 selectedRows
      state.value.selectedRows = selectedRows
      emit('selectChange', selectedRowKeys, selectedRows)
    },
  }
})

/**
 * 计算分页配置
 */
const pagination = computed(() => {
  if (props.schema.pagination === false) {
    return false
  }

  const config = props.schema.pagination || {}

  const basePagination = {
    current: state.value.pagination.current,
    pageSize: state.value.pagination.pageSize,
    total: state.value.pagination.total,
    pageSizeOptions: config.pageSizeOptions || ['10', '20', '50', '100'],
    showQuickJumper: config.showQuickJumper ?? true,
    showSizeChanger: config.showSizeChanger ?? true,
    showTotal: config.showTotal !== false
      ? (total: number) =>
          t('common.total', { total })
      : undefined,
    simple: config.simple,
    ...config,
  }

  if (isResponsiveEnabled.value && isMobileView.value) {
    if (responsiveConfig.value.simplePaginationOnMobile !== false) {
      return {
        ...basePagination,
        simple: true,
        showQuickJumper: false,
        showSizeChanger: false,
        showTotal: false,
      }
    }
  }

  return basePagination
})

/**
 * 计算展开行配置
 */
const expandable = computed(() => {
  if (!props.schema.expandable) {
    return undefined
  }

  const config = props.schema.expandable

  return {
    defaultExpandAllRows: config.defaultExpandAllRows,
    defaultExpandedRowKeys: config.defaultExpandedRowKeys,
    expandedRowKeys: state.value.expandedRowKeys,
    rowExpandable: config.rowExpandable,
    expandIconColumnIndex: config.expandIconColumnIndex,
    expandIcon: config.expandIcon,
    // 如果配置了 expandedRowRender 函数，使用它；否则如果有 expandedRow 插槽，不设置（由插槽处理）
    expandedRowRender: config.expandedRowRender || (slots.expandedRow ? undefined : undefined),
    onExpand: (expanded: boolean, record: TableRecord) => {
      const key = getRowKey(record)
      // 使用新数组替换，确保响应式更新
      if (expanded) {
        state.value.expandedRowKeys = [...state.value.expandedRowKeys, key]
      }
      else {
        state.value.expandedRowKeys = state.value.expandedRowKeys.filter(k => k !== key)
      }
      emit('expand', expanded, record)
      emit('update:expandedRowKeys', state.value.expandedRowKeys)
    },
  }
})

/**
 * 处理表格变化事件
 * @param pagination - 分页信息
 * @param filters - 筛选信息
 * @param sorter - 排序信息
 */
function handleChange(
  pagination: TablePagination,
  filters: TableFilters,
  sorter: { field: string, order: SortOrder, column: TableColumn },
) {
  state.value.pagination.current = pagination.current
  state.value.pagination.pageSize = pagination.pageSize

  emit('change', pagination, filters, {
    field: sorter.field,
    order: sorter.order,
    column: props.schema.columns.find(col => col.dataIndex === sorter.field),
  } as TableSorter)
}

/**
 * 暴露方法
 * @description 通过 ref 调用这些方法
 */
defineExpose<TTableExpose>({
  /**
   * 获取当前选中的行数据
   */
  getSelectedRows: () => state.value.selectedRows,

  /**
   * 获取当前选中的行 key
   */
  getSelectedRowKeys: () => state.value.selectedRowKeys,

  /**
   * 设置选中的行
   */
  setSelectedRows: (selectedRowKeys: (string | number)[]) => {
    state.value.selectedRowKeys = selectedRowKeys
    // 根据 selectedRowKeys 从 tableData 中筛选出对应的行数据
    // 使用 rowKey 来匹配，而不是直接使用数组索引
    const keyField = typeof rowKey.value === 'string' ? rowKey.value : 'id'
    state.value.selectedRows = tableData.value.filter(
      record => selectedRowKeys.includes(record[keyField] as string | number),
    )
  },

  /**
   * 清空选中
   */
  clearSelection: () => {
    state.value.selectedRowKeys = []
    state.value.selectedRows = []
  },

  /**
   * 获取 antd Table 实例
   */
  getTableInstance: () => tableRef.value ?? undefined,

  /**
   * 刷新表格数据
   */
  refresh: () => {
    emit('change', { ...state.value.pagination }, {}, { field: '', order: undefined, column: undefined } as TableSorter)
  },

  /**
   * 获取当前分页信息
   */
  getPagination: () => ({ ...state.value.pagination }),

  /**
   * 设置分页
   */
  setPagination: (pagination) => {
    if (pagination.current !== undefined) {
      state.value.pagination.current = pagination.current
    }
    if (pagination.pageSize !== undefined) {
      state.value.pagination.pageSize = pagination.pageSize
    }
    if (pagination.total !== undefined) {
      state.value.pagination.total = pagination.total
    }
  },

  /**
   * 展开指定行
   */
  expandRow: (record: TableRecord, expanded = true) => {
    const key = getRowKey(record)
    const index = state.value.expandedRowKeys.indexOf(key)

    if (expanded && index === -1) {
      state.value.expandedRowKeys.push(key)
    }
    else if (!expanded && index > -1) {
      state.value.expandedRowKeys.splice(index, 1)
    }
  },

  /**
   * 展开所有行
   */
  expandAllRows: () => {
    state.value.expandedRowKeys = tableData.value.map(record => getRowKey(record))
  },

  /**
   * 收起所有行
   */
  collapseAllRows: () => {
    state.value.expandedRowKeys = []
  },
})

/**
 * 监听外部数据变化
 */
watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      // 更新选中行的数据，使用 rowKey 字段进行匹配
      const keyField = typeof rowKey.value === 'string' ? rowKey.value : 'id'
      state.value.selectedRows = newVal.filter(
        record => state.value.selectedRowKeys.includes(record[keyField] as string | number),
      )
    }
  },
  { deep: true },
)

/**
 * 监听 schema 中的 pagination.total 变化
 */
watch(
  () => {
    const pagination = props.schema.pagination
    return typeof pagination === 'object' ? pagination.total : undefined
  },
  (newTotal) => {
    if (newTotal !== undefined) {
      state.value.pagination.total = newTotal
    }
  },
  { immediate: true },
)

/**
 * 监听 schema 中的 rowSelection.selectedRowKeys 变化
 */
watch(
  () => props.schema.rowSelection?.selectedRowKeys,
  (newKeys) => {
    if (newKeys) {
      state.value.selectedRowKeys = newKeys
      // 使用 rowKey 字段进行匹配
      const keyField = typeof rowKey.value === 'string' ? rowKey.value : 'id'
      state.value.selectedRows = tableData.value.filter(
        record => newKeys.includes(record[keyField] as string | number),
      )
    }
  },
  { immediate: true },
)

/**
 * 监听 schema 中的 expandable.expandedRowKeys 变化
 */
watch(
  () => props.schema.expandable?.expandedRowKeys,
  (newKeys) => {
    if (newKeys) {
      state.value.expandedRowKeys = newKeys
    }
  },
  { immediate: true },
)

/**
 * 初始化可见列
 */
watch(
  () => props.schema.columns,
  () => {
    initVisibleColumns()
  },
  { immediate: true },
)

/**
 * 监听 schema.size 变化
 */
watch(
  () => props.schema.size,
  (newSize) => {
    if (newSize) {
      tableSize.value = newSize
    }
  },
  { immediate: true },
)
</script>

<template>
  <ConfigProvider v-if="antdvLocale" :theme="ttableTheme" :locale="antdvLocale">
    <!-- 正常模式表格 -->
    <div :class="cn('t-table-wrapper', $attrs.class as string)">
      <a-table
        ref="tableRef"
        :data-source="tableData"
        :columns="filteredColumns"
        :row-key="rowKey"
        :loading="loading || schema.loading"
        :size="tableSize"
        :bordered="schema.bordered"
        :pagination="pagination"
        :row-selection="rowSelection"
        :scroll="responsiveScroll"
        :show-header="schema.showHeader !== false"
        :table-layout="schema.tableLayout"
        :virtual="schema.virtual"
        :sticky="schema.sticky"
        :expandable="expandable"
        :children-column-name="schema.childrenColumnName || 'children'"
        :indent-size="schema.indentSize ?? 15"
        class="t-table"
        @change="handleChange"
      >
      <!-- 标题插槽 - 包含标题和工具栏 -->
      <template v-if="schema.title || slots.title || schema.showTotalBadge || toolbarConfig.enabled" #title>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <slot name="title" :data="tableData">
              <template v-if="typeof schema.title === 'function'">
                {{ schema.title(tableData) }}
              </template>
              <template v-else-if="schema.title">
                {{ schema.title }}
              </template>
            </slot>
            <!-- 总数徽章 -->
            <span
              v-if="schema.showTotalBadge"
              class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap"
            >
              {{ t('common.total', { total: tableData.length }) }}
            </span>
          </div>
          
          <!-- 工具栏 -->
          <div v-if="toolbarConfig.enabled" class="t-table-toolbar">
            <!-- 刷新按钮 -->
            <Tooltip v-if="toolbarConfig.showRefresh" :title="toolbarConfig.refreshText || t('common.refresh')">
              <button
                type="button"
                class="t-table-toolbar-btn"
                :class="{ 'animate-spin': isRefreshing }"
                :disabled="isRefreshing"
                @click="handleRefresh"
              >
                <RefreshCw class="w-4 h-4" />
              </button>
            </Tooltip>

            <!-- 密度切换 -->
            <DropdownMenu v-if="toolbarConfig.showDensity">
              <DropdownMenuTrigger as-child>
                <button type="button" class="t-table-toolbar-btn" :title="t('common.density')">
                  <Settings2 class="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-32">
                <DropdownMenuItem
                  v-for="opt in densityOptions"
                  :key="opt.value"
                  :class="tableSize === opt.value && 'bg-accent'"
                  @click="handleDensityChange(opt.value)"
                >
                  {{ opt.label }}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- 列设置 -->
            <DropdownMenu v-if="toolbarConfig.showColumnSettings">
              <DropdownMenuTrigger as-child>
                <button type="button" class="t-table-toolbar-btn" :title="t('common.columnSettings')">
                  <Columns3 class="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-48">
                <div class="text-sm font-medium mb-2 px-2">
                  {{ t('common.columnSettings') }}
                </div>
                <div class="space-y-1 px-1">
                  <label
                    v-for="col in schema.columns.filter(c => c.dataIndex || c.key)"
                    :key="col.key || col.dataIndex"
                    class="t-table-column-item"
                  >
                    <input
                      type="checkbox"
                      :checked="visibleColumnKeys.includes(col.key || col.dataIndex as string)"
                      @change="(e: Event) => {
                        const key = col.key || col.dataIndex as string
                        const checked = (e.target as HTMLInputElement).checked
                        toggleColumnVisibility(key, checked)
                      }"
                    >
                    <span>{{ col.title }}</span>
                  </label>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- 全屏切换 -->
            <Tooltip v-if="toolbarConfig.showFullscreen" :title="t('common.fullscreen')">
              <button type="button" class="t-table-toolbar-btn" @click="handleFullscreenToggle">
                <Maximize2 class="w-4 h-4" />
              </button>
            </Tooltip>

            <!-- 自定义按钮 -->
            <template v-if="toolbarConfig.customActions?.length">
              <div class="w-px h-4 bg-border mx-1" />
              <template v-for="action in toolbarConfig.customActions" :key="action.key">
                <Tooltip v-if="action.show !== false" :title="action.tooltip || action.text">
                  <button
                    type="button"
                    class="t-table-toolbar-btn"
                    :disabled="action.disabled"
                    @click="action.onClick"
                  >
                    <component
                      :is="typeof action.icon === 'string' ? null : action.icon"
                      v-if="action.icon && typeof action.icon !== 'string'"
                      class="w-4 h-4"
                    />
                    <span v-if="action.text">{{ action.text }}</span>
                  </button>
                </Tooltip>
              </template>
            </template>
          </div>
        </div>
      </template>

      <!-- 尾部插槽 -->
      <template v-if="schema.footer || slots.footer" #footer>
        <slot name="footer" :data="tableData">
          <template v-if="typeof schema.footer === 'function'">
            {{ schema.footer(tableData) }}
          </template>
          <template v-else>
            {{ schema.footer }}
          </template>
        </slot>
      </template>

      <!-- 汇总行插槽 -->
      <template v-if="schema.summary?.slot || slots.summary || schema.summary?.render" #summary>
        <slot name="summary" :data="tableData">
          <template v-if="schema.summary?.render">
            {{ schema.summary.render(tableData) }}
          </template>
        </slot>
      </template>

      <!-- 空状态插槽 -->
      <template v-if="schema.emptySlot || slots.emptyText" #emptyText>
        <slot name="emptyText">
          <div class="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <svg
              class="w-12 h-12 mb-4 text-muted-foreground/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>{{ schema.emptyText || t('common.noData') }}</p>
          </div>
        </slot>
      </template>

      <!-- 展开行插槽 -->
      <template
        v-if="schema.expandable?.expandedRowSlot || slots.expandedRow"
        #expandedRowRender="{ record, index, indent, expanded }"
      >
        <slot
          name="expandedRow"
          :record="record"
          :index="index"
          :indent="indent"
          :expanded="expanded"
        />
      </template>

      <!-- 展开图标插槽 -->
      <template
        v-if="slots.expandIcon"
        #expandIcon="{ expanded, onExpand, record, expandable: expandRowConfig }"
      >
        <slot
          name="expandIcon"
          :expanded="expanded"
          :on-expand="onExpand"
          :record="record"
          :expandable="expandRowConfig"
        />
      </template>

      <!-- 自定义单元格插槽 -->
      <template #bodyCell="{ column, text, record, index }">
        <!-- 查找对应的列配置 -->
        <template
          v-for="col in schema.columns"
          :key="col.key || col.dataIndex"
        >
          <template v-if="(col.key || col.dataIndex) === column.key && col.slot && slots[col.slot]">
            <slot
              :name="col.slot"
              :text="text"
              :record="record"
              :index="index"
              :column="col"
            />
          </template>
        </template>
      </template>

      <!-- 自定义表头插槽 -->
      <template #headerCell="{ column, text, index }">
        <!-- 查找对应的列配置 -->
        <template
          v-for="col in schema.columns"
          :key="col.key || col.dataIndex"
        >
          <template v-if="(col.key || col.dataIndex) === column.key && col.headerSlot && slots[col.headerSlot]">
            <slot
              :name="col.headerSlot"
              :title="text"
              :column="col"
              :index="index"
            />
          </template>
        </template>
      </template>
      </a-table>
    </div>

    <!-- 全屏模式 Dialog -->
    <Dialog v-model:open="isFullscreen">
      <DialogContent :show-close-button="false" class="min-w-[95vw] max-h-[95vh] h-[95vh] p-0 gap-0">
        <DialogTitle class="sr-only">
          {{ typeof schema.title === 'function' ? schema.title(tableData) : schema.title || t('common.table') }}
        </DialogTitle>
        <DialogDescription class="sr-only">
          {{ t('common.tableFullscreenDescription') }}
        </DialogDescription>
        <div class="flex flex-col h-full">
          <!-- 全屏模式工具栏 -->
          <div class="flex items-center justify-between px-6 py-4 border-b">
            <div class="flex items-center gap-3">
              <slot name="title" :data="tableData">
                <template v-if="typeof schema.title === 'function'">
                  {{ schema.title(tableData) }}
                </template>
                <template v-else-if="schema.title">
                  {{ schema.title }}
                </template>
              </slot>
              <span
                v-if="schema.showTotalBadge"
                class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap"
              >
                {{ t('common.total', { total: tableData.length }) }}
              </span>
            </div>
            <div class="t-table-toolbar">
              <Tooltip v-if="toolbarConfig.showRefresh" :title="toolbarConfig.refreshText || t('common.refresh')">
                <button
                  type="button"
                  class="t-table-toolbar-btn"
                  :class="{ 'animate-spin': isRefreshing }"
                  :disabled="isRefreshing"
                  @click="handleRefresh"
                >
                  <RefreshCw class="w-4 h-4" />
                </button>
              </Tooltip>
              <DropdownMenu v-if="toolbarConfig.showDensity">
                <DropdownMenuTrigger as-child>
                  <button type="button" class="t-table-toolbar-btn" :title="t('common.density')">
                    <Settings2 class="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-32">
                  <DropdownMenuItem
                    v-for="opt in densityOptions"
                    :key="opt.value"
                    :class="tableSize === opt.value && 'bg-accent'"
                    @click="handleDensityChange(opt.value)"
                  >
                    {{ opt.label }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu v-if="toolbarConfig.showColumnSettings">
                <DropdownMenuTrigger as-child>
                  <button type="button" class="t-table-toolbar-btn" :title="t('common.columnSettings')">
                    <Columns3 class="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48">
                  <div class="text-sm font-medium mb-2 px-2">
                    {{ t('common.columnSettings') }}
                  </div>
                  <div class="space-y-1 px-1">
                    <label
                      v-for="col in schema.columns.filter(c => c.dataIndex || c.key)"
                      :key="col.key || col.dataIndex"
                      class="t-table-column-item"
                    >
                      <input
                        type="checkbox"
                        :checked="visibleColumnKeys.includes(col.key || col.dataIndex as string)"
                        @change="(e: Event) => {
                          const key = col.key || col.dataIndex as string
                          const checked = (e.target as HTMLInputElement).checked
                          toggleColumnVisibility(key, checked)
                        }"
                      >
                      <span>{{ col.title }}</span>
                    </label>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip :title="t('common.exitFullscreen')">
                <button type="button" class="t-table-toolbar-btn" @click="isFullscreen = false">
                  <Minimize2 class="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
          <!-- 全屏模式表格 -->
          <div class="flex-1 overflow-auto p-6">
            <a-table
              :data-source="tableData"
              :columns="filteredColumns"
              :row-key="rowKey"
              :loading="loading || schema.loading"
              :size="tableSize"
              :bordered="schema.bordered"
              :pagination="false"
              :row-selection="rowSelection"
              :scroll="{ x: 'max-content' }"
              :show-header="schema.showHeader !== false"
              :table-layout="schema.tableLayout"
              :virtual="schema.virtual"
              :expandable="expandable"
              :children-column-name="schema.childrenColumnName || 'children'"
              :indent-size="schema.indentSize ?? 15"
              class="t-table"
            >
              <template #bodyCell="{ column, text, record, index }">
                <template
                  v-for="col in schema.columns"
                  :key="col.key || col.dataIndex"
                >
                  <template v-if="(col.key || col.dataIndex) === column.key && col.slot && slots[col.slot]">
                    <slot
                      :name="col.slot"
                      :text="text"
                      :record="record"
                      :index="index"
                      :column="col"
                    />
                  </template>
                </template>
              </template>
              <template #headerCell="{ column, text, index }">
                <template
                  v-for="col in schema.columns"
                  :key="col.key || col.dataIndex"
                >
                  <template v-if="(col.key || col.dataIndex) === column.key && col.headerSlot && slots[col.headerSlot]">
                    <slot
                      :name="col.headerSlot"
                      :title="text"
                      :column="col"
                      :index="index"
                    />
                  </template>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </ConfigProvider>
</template>
