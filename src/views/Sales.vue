<script setup lang="ts">
/**
 * 销售分析页
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-vue-next'
import { MiniChart } from '@/components/bento'
import { analyticsApi } from '@/api/modules/analytics'

/**
 * 销售数据
 */
const salesData = ref({
  totalSales: 0,
  totalOrders: 0,
  avgOrderValue: 0,
  conversionRate: '0%',
  growth: 0
})

/**
 * 热销商品数据
 */
const topProducts = ref<{ id: string; name: string; sales: number; revenue: number; trend: number }[]>([])

/**
 * 分类占比数据
 */
const categoryShares = ref<{ name: string; percentage: number; color: string; amount: number }[]>([])

/**
 * 统计数据
 */
const statistics = computed(() => [
  { title: '总销售额', value: '¥' + salesData.value.totalSales.toLocaleString(), icon: DollarSign, color: 'text-green-500', trend: '+18.5%' },
  { title: '订单数量', value: salesData.value.totalOrders.toLocaleString(), icon: ShoppingCart, color: 'text-blue-500', trend: '+12.3%' },
  { title: '客单价', value: '¥' + salesData.value.avgOrderValue, icon: Package, color: 'text-purple-500', trend: '+5.2%' },
  { title: '转化率', value: salesData.value.conversionRate, icon: TrendingUp, color: 'text-orange-500', trend: '+0.8%' }
])

/**
 * 获取销售数据
 */
const fetchSalesData = async () => {
  try {
    const [metricsData, productsData, categoriesData] = await Promise.all([
      analyticsApi.getCoreMetrics('7d'),
      analyticsApi.getTopProducts(5),
      analyticsApi.getCategoryShares()
    ])

    salesData.value = {
      totalSales: Math.round(metricsData.avgOrderValue * metricsData.totalVisits * metricsData.conversionRate / 100),
      totalOrders: Math.round(metricsData.totalVisits * metricsData.conversionRate / 100),
      avgOrderValue: metricsData.avgOrderValue,
      conversionRate: metricsData.conversionRate.toFixed(2) + '%',
      growth: metricsData.avgOrderValueChange
    }

    topProducts.value = productsData
    categoryShares.value = categoriesData
  } catch (error) {
    console.error('获取销售数据失败:', error)
  }
}

onMounted(() => {
  fetchSalesData()
})
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
          <CardTitle class="text-base">热销商品</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] overflow-auto">
            <div v-if="topProducts.length > 0" class="space-y-3">
              <div v-for="(product, index) in topProducts" :key="product.id" class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <span class="w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded">{{ index + 1 }}</span>
                <div class="flex-1">
                  <p class="font-medium">{{ product.name }}</p>
                  <p class="text-xs text-muted-foreground">销量: {{ product.sales }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold">¥{{ product.revenue.toLocaleString() }}</p>
                  <p class="text-xs" :class="product.trend > 0 ? 'text-green-500' : 'text-red-500'">
                    {{ product.trend > 0 ? '+' : '' }}{{ product.trend }}%
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center text-muted-foreground h-full">
              <div class="text-center">
                <TrendingUp class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>加载中...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">品类销售占比</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] overflow-auto">
            <div v-if="categoryShares.length > 0" class="space-y-4">
              <div v-for="category in categoryShares" :key="category.name" class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span>{{ category.name }}</span>
                  <span class="font-medium">{{ category.percentage }}%</span>
                </div>
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    :class="category.color"
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: category.percentage + '%' }"
                  />
                </div>
                <p class="text-xs text-muted-foreground">¥{{ category.amount.toLocaleString() }}</p>
              </div>
            </div>
            <div v-else class="flex items-center justify-center text-muted-foreground h-full">
              <div class="text-center">
                <Package class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>加载中...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
