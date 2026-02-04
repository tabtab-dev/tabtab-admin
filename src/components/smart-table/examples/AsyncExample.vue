<script setup lang="ts">
import { ref, h, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'vue-sonner'
import {
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Search,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { SmartTable } from '@/components/smart-table'
import type { SmartTableColumn, SmartTableAction } from '@/components/smart-table'

/**
 * 订单数据类型
 */
interface Order {
  id: string
  orderNo: string
  customer: string
  amount: number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  createdAt: string
}

/**
 * 表格数据
 */
const tableData = ref<Order[]>([])

/**
 * 分页配置
 */
const pagination = ref({
  pageIndex: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: [10, 20, 50, 100],
  show: true,
})

/**
 * 搜索关键词
 */
const searchKeyword = ref('')

/**
 * 加载状态
 */
const loading = ref(false)

/**
 * 操作配置
 */
const actions: SmartTableAction<Order>[] = [
  {
    key: 'view',
    label: '查看',
    icon: Eye,
    onClick: (row) => {
      toast.info(`查看订单: ${row.orderNo}`)
    },
  },
  {
    key: 'edit',
    label: '编辑',
    icon: Edit,
    show: (row) => row.status !== 'completed' && row.status !== 'cancelled',
    onClick: (row) => {
      toast.info(`编辑订单: ${row.orderNo}`)
    },
  },
  {
    key: 'delete',
    label: '取消订单',
    icon: Trash2,
    danger: true,
    show: (row) => row.status === 'pending',
    onClick: (row, index) => {
      tableData.value.splice(index, 1)
      pagination.value.total--
      toast.success(`已取消订单: ${row.orderNo}`)
    },
  },
]

/**
 * 列配置
 */
const columns: SmartTableColumn<Order>[] = [
  {
    key: 'orderNo',
    title: '订单编号',
    accessorKey: 'orderNo',
    sortable: true,
    width: 150,
    cell: ({ value }) => h('span', { class: 'font-mono text-sm' }, value as string),
  },
  {
    key: 'customer',
    title: '客户名称',
    accessorKey: 'customer',
    sortable: true,
    width: 150,
  },
  {
    key: 'amount',
    title: '订单金额',
    accessorKey: 'amount',
    sortable: true,
    width: 120,
    align: 'right',
    cell: ({ value }) => `¥${(value as number).toLocaleString()}`,
  },
  {
    key: 'status',
    title: '订单状态',
    accessorKey: 'status',
    sortable: true,
    width: 100,
    align: 'center',
    cell: ({ value }) => {
      const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        'pending': { label: '待支付', variant: 'secondary' },
        'paid': { label: '已支付', variant: 'default' },
        'shipped': { label: '已发货', variant: 'outline' },
        'completed': { label: '已完成', variant: 'default' },
        'cancelled': { label: '已取消', variant: 'destructive' },
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
    width: 150,
  },
]

/**
 * 模拟 API 请求
 */
async function fetchData(pageIndex: number, pageSize: number, keyword?: string) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // 生成模拟数据
  const allData: Order[] = Array.from({ length: 86 }, (_, i) => {
    const statuses: Order['status'][] = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    return {
      id: String(i + 1),
      orderNo: `ORD${String(Date.now()).slice(-8)}${String(i + 1).padStart(4, '0')}`,
      customer: `客户 ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 100)}`,
      amount: Math.floor(Math.random() * 10000) + 100,
      status,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    }
  })
  
  // 搜索过滤
  let filteredData = allData
  if (keyword) {
    filteredData = allData.filter(item => 
      item.orderNo.toLowerCase().includes(keyword.toLowerCase()) ||
      item.customer.toLowerCase().includes(keyword.toLowerCase())
    )
  }
  
  // 分页
  const start = (pageIndex - 1) * pageSize
  const end = start + pageSize
  const paginatedData = filteredData.slice(start, end)
  
  return {
    data: paginatedData,
    total: filteredData.length,
  }
}

/**
 * 加载数据
 */
async function loadData() {
  loading.value = true
  try {
    const result = await fetchData(
      pagination.value.pageIndex,
      pagination.value.pageSize,
      searchKeyword.value
    )
    tableData.value = result.data
    pagination.value.total = result.total
  } catch (error) {
    toast.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

/**
 * 处理分页变化
 */
function handlePageChange(newPagination: any) {
  pagination.value.pageIndex = newPagination.pageIndex + 1
  pagination.value.pageSize = newPagination.pageSize
  loadData()
}

/**
 * 处理排序变化
 */
function handleSortChange(sorting: any) {
  console.log('排序变化:', sorting)
  loadData()
}

/**
 * 处理刷新
 */
function handleRefresh() {
  loadData()
}

/**
 * 处理搜索
 */
function handleSearch() {
  pagination.value.pageIndex = 1
  loadData()
}

/**
 * 重置搜索
 */
function handleReset() {
  searchKeyword.value = ''
  pagination.value.pageIndex = 1
  loadData()
}

// 初始加载
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-4 p-6">
    <div>
      <h2 class="text-2xl font-bold">异步加载示例</h2>
      <p class="text-muted-foreground mt-1">
        展示表格的异步数据加载、搜索、分页等功能
      </p>
    </div>

    <!-- 搜索栏 -->
    <div class="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div class="flex items-center gap-2 flex-1">
        <Search class="h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchKeyword"
          placeholder="搜索订单编号或客户名称..."
          class="max-w-sm"
          @keyup.enter="handleSearch"
        />
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" @click="handleReset">
          重置
        </Button>
        <Button @click="handleSearch">
          <Search class="h-4 w-4 mr-1" />
          搜索
        </Button>
      </div>
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
      stripe
      @page-change="handlePageChange"
      @sort-change="handleSortChange"
      @refresh="handleRefresh"
    >
      <!-- 工具栏 -->
      <template #toolbar>
        <Button size="sm">
          <Edit class="h-4 w-4 mr-1" />
          新增订单
        </Button>
      </template>

      <!-- 分页前缀 -->
      <template #pagination-prefix>
        <span class="text-sm text-muted-foreground">
          显示第 {{ (pagination.pageIndex - 1) * pagination.pageSize + 1 }} 到 
          {{ Math.min(pagination.pageIndex * pagination.pageSize, pagination.total) }} 条
        </span>
      </template>
    </SmartTable>
  </div>
</template>
