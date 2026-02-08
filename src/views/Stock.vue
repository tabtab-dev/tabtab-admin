<script setup lang="ts">
/**
 * 库存盘点页
 */
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import { TModal } from '@/components/business/TModal'
import type { TableSchema } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StockItem } from '@/types/models'
import { inventoryApi } from '@/api'
import { useTableData } from '@/composables'
import {
  Plus,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  History
} from 'lucide-vue-next'
import { STOCK_CHECK_STATUS } from '@/constants'

interface TableSlotProps {
  record: StockItem
  text: any
  index: number
}

const {
  data: stockItems,
} = useTableData<StockItem>({
  apiCall: () => inventoryApi.getStockItems(),
  filterFn: (items, query, filterValues) => {
    let result = items

    if (query) {
      const lowerQuery = query.toLowerCase()
      result = result.filter(
        item =>
          item.productName.toLowerCase().includes(lowerQuery) ||
          item.sku.toLowerCase().includes(lowerQuery)
      )
    }

    if (filterValues.warehouseId) {
      result = result.filter(item => item.warehouseId === filterValues.warehouseId)
    }

    return result
  },
})

const warehouses = computed(() => {
  const warehouseIds = new Set(stockItems.value.map(item => item.warehouseId))
  return Array.from(warehouseIds).map(id => ({
    id,
    name: stockItems.value.find(item => item.warehouseId === id)?.warehouseName || `仓库 ${id}`
  }))
})

// 盘点记录
interface StockCheck {
  id: string
  productName: string
  sku: string
  warehouseName: string
  systemStock: number
  actualStock: number
  difference: number
  reason: string
  operator: string
  checkTime: string
  status: 'pending' | 'confirmed' | 'adjusted'
}

const stockChecks = ref<StockCheck[]>([
  {
    id: '1',
    productName: '高级无线耳机',
    sku: 'SKU-001',
    warehouseName: '北京仓库',
    systemStock: 45,
    actualStock: 43,
    difference: -2,
    reason: '损坏报废',
    operator: '张三',
    checkTime: '2024-02-01 10:30',
    status: 'adjusted'
  },
  {
    id: '2',
    productName: '智能手表 Pro',
    sku: 'SKU-002',
    warehouseName: '北京仓库',
    systemStock: 23,
    actualStock: 25,
    difference: 2,
    reason: '入库未登记',
    operator: '张三',
    checkTime: '2024-02-01 11:00',
    status: 'adjusted'
  },
  {
    id: '3',
    productName: '便携式充电宝',
    sku: 'SKU-003',
    warehouseName: '上海仓库',
    systemStock: 156,
    actualStock: 156,
    difference: 0,
    reason: '-',
    operator: '李四',
    checkTime: '2024-02-02 09:00',
    status: 'confirmed'
  }
])

// 统计标签
const statistics = computed(() => {
  const total = stockChecks.value.length
  const pending = stockChecks.value.filter(c => c.status === 'pending').length
  const adjusted = stockChecks.value.filter(c => c.status === 'adjusted').length
  const confirmed = stockChecks.value.filter(c => c.status === 'confirmed').length
  return [
    { title: '盘点记录', value: total, icon: ClipboardList, color: 'text-blue-500' },
    { title: '待确认', value: pending, icon: AlertTriangle, color: 'text-yellow-500' },
    { title: '已调整', value: adjusted, icon: History, color: 'text-purple-500' },
    { title: '已确认', value: confirmed, icon: CheckCircle, color: 'text-green-500' }
  ]
})

// 搜索表单
const searchFormData = ref({
  keyword: '',
  warehouse: ''
})

const searchSchema: FormSchema = {
  layout: 'inline',
  fields: [
    {
      name: 'keyword',
      type: 'input',
      label: '',
      placeholder: '搜索商品名称、SKU...',
      className: 'w-[240px]'
    },
    {
      name: 'warehouse',
      type: 'select',
      label: '',
      placeholder: '全部仓库',
      options: [
        { label: '全部仓库', value: '' },
        ...warehouses.value.map(w => ({ label: w.name, value: w.id }))
      ],
      className: 'w-[140px]'
    }
  ],
  searchConfig: {
    enabled: true,
    collapsed: false,
    showCollapseButton: false,
    searchText: '搜索',
    resetText: '重置',
    showReset: true
  }
}

// 表格配置
const tableSchema = computed<TableSchema>(() => ({
  columns: [
    {
      title: '商品信息',
      dataIndex: 'productName',
      width: 200,
      slot: 'product'
    },
    {
      title: '仓库',
      dataIndex: 'warehouseName',
      width: 120
    },
    {
      title: '系统库存',
      dataIndex: 'systemStock',
      width: 100
    },
    {
      title: '实际库存',
      dataIndex: 'actualStock',
      width: 100
    },
    {
      title: '差异',
      dataIndex: 'difference',
      width: 100,
      slot: 'difference'
    },
    {
      title: '原因',
      dataIndex: 'reason',
      width: 150
    },
    {
      title: '盘点时间',
      dataIndex: 'checkTime',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slot: 'status'
    }
  ],
  pagination: {
    pageSize: 10,
    show: true,
    showSizeChanger: true
  },
  rowSelection: {
    type: 'checkbox',
    show: true
  },
  showTotalBadge: true
}))

