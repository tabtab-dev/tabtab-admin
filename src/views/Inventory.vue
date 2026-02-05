<script setup lang="ts">
/**
 * 库存管理页
 */
import { ref, computed } from 'vue'
import { TTable } from '@/components/data/TTable'
import { TForm } from '@/components/data/TForm'
import type { TableSchema, TTableExpose } from '@/components/data/TTable'
import type { FormSchema } from '@/components/data/TForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useInventoryStore } from '@/stores/inventory'
import {
  Warehouse,
  Package,
  AlertTriangle,
  CheckCircle,
  Search,
  MapPin
} from 'lucide-vue-next'

const inventoryStore = useInventoryStore()

// 统计标签
const statistics = computed(() => {
  const stats = inventoryStore.statistics
  return [
    { title: '仓库总数', value: stats.totalWarehouses, icon: Warehouse, color: 'text-blue-500' },
    { title: '运营中', value: stats.activeWarehouses, icon: CheckCircle, color: 'text-green-500' },
    { title: '库存总量', value: stats.totalProducts, icon: Package, color: 'text-purple-500' },
    { title: '库存预警', value: stats.lowStockItems, icon: AlertTriangle, color: 'text-red-500' }
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
        ...inventoryStore.warehouses.map(w => ({ label: w.name, value: w.id }))
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
      inventoryStore.searchQuery = values.keyword || ''
      inventoryStore.warehouseFilter = values.warehouse || ''
    },
    onReset: () => {
      inventoryStore.searchQuery = ''
      inventoryStore.warehouseFilter = ''
    }
  }
}

// 表格配置
const tableRef = ref<TTableExpose>()

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
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`
  },
  rowSelection: {
    type: 'checkbox',
    show: true
  }
}))

const tableData = computed(() => {
  return inventoryStore.filteredStock.map(item => ({ ...item, key: item.id }))
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
      <CardHeader class="pb-4">
        <div class="flex items-center gap-3">
          <CardTitle class="text-base font-semibold">库存列表</CardTitle>
          <span class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            共 {{ tableData.length }} 条
          </span>
        </div>
      </CardHeader>
      <CardContent class="pt-0">
        <TTable
          ref="tableRef"
          v-model:data="tableData"
          :schema="tableSchema"
          @select-change="handleSelectChange"
        >
          <!-- 商品列 -->
          <template #product="slotProps">
            <div>
              <div class="font-medium">{{ (slotProps as any).text }}</div>
              <div class="text-xs text-muted-foreground font-mono">{{ (slotProps as any).record.sku }}</div>
            </div>
          </template>

          <!-- 可用库存列 -->
          <template #available="slotProps">
            <span :class="[
              'font-medium',
              (slotProps as any).record.available <= (slotProps as any).record.minStock ? 'text-red-500' : 'text-green-500'
            ]">
              {{ (slotProps as any).text }}
            </span>
          </template>

          <!-- 状态列 -->
          <template #status="slotProps">
            <Badge
              :class="{
                'bg-red-500/10 text-red-500 border-red-500/20': (slotProps as any).record.available <= (slotProps as any).record.minStock,
                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': (slotProps as any).record.available > (slotProps as any).record.minStock && (slotProps as any).record.available <= (slotProps as any).record.minStock * 1.5,
                'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as any).record.available > (slotProps as any).record.minStock * 1.5
              }"
              variant="outline"
            >
              {{ (slotProps as any).record.available <= (slotProps as any).record.minStock ? '库存不足' : 
                 (slotProps as any).record.available <= (slotProps as any).record.minStock * 1.5 ? '库存偏低' : '库存充足' }}
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
