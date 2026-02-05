<script setup lang="ts">
/**
 * TTable - 基于 antdv-next 的 JSON 配置化表格组件
 *
 * @description 支持通过 JSON Schema 配置生成表格，样式与 shadcn-vue 主题对齐
 */
import { computed, ref, watch, useSlots, h } from 'vue'
import { ConfigProvider, Popconfirm, Button } from 'antdv-next'
import { cn } from '@/lib/utils'
import { useTTableTheme } from './theme'
import type {
  TableSchema,
  TableColumn,
  TTableProps,
  TTableExpose,
  TableAction,
  RowSelectionConfig,
  PaginationConfig,
  TableSorter,
  TableRecord,
  TableFilters,
  TablePagination
} from './types'

/**
 * 导入样式
 */
import './TTable.css'

/**
 * 组件选项
 */
defineOptions({
  name: 'TTable'
})

/**
 * Props 定义
 */
const props = withDefaults(defineProps<TTableProps>(), {
  data: () => [],
  loading: false
})

/**
 * Emits 定义
 */
const emit = defineEmits([
  'update:data',
  'change',
  'selectChange',
  'expand',
  'update:expandedRowKeys'
])

/**
 * TTable 主题配置
 * @description 组件级主题配置，不影响全局 antdv-next 主题
 */
const ttableTheme = useTTableTheme()

/**
 * 插槽
 */
const slots = useSlots()

/**
 * Table 实例引用
 */
const tableRef = ref<InstanceType<typeof ConfigProvider> | null>(null)

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
    total: 0
  }
})

/**
 * 计算表格数据
 */
const tableData = computed({
  get: () => props.data || [],
  set: (val) => emit('update:data', val)
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
 * 计算是否显示操作列
 */
const showActionColumn = computed(() => {
  return props.schema.actions && props.schema.actions.length > 0
})

/**
 * 计算表格列配置
 * @description 将 schema.columns 转换为 antd 的 columns 格式
 */
const tableColumns = computed(() => {
  const columns = props.schema.columns.map((col, index) => {
    const column: Record<string, unknown> = {
      key: col.key || col.dataIndex || index,
      dataIndex: col.dataIndex,
      title: col.title,
      width: col.width,
      minWidth: col.minWidth,
      align: col.align,
      fixed: col.fixed,
      ellipsis: col.ellipsis,
      className: col.className,
      ...col.props
    }

    // 排序配置
    if (col.sorter) {
      column.sorter = col.sorter
      if (col.defaultSortOrder) {
        column.defaultSortOrder = col.defaultSortOrder
      }
      if (col.sortDirections) {
        column.sortDirections = col.sortDirections
      }
      if (col.showSorterTooltip !== undefined) {
        column.showSorterTooltip = col.showSorterTooltip
      }
    }

    // 筛选配置
    if (col.filters) {
      column.filters = col.filters
      if (col.filterMode) {
        column.filterMode = col.filterMode
      }
      if (col.filterMultiple !== undefined) {
        column.filterMultiple = col.filterMultiple
      }
      if (col.defaultFilteredValue) {
        column.defaultFilteredValue = col.defaultFilteredValue
      }
      if (col.onFilter) {
        column.onFilter = col.onFilter
      }
    }

    // 自定义渲染
    if (col.customRender) {
      column.customRender = col.customRender
    }

    // 自定义表头渲染
    if (col.customHeaderRender) {
      column.customHeaderCell = (column: TableColumn) => {
        return col.customHeaderRender?.({
          title: column.title,
          column: col,
          index
        })
      }
    }

    return column
  })

  // 添加操作列
  if (showActionColumn.value) {
    columns.push({
      key: 'action',
      title: props.schema.actionTitle || '操作',
      width: props.schema.actionWidth || 150,
      fixed: props.schema.actionFixed || 'right',
      align: 'center',
      render: (_value: unknown, record: TableRecord, index: number) => {
        return renderActions(record, index)
      }
    })
  }

  return columns
})

/**
 * 渲染操作按钮
 * @param record - 行数据
 * @param index - 行索引
 */
function renderActions(record: TableRecord, index: number) {
  const actions = props.schema.actions || []
  const visibleActions = actions.filter((action) => {
    if (typeof action.show === 'function') {
      return action.show(record, index)
    }
    return action.show !== false
  })

  return visibleActions.map((action, actionIndex) => {
    const isDisabled = typeof action.disabled === 'function'
      ? action.disabled(record, index)
      : action.disabled

    const buttonClass = cn(
      'px-2',
      action.type === 'danger' && 'text-destructive hover:text-destructive/80',
      action.type === 'primary' && 'text-primary hover:text-primary/80'
    )

    const button = h(Button, {
      key: actionIndex,
      type: action.type === 'link' ? 'link' : 'text',
      size: 'small',
      disabled: isDisabled,
      class: buttonClass,
      onClick: (e: MouseEvent) => {
        e.stopPropagation()
        if (!action.confirm) {
          action.onClick(record, index)
        }
      }
    }, () => action.text)

    if (action.confirm) {
      return h(Popconfirm, {
        key: actionIndex,
        title: action.confirmText || '确认执行此操作？',
        onConfirm: () => action.onClick(record, index)
      }, () => button)
    }

    return button
  })
}

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
    onChange: (selectedRowKeys: (string | number)[], selectedRows: TableRecord[]) => {
      state.value.selectedRowKeys = selectedRowKeys
      // 直接使用 antd 返回的 selectedRows
      state.value.selectedRows = selectedRows
      emit('selectChange', selectedRowKeys, selectedRows)
    }
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

  return {
    current: state.value.pagination.current,
    pageSize: state.value.pagination.pageSize,
    total: state.value.pagination.total,
    pageSizeOptions: config.pageSizeOptions || ['10', '20', '50', '100'],
    showQuickJumper: config.showQuickJumper ?? true,
    showSizeChanger: config.showSizeChanger ?? true,
    showTotal: config.showTotal !== false ? (total: number) =>
      `共 ${total} 条` : undefined,
    simple: config.simple,
    ...config
  }
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
      } else {
        state.value.expandedRowKeys = state.value.expandedRowKeys.filter(k => k !== key)
      }
      emit('expand', expanded, record)
      emit('update:expandedRowKeys', state.value.expandedRowKeys)
    }
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
  sorter: { field: string; order: SortOrder; column: TableColumn }
) {
  state.value.pagination.current = pagination.current
  state.value.pagination.pageSize = pagination.pageSize

  emit('change', pagination, filters, {
    field: sorter.field,
    order: sorter.order,
    column: props.schema.columns.find(col => col.dataIndex === sorter.field)
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
      record => selectedRowKeys.includes(record[keyField] as string | number)
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
    } else if (!expanded && index > -1) {
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
  }
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
        record => state.value.selectedRowKeys.includes(record[keyField] as string | number)
      )
    }
  },
  { deep: true }
)

