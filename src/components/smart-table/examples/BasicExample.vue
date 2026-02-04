<script setup lang="ts">
import { ref, h } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SmartTable } from '@/components/smart-table'
import type { SmartTableColumn } from '@/components/smart-table'

/**
 * 用户数据类型
 */
interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

/**
 * 表格数据
 */
const tableData = ref<User[]>([
  { id: '1', name: '张三', email: 'zhangsan@example.com', role: '管理员', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: '李四', email: 'lisi@example.com', role: '编辑', status: 'active', createdAt: '2024-02-20' },
  { id: '3', name: '王五', email: 'wangwu@example.com', role: '用户', status: 'inactive', createdAt: '2024-03-10' },
  { id: '4', name: '赵六', email: 'zhaoliu@example.com', role: '用户', status: 'active', createdAt: '2024-04-05' },
  { id: '5', name: '钱七', email: 'qianqi@example.com', role: '编辑', status: 'active', createdAt: '2024-05-12' },
  { id: '6', name: '孙八', email: 'sunba@example.com', role: '用户', status: 'inactive', createdAt: '2024-06-18' },
  { id: '7', name: '周九', email: 'zhoujiu@example.com', role: '用户', status: 'active', createdAt: '2024-07-22' },
  { id: '8', name: '吴十', email: 'wushi@example.com', role: '管理员', status: 'active', createdAt: '2024-08-30' },
])

/**
 * 分页配置
 */
const pagination = ref({
  pageIndex: 1,
  pageSize: 5,
  total: 8,
  pageSizeOptions: [5, 10, 20, 50],
  show: true,
})

/**
 * 列配置
 */
const columns: SmartTableColumn<User>[] = [
  {
    key: 'name',
    title: '姓名',
    accessorKey: 'name',
    sortable: true,
    width: 120,
  },
  {
    key: 'email',
    title: '邮箱',
    accessorKey: 'email',
    width: 200,
  },
  {
    key: 'role',
    title: '角色',
    accessorKey: 'role',
    sortable: true,
    width: 100,
    cell: ({ value }) => {
      const roleColors: Record<string, string> = {
        '管理员': 'bg-red-100 text-red-800',
        '编辑': 'bg-blue-100 text-blue-800',
        '用户': 'bg-green-100 text-green-800',
      }
      return h(Badge, { class: roleColors[value as string] || 'bg-gray-100' }, () => value as string)
    },
  },
  {
    key: 'status',
    title: '状态',
    accessorKey: 'status',
    sortable: true,
    width: 100,
    align: 'center',
    cell: ({ value }) => {
      const isActive = value === 'active'
      return h(Badge, { variant: isActive ? 'default' : 'secondary' }, () => isActive ? '启用' : '禁用')
    },
  },
  {
    key: 'createdAt',
    title: '创建时间',
    accessorKey: 'createdAt',
    sortable: true,
    width: 120,
  },
]

/**
 * 表格引用
 */
const tableRef = ref<InstanceType<typeof SmartTable>>()

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 处理分页变化
 */
function handlePageChange(newPagination: any) {
  console.log('分页变化:', newPagination)
  pagination.value.pageIndex = newPagination.pageIndex + 1
  pagination.value.pageSize = newPagination.pageSize
}

/**
 * 处理排序变化
 */
function handleSortChange(sorting: any) {
  console.log('排序变化:', sorting)
}

/**
 * 处理选择变化
 */
function handleSelectionChange(selectedRows: User[]) {
  console.log('选中行:', selectedRows)
}

/**
 * 处理行点击
 */
function handleRowClick(row: User, index: number) {
  console.log('点击行:', row, '索引:', index)
}

/**
 * 处理刷新
 */
function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

/**
 * 获取选中数据
 */
function getSelectedData() {
  const selected = tableRef.value?.getSelectedRows()
  console.log('当前选中:', selected)
}

/**
 * 清除选择
 */
function clearSelection() {
  tableRef.value?.clearSelection()
}
</script>

<template>
  <div class="space-y-4 p-6">
    <h2 class="text-2xl font-bold">SmartTable 基础示例</h2>

    <!-- 操作按钮 -->
    <div class="flex gap-2">
      <Button @click="getSelectedData">
        获取选中数据
      </Button>
      <Button variant="outline" @click="clearSelection">
        清除选择
      </Button>
    </div>

    <!-- 表格 -->
    <SmartTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      :selectable="true"
      :show-index="true"
      :row-clickable="true"
      row-key="id"
      stripe
      @page-change="handlePageChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @refresh="handleRefresh"
    >
      <!-- 工具栏 -->
      <template #toolbar>
        <Button size="sm">
          新增用户
        </Button>
        <Button size="sm" variant="outline">
          批量删除
        </Button>
      </template>

      <!-- 工具栏额外内容 -->
      <template #toolbar-extra>
        <Button size="sm" variant="ghost">
          导出
        </Button>
      </template>
    </SmartTable>
  </div>
</template>
