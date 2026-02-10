/**
 * 表格列配置管理 Composable
 * @description 封装表格列配置转换逻辑，将 TTable 的列配置转换为 antd 兼容格式
 */
import { computed, h, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Popconfirm } from 'antdv-next'
import { Button } from '@/components/ui/button'
import {
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  FileText,
  Settings,
  Download,
  Share2,
  Copy,
  ExternalLink,
  Shield,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { TableColumn, TableAction, TableRecord } from '@/components/business/TTable/types'

/**
 * 默认图标映射
 * @description 根据按钮文本自动匹配图标
 */
const defaultIconMap: Record<string, any> = {
  '编辑': Pencil,
  '修改': Pencil,
  '删除': Trash2,
  '查看': Eye,
  '详情': MoreHorizontal,
  '详情页': FileText,
  '设置': Settings,
  '下载': Download,
  '分享': Share2,
  '复制': Copy,
  '跳转': ExternalLink,
  '权限': Shield,
}

/**
 * useTableColumns 配置选项
 */
export interface UseTableColumnsOptions {
  /**
   * 表格列配置数组
   */
  columns: TableColumn[]
  /**
   * 操作按钮配置数组
   */
  actions?: TableAction[]
  /**
   * 操作列标题
   * @default 'common.actions' (i18n key)
   */
  actionTitle?: string
  /**
   * 操作列宽度
   * @default 150
   */
  actionWidth?: number | string
  /**
   * 操作列固定位置
   * @default 'right'
   */
  actionFixed?: 'left' | 'right'
}

/**
 * useTableColumns 返回值
 */
export interface UseTableColumnsReturn {
  /**
   * 转换后的表格列配置（antd 兼容格式）
   */
  tableColumns: import('vue').ComputedRef<Record<string, unknown>[]>
  /**
   * 是否显示操作列
   */
  showActionColumn: import('vue').ComputedRef<boolean>
}

/**
 * 获取按钮图标
 * @param action - 操作按钮配置
 * @returns 图标组件
 */
function getActionIcon(action: TableAction) {
  if (action.icon) {
    return action.icon
  }
  return defaultIconMap[action.text] || null
}

/**
 * 渲染操作按钮
 * @param actions - 操作按钮配置数组
 * @param t - i18n 翻译函数
 * @returns 渲染函数
 */
function createActionsRenderer(actions: TableAction[], t: (key: string) => string) {
  return (_value: unknown, record: TableRecord, index: number) => {
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

      const icon = getActionIcon(action)

      const buttonClass = cn(
        'h-8 px-3 py-1.5 gap-1.5 text-sm font-medium',
        action.variant === 'destructive' && 'text-destructive hover:text-destructive hover:bg-destructive/10',
        action.variant === 'default' && 'text-primary hover:text-primary hover:bg-primary/10',
        !action.variant && action.type === 'danger' && 'text-destructive hover:text-destructive hover:bg-destructive/10',
        !action.variant && action.type === 'primary' && 'text-primary hover:text-primary hover:bg-primary/10',
        !action.variant && !action.type && 'text-foreground hover:text-accent-foreground hover:bg-accent'
      )

      const button = h(Button, {
        key: actionIndex,
        variant: action.variant || 'ghost',
        size: 'sm',
        disabled: isDisabled,
        class: buttonClass,
        onClick: (e: MouseEvent) => {
          e.stopPropagation()
          if (!action.confirm) {
            action.onClick(record, index)
          }
        },
      }, () => [
        icon ? h(icon, { class: 'size-4' }) : null,
        action.text,
      ])

      if (action.confirm) {
        return h(Popconfirm, {
          key: actionIndex,
          title: action.confirmText || '确认执行此操作？',
          onConfirm: () => action.onClick(record, index),
        }, () => button)
      }

      return button
    })
  }
}

/**
 * 转换单列配置
 * @param col - 原始列配置
 * @param index - 列索引
 * @returns 转换后的 antd 列配置
 */
function transformColumn(col: TableColumn, index: number): Record<string, unknown> {
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
    ...col.props,
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
    column.customHeaderCell = (columnConfig: TableColumn) => {
      return col.customHeaderRender?.({
        title: columnConfig.title,
        column: col,
        index,
      })
    }
  }

  return column
}

/**
 * 表格列配置管理 Hook
 * @param options 配置选项
 * @returns 转换后的列配置
 *
 * @example
 * ```ts
 * const { tableColumns, showActionColumn } = useTableColumns({
 *   columns: [
 *     { key: 'name', title: '姓名', dataIndex: 'name' },
 *     { key: 'age', title: '年龄', dataIndex: 'age', sorter: true }
 *   ],
 *   actions: [
 *     { text: '编辑', onClick: (record) => handleEdit(record) },
 *     { text: '删除', type: 'danger', confirm: true, onClick: (record) => handleDelete(record) }
 *   ]
 * })
 * ```
 */
export function useTableColumns(options: UseTableColumnsOptions): UseTableColumnsReturn {
  const { t } = useI18n()
  const {
    columns,
    actions,
    actionTitle,
    actionWidth = 150,
    actionFixed = 'right',
  } = options

  /**
   * 获取操作按钮数组（支持 ComputedRef 或普通数组）
   */
  const actionsArray = computed(() => unref(actions) || [])

  /**
   * 计算是否显示操作列
   */
  const showActionColumn = computed(() => {
    return actionsArray.value.length > 0
  })

  /**
   * 计算表格列配置
   * @description 将 schema.columns 转换为 antd 的 columns 格式
   */
  const tableColumns = computed(() => {
    // 获取列配置数组（支持 ComputedRef 或普通数组）
    const columnsArray = unref(columns) || []
    // 转换数据列
    const transformedColumns = columnsArray.map((col, index) => transformColumn(col, index))

    // 添加操作列
    if (showActionColumn.value && actionsArray.value.length > 0) {
      transformedColumns.push({
        key: 'action',
        title: unref(actionTitle) || t('common.actions'),
        width: unref(actionWidth),
        fixed: unref(actionFixed),
        align: 'center',
        render: createActionsRenderer(actionsArray.value, t),
      })
    }

    return transformedColumns
  })

  return {
    tableColumns,
    showActionColumn,
  }
}