// 新增盘点
const isAddOpen = ref(false)
const addFormData = ref({
  productId: '',
  warehouseId: '',
  actualStock: 0,
  reason: ''
})

const addSchema: FormSchema = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [
    {
      name: 'productId',
      type: 'select',
      label: '商品',
      placeholder: '请选择商品',
      options: stockItems.value.map(item => ({ label: item.productName, value: item.id })),
      rules: [{ required: true, message: '请选择商品' }]
    },
    {
      name: 'warehouseId',
      type: 'select',
      label: '仓库',
      placeholder: '请选择仓库',
      options: warehouses.value.map(w => ({ label: w.name, value: w.id })),
      rules: [{ required: true, message: '请选择仓库' }]
    },
    {
      name: 'actualStock',
      type: 'number',
      label: '实际库存',
      placeholder: '请输入实际库存数量',
      rules: [{ required: true, message: '请输入实际库存' }]
    },
    {
      name: 'reason',
      type: 'textarea',
      label: '差异原因',
      placeholder: '请输入差异原因（可选）'
    }
  ],
  actions: {
    showSubmit: true,
    showReset: true,
    submitText: '提交盘点',
    resetText: '取消',
    align: 'right',
    onReset: () => { isAddOpen.value = false }
  }
}

function handleAddSubmit(_values: Record<string, any>) {
  isAddOpen.value = false
  addFormData.value = { productId: '', warehouseId: '', actualStock: 0, reason: '' }
}

const selectedRowKeys = ref<(string | number)[]>([])
function handleSelectChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">库存盘点</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">定期盘点库存，确保账实相符</p>
      </div>
      <Button class="gap-2" @click="isAddOpen = true">
        <Plus class="h-4 w-4" />
        新增盘点
      </Button>
    </div>

    <TModal v-model:open="isAddOpen" title="新增盘点" width="560" :footer="null">
      <TForm v-model="addFormData" :schema="addSchema" @submit="handleAddSubmit" />
    </TModal>

    <div class="flex flex-wrap gap-3">
      <div
        v-for="stat in statistics"
        :key="stat.title"
        class="flex items-center gap-3 px-4 py-2.5 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
      >
        <component :is="stat.icon" :class="['h-4 w-4', stat.color]" />
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-semibold">{{ stat.value }}</span>
          <span class="text-xs text-muted-foreground">{{ stat.title }}</span>
        </div>
      </div>
    </div>

    <div class="bg-muted/30 rounded-lg p-4">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex-1">
          <TForm v-model="searchFormData" :schema="searchSchema" />
        </div>
      </div>
    </div>

    <Card class="border-0 shadow-sm">
      <CardContent class="pt-6">
        <TTable
          ref="tableRef"
          v-model:data="stockChecks"
          :schema="tableSchema"
          @select-change="handleSelectChange"
        >
          <template #product="slotProps">
            <div>
              <div class="font-medium">{{ (slotProps as TableSlotProps).text }}</div>
              <div class="text-xs text-muted-foreground font-mono">{{ (slotProps as TableSlotProps).record.sku }}</div>
            </div>
          </template>

          <template #difference="slotProps">
            <span :class="[
              'font-medium',
              (slotProps as TableSlotProps).text > 0 ? 'text-green-500' : 
              (slotProps as TableSlotProps).text < 0 ? 'text-red-500' : 'text-gray-500'
            ]">
              {{ (slotProps as TableSlotProps).text > 0 ? '+' : '' }}{{ (slotProps as TableSlotProps).text }}
            </span>
          </template>

          <template #status="slotProps">
            <Badge
              :class="{
                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': (slotProps as TableSlotProps).text === STOCK_CHECK_STATUS.PENDING,
                'bg-purple-500/10 text-purple-500 border-purple-500/20': (slotProps as TableSlotProps).text === STOCK_CHECK_STATUS.ADJUSTED,
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as TableSlotProps).text === STOCK_CHECK_STATUS.CONFIRMED
              }"
              variant="outline"
            >
              {{ (slotProps as TableSlotProps).text === STOCK_CHECK_STATUS.PENDING ? '待确认' : 
                 (slotProps as TableSlotProps).text === STOCK_CHECK_STATUS.ADJUSTED ? '已调整' : '已确认' }}
            </Badge>
          </template>

          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ClipboardList class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无盘点记录</p>
              <p class="text-sm text-muted-foreground mb-4">开始创建您的第一条盘点记录吧</p>
              <Button size="sm" @click="isAddOpen = true">
                <Plus class="h-4 w-4 mr-1" />
                新增盘点
              </Button>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>
  </div>
</template>