/**
 * 监听 schema 中的 pagination.total 变化
 */
watch(
  () => props.schema.pagination?.total,
  (newTotal) => {
    if (newTotal !== undefined) {
      state.value.pagination.total = newTotal
    }
  },
  { immediate: true }
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
        record => newKeys.includes(record[keyField] as string | number)
      )
    }
  },
  { immediate: true }
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
  { immediate: true }
)
</script>

<template>
  <ConfigProvider :theme="ttableTheme">
    <a-table
      ref="tableRef"
      :data-source="tableData"
      :columns="tableColumns"
      :row-key="rowKey"
      :loading="loading || schema.loading"
      :size="schema.size || 'middle'"
      :bordered="schema.bordered"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="schema.scroll"
      :show-header="schema.showHeader !== false"
      :table-layout="schema.tableLayout"
      :virtual="schema.virtual"
      :sticky="schema.sticky"
      :expandable="expandable"
      :class="cn('t-table', $attrs.class as string)"
      @change="handleChange"
    >
    <!-- 标题插槽 -->
    <template v-if="schema.title || slots.title" #title>
      <slot name="title" :data="tableData">
        <template v-if="typeof schema.title === 'function'">
          {{ schema.title(tableData) }}
        </template>
        <template v-else>
          {{ schema.title }}
        </template>
      </slot>
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
          <p>{{ schema.emptyText || '暂无数据' }}</p>
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
      #expandIcon="{ expanded, onExpand, record, expandable }"
    >
      <slot
        name="expandIcon"
        :expanded="expanded"
        :on-expand="onExpand"
        :record="record"
        :expandable="expandable"
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
  </ConfigProvider>
</template>
