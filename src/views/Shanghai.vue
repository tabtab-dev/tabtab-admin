<script setup lang="ts">
/**
 * 上海仓库页
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
import { Building, Package, AlertTriangle, CheckCircle, MapPin } from 'lucide-vue-next'

const {
  data: stockItems,
  loading,
  searchQuery,
  filteredData,
  paginatedData,
  fetchData,
} = useTableData<StockItem>({
  apiCall: () => inventoryApi.getStockItems(),
  filterFn: (items, query) => {
    let result = items.filter(item => item.warehouseId === '2')

    if (query) {
      const lowerQuery = query.toLowerCase()
      result = result.filter(
        item =>
          item.productName.toLowerCase().includes(lowerQuery) ||
          item.sku.toLowerCase().includes(lowerQuery)
      )
    }

    return result
  },
})

const shanghaiStock = computed(() => filteredData.value.filter(item => item.warehouseId === '2'))

const statistics = computed(() => {
  const totalProducts = shanghaiStock.value.length
  const totalQuantity = shanghaiStock.value.reduce((sum, item) => sum + item.quantity, 0)
  const lowStock = shanghaiStock.value.filter(item => item.available <= item.minStock).length
  const normalStock = shanghaiStock.value.filter(item => item.available > item.minStock).length
  return [
    { title: '商品种类', value: totalProducts, icon: Package, color: 'text-blue-500' },
    { title: '库存总量', value: totalQuantity, icon: Building, color: 'text-purple-500' },
    { title: '库存正常', value: normalStock, icon: CheckCircle, color: 'text-green-500' },
    { title: '库存不足', value: lowStock, icon: AlertTriangle, color: 'text-red-500' }
  ]
})

const searchFormData = ref({ keyword: '' })
const searchSchema: FormSchema = {
  layout: 'inline',
  fields: [{ name: 'keyword', type: 'input', label: '', placeholder: '搜索商品名称、SKU...', className: 'w-[280px]' }],
  searchConfig: { enabled: true, collapsed: false, showCollapseButton: false, searchText: '搜索', resetText: '重置', showReset: true, onSearch: (values) => { searchQuery.value = values.keyword || '' }, onReset: () => { searchQuery.value = '' } }
}


const tableSchema = computed<TableSchema>(() => ({
  columns: [
    { title: '商品信息', dataIndex: 'productName', width: 200, slot: 'product' },
    { title: '总库存', dataIndex: 'quantity', width: 100, sorter: true },
    { title: '预留', dataIndex: 'reserved', width: 100 },
    { title: '可用', dataIndex: 'available', width: 100, slot: 'available' },
    { title: '库存状态', dataIndex: 'available', width: 120, slot: 'status' },
    { title: '更新时间', dataIndex: 'lastUpdated', width: 120 }
  ],
  pagination: { pageSize: 10, show: true, showSizeChanger: true },
  rowSelection: { type: 'checkbox', show: true },
  showTotalBadge: true
}))

const tableData = computed(() => shanghaiStock.value.map(item => ({ ...item, key: item.id })))
const selectedRowKeys = ref<(string | number)[]>([])
function handleSelectChange(keys: (string | number)[]) { selectedRowKeys.value = keys }

</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">上海仓库</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">查看上海仓库库存情况</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <div v-for="stat in statistics" :key="stat.title" class="flex items-center gap-3 px-4 py-2.5 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
        <component :is="stat.icon" :class="['h-4 w-4', stat.color]" />
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-semibold">{{ stat.value }}</span>
          <span class="text-xs text-muted-foreground">{{ stat.title }}</span>
        </div>
      </div>
    </div>

    <div class="bg-muted/30 rounded-lg p-4">
      <TForm v-model="searchFormData" :schema="searchSchema" />
    </div>

    <Card class="border-0 shadow-sm">
      <CardContent class="pt-6">
        <TTable ref="tableRef" v-model:data="tableData" :schema="tableSchema" @select-change="handleSelectChange">
          <template #product="slotProps">
            <div>
              <div class="font-medium">{{ (slotProps as any).text }}</div>
              <div class="text-xs text-muted-foreground font-mono">{{ (slotProps as any).record.sku }}</div>
            </div>
          </template>
          <template #available="slotProps">
            <span :class="['font-medium', (slotProps as any).record.available <= (slotProps as any).record.minStock ? 'text-red-500' : 'text-green-500']">{{ (slotProps as any).text }}</span>
          </template>
          <template #status="slotProps">
            <Badge :class="{ 'bg-red-500/10 text-red-500 border-red-500/20': (slotProps as any).record.available <= (slotProps as any).record.minStock, 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': (slotProps as any).record.available > (slotProps as any).record.minStock && (slotProps as any).record.available <= (slotProps as any).record.minStock * 1.5, 'bg-green-500/10 text-green-500 border-green-500/20': (slotProps as any).record.available > (slotProps as any).record.minStock * 1.5 }" variant="outline">
              {{ (slotProps as any).record.available <= (slotProps as any).record.minStock ? '库存不足' : (slotProps as any).record.available <= (slotProps as any).record.minStock * 1.5 ? '库存偏低' : '库存充足' }}
            </Badge>
          </template>
          <template #emptyText>
            <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p class="text-base font-medium mb-1">暂无库存数据</p>
              <p class="text-sm text-muted-foreground">该仓库暂无商品库存</p>
            </div>
          </template>
        </TTable>
      </CardContent>
    </Card>
  </div>
</template>
