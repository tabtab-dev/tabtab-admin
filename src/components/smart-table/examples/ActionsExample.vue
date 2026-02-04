<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'vue-sonner'
import {
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  MoreHorizontal,
} from 'lucide-vue-next'
import { SmartTable } from '@/components/smart-table'
import type { SmartTableColumn, SmartTableAction } from '@/components/smart-table'

/**
 * 产品数据类型
 */
interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'on_sale' | 'off_sale' | 'out_of_stock'
  createdAt: string
}

const router = useRouter()

/**
 * 表格数据
 */
const tableData = ref<Product[]>([
  { id: '1', name: 'iPhone 15 Pro', category: '手机', price: 7999, stock: 100, status: 'on_sale', createdAt: '2024-01-15' },
  { id: '2', name: 'MacBook Pro 16', category: '电脑', price: 19999, stock: 50, status: 'on_sale', createdAt: '2024-02-20' },
  { id: '3', name: 'AirPods Pro', category: '耳机', price: 1999, stock: 0, status: 'out_of_stock', createdAt: '2024-03-10' },
  { id: '4', name: 'iPad Air', category: '平板', price: 4799, stock: 80, status: 'on_sale', createdAt: '2024-04-05' },
  { id: '5', name: 'Apple Watch', category: '手表', price: 2999, stock: 30, status: 'off_sale', createdAt: '2024-05-12' },
  { id: '6', name: 'Magic Mouse', category: '配件', price: 699, stock: 200, status: 'on_sale', createdAt: '2024-06-18' },
  { id: '7', name: 'HomePod', category: '音响', price: 2299, stock: 10, status: 'on_sale', createdAt: '2024-07-22' },
  { id: '8', name: 'Apple TV', category: '电视', price: 1299, stock: 0, status: 'off_sale', createdAt: '2024-08-30' },
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
 * 操作配置
 */
const actions: SmartTableAction<Product>[] = [
  {
    key: 'view',
    label: '查看详情',
    icon: Eye,
    onClick: (row) => {
      toast.info(`查看产品: ${row.name}`)
    },
  },
  {
    key: 'edit',
    label: '编辑',
    icon: Edit,
    onClick: (row) => {
      toast.info(`编辑产品: ${row.name}`)
    },
  },
  {
    key: 'copy',
    label: '复制',
    icon: Copy,
    onClick: (row) => {
      toast.success(`已复制产品: ${row.name}`)
    },
  },
  {
    key: 'download',
    label: '下载数据',
    icon: Download,
    show: (row) => row.status === 'on_sale',
    onClick: (row) => {
      toast.success(`下载产品数据: ${row.name}`)
    },
  },
  {
    key: 'delete',
    label: '删除',
    icon: Trash2,
    danger: true,
    disabled: (row) => row.stock > 0,
    onClick: (row, index) => {
      tableData.value.splice(index, 1)
      toast.success(`已删除产品: ${row.name}`)
    },
  },
]

/**
 * 列配置
 */
const columns: SmartTableColumn<Product>[] = [
  {
    key: 'name',
    title: '产品名称',
    accessorKey: 'name',
    sortable: true,
    width: 180,
  },
  {
    key: 'category',
    title: '分类',
    accessorKey: 'category',
    sortable: true,
    width: 100,
    cell: ({ value }) => h(Badge, { variant: 'outline' }, () => value),
  },
  {
    key: 'price',
    title: '价格',
    accessorKey: 'price',
    sortable: true,
    width: 120,
    align: 'right',
    cell: ({ value }) => `¥${(value as number).toLocaleString()}`,
  },
  {
    key: 'stock',
    title: '库存',
    accessorKey: 'stock',
    sortable: true,
    width: 100,
    align: 'right',
    cell: ({ value }) => {
      const numValue = value as number
      const color = numValue === 0 ? 'text-red-600' : numValue < 20 ? 'text-yellow-600' : 'text-green-600'
      return h('span', { class: color }, numValue)
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
      const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        'on_sale': { label: '在售', variant: 'default' },
        'off_sale': { label: '下架', variant: 'secondary' },
        'out_of_stock': { label: '缺货', variant: 'destructive' },
      }
      const status = statusMap[value as string]
      return h(Badge, { variant: status.variant }, () => status.label)
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
 * 加载状态
 */
const loading = ref(false)

/**
 * 处理分页变化
 */
function handlePageChange(newPagination: any) {
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
 * 处理刷新
 */
function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast.success('数据已刷新')
  }, 1000)
}

/**
 * 批量删除
 */
function handleBatchDelete(selectedRows: Product[]) {
  if (selectedRows.length === 0) {
    toast.warning('请先选择要删除的产品')
    return
  }
  toast.success(`批量删除 ${selectedRows.length} 个产品`)
}
</script>

<template>
  <div class="space-y-4 p-6">
    <div>
      <h2 class="text-2xl font-bold">操作菜单示例</h2>
      <p class="text-muted-foreground mt-1">
        展示表格的操作列功能，包括查看、编辑、复制、下载、删除等操作
      </p>
    </div>

    <!-- 表格 -->
    <SmartTable
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      :selectable="true"
      :show-index="true"
      :actions="actions"
      action-column-title="操作"
      :action-column-width="120"
      stripe
      @page-change="handlePageChange"
      @sort-change="handleSortChange"
      @refresh="handleRefresh"
    >
      <!-- 工具栏 -->
      <template #toolbar>
        <Button size="sm">
          <Edit class="h-4 w-4 mr-1" />
          新增产品
        </Button>
      </template>

      <!-- 工具栏额外内容 -->
      <template #toolbar-extra>
        <Button size="sm" variant="outline">
          <Download class="h-4 w-4 mr-1" />
          导出
        </Button>
      </template>
    </SmartTable>
  </div>
</template>
