<script setup lang="ts">
/**
 * 库存管理页
 */
import { ref, computed } from 'vue'
import { TTable } from '@/components/business/TTable'
import { TForm } from '@/components/business/TForm'
import type { TableSchema } from '@/components/business/TTable'
import type { FormSchema } from '@/components/business/TForm'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StockItem } from '@/types/models'
import { inventoryApi } from '@/api'
import { useTableData } from '@/composables'
import {
  Warehouse,
  Package,
  AlertTriangle,
  CheckCircle
} from 'lucide-vue-next'

interface TableSlotProps {
  record: StockItem
  text: any
  index: number
}

const {
  data: stockItems,
  loading,
  searchQuery,
  filters,
  filteredData,
  paginatedData,
  total,
  statistics,
  fetchData,
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
  statisticsFn: (items) => {
    const warehouseIds = new Set(items.map(item => item.warehouseId))
    const totalWarehouses = warehouseIds.size
    const totalProducts = items.reduce((sum, item) => sum + item.quantity, 0)
    const lowStockItems = items.filter(item => item.available < item.minStock).length

    return {
      totalWarehouses,
      activeWarehouses: totalWarehouses,
      totalProducts,
      lowStockItems,
    }
  },
})

// 仓库列表（用于筛选）
const warehouses = computed(() => {
  const warehouseIds = new Set(stockItems.value.map(item => item.warehouseId))
  return Array.from(warehouseIds).map(id => ({
    id,
    name: stockItems.value.find(item => item.warehouseId === id)?.warehouseName || `仓库 ${id}`
  }))
})

// 统计标签
const statisticsCards = computed(() => {
  const stats = statistics.value || {}
  return [
    { title: '仓库总数', value: stats.totalWarehouses || 0, icon: Warehouse, color: 'text-blue-500' },
    { title: '运营中', value: stats.activeWarehouses || 0, icon: CheckCircle, color: 'text-green-500' },
    { title: '库存总量', value: stats.totalProducts || 0, icon: Package, color: 'text-purple-500' },
    { title: '库存预警', value: stats.lowStockItems || 0, icon: AlertTriangle, color: 'text-red-500' }
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
    showReset: true,
    onSearch: (values) => {
      searchQuery.value = values.keyword || ''
      filters.value = {
        warehouseId: values.warehouse,
      }
    },
    onReset: () => {
      searchQuery.value = ''
      filters.value = {}
    }
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
      title: '总库存',
      dataIndex: 'quantity',
      width: 100,
      sorter: true
    },
    {
      title: '预留',
      dataIndex: 'reserved',
      width: 100
    },
    {
      title: '可用',
      dataIndex: 'available',
      width: 100,
      slot: 'available'
    },
    {
      title: '库存状态',
      dataIndex: 'available',
      width: 120,
      slot: 'status'
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdated',
      width: 120
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

// 表格数据
const tableData = computed(() => {
  return paginatedData.value.map(item => ({ ...item, key: item.id }))
})

const selectedRowKeys = ref<(string | number)[]>([])
function handleSelectChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys
}

</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">库存管理</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">管理仓库和库存分布</p>
      </div>
    </div>

    <!-- 统计标签 -->
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

    <!-- 搜索表单 -->
    <div class="bg-muted/30 rounded-lg p-4">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex-1">
          <TForm v-model="searchFormData" :schema="searchSchema" />
        </div>
        <div v-if="selectedRowKeys.length > 0" class="flex items-center gap-2 lg:border-l lg:pl-4">
          <span class="text-sm text-muted-foreground">已选 {{ selectedRowKeys.length }} 项</span>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <Card class="border-0 shadow-sm">
      <CardContent class="pt-6">
        <TTable
          ref="tableRef"
          v-model:data="tableData"
          :schema="tableSchema"
          @select-change="handleSelectChange"
        >
          <!-- 商品列 -->
          <template #product="slotProps">
            <div>
              <div class="font-medium">{{ (slotProps as TableSlotProps).text }}</div>
              <div class="text-xs text-muted-foreground font-mono">{{ (slotProps as TableSlotProps).record.sku }}</div>
            </div>
          </template>

          <!-- 可用库存列 -->
          <template #available="slotProps">
            <span :class="[
              'font-medium',
              (slotProps as TableSlotProps).record.available <= (slotProps as TableSlotProps).record.minStock ? 'text-red-500' : 'text-green-500'
            ]">
              {{ (slotProps as TableSlotProps).text }}
            </span>
          </template>

          <!-- 状态列 -->
          <template #status="slotProps">
            <Badge
              :class="{
                'bg-red-500/10 text-red-500 border-red-500/20': (slotProps as TableSlotProps).record.available <= (slotProps as TableSlotProps).record.minStock,
                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': (slotProps as TableSlotProps).record.available > (slotProps as TableSlotProps).record.minStock && (slotProps as TableSlotProps).record.available <= (slotProps as TableSlotProps).record.minStock * 1.5,
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as TableSlotProps).record.available > (slotProps as TableSlotProps).record.minStock * 1.5
              }"
              variant="outline"
            >
              {{ (slotProps as TableSlotProps).record.available <= (slotProps as TableSlotProps).record.minStock ? '库存不足' : 
                 (slotProps as TableSlotProps).record.available <= (slotProps as TableSlotProps).record.minStock * 1.5 ? '库存偏低' : '库存充足' }}
            </Badge>
          </template>

          <!-- 空状态 -->
          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无库存数据</p>
              <p class="text-sm text-muted-foreground">请先添加仓库和商品</p>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>
  </div>
</template>
