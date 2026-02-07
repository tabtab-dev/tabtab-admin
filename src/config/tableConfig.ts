import type { TableSchema } from '@/components/business/TTable'

/**
 * 通用表格配置
 */
export const commonTableConfig = {
  pagination: {
    pageSize: 10,
    show: true,
    showSizeChanger: true,
    showQuickJumper: true
  } as const,
  rowSelection: {
    type: 'checkbox' as const,
    show: true
  } as const,
  actionWidth: 150,
  actionFixed: 'right' as const
} as const

/**
 * 创建带通用配置的表格 Schema
 */
export function createTableSchema(config: Partial<TableSchema>): TableSchema {
  return {
    ...commonTableConfig,
    ...config,
    pagination: {
      ...commonTableConfig.pagination,
      ...config.pagination
    },
    rowSelection: {
      ...commonTableConfig.rowSelection,
      ...config.rowSelection
    }
  }
}