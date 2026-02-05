<script setup lang="ts">
/**
 * 销售分析页
 */
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-vue-next'

const salesData = ref({
  totalSales: 1284567,
  totalOrders: 3456,
  avgOrderValue: 371.5,
  conversionRate: '3.2%',
  growth: 18.5
})

const statistics = computed(() => [
  { title: '总销售额', value: '¥' + salesData.value.totalSales.toLocaleString(), icon: DollarSign, color: 'text-green-500', trend: '+18.5%' },
  { title: '订单数量', value: salesData.value.totalOrders.toLocaleString(), icon: ShoppingCart, color: 'text-blue-500', trend: '+12.3%' },
  { title: '客单价', value: '¥' + salesData.value.avgOrderValue, icon: Package, color: 'text-purple-500', trend: '+5.2%' },
  { title: '转化率', value: salesData.value.conversionRate, icon: TrendingUp, color: 'text-orange-500', trend: '+0.8%' }
])
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">销售分析</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">分析销售数据和订单趋势</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <div v-for="stat in statistics" :key="stat.title" class="flex items-center gap-3 px-4 py-2.5 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
        <component :is="stat.icon" :class="['h-4 w-4', stat.color]" />
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-semibold">{{ stat.value }}</span>
          <span class="text-xs text-muted-foreground">{{ stat.title }}</span>
          <span class="text-xs text-green-500">{{ stat.trend }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">销售趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center text-muted-foreground">
            <div class="text-center">
              <TrendingUp class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>销售趋势图表</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">品类销售占比</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center text-muted-foreground">
            <div class="text-center">
              <Package class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>品类销售分布</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
