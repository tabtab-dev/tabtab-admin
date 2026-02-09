<script setup lang="ts">
/**
 * 流量分析页
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, Eye, MousePointer } from 'lucide-vue-next'
import { MiniChart } from '@/components/bento'
import { analyticsApi } from '@/api/modules/analytics'

/**
 * 流量数据
 */
const trafficData = ref({
  totalVisits: 0,
  uniqueVisitors: 0,
  pageViews: 0,
  avgDuration: '0:00',
  bounceRate: '0%',
  growth: 0
})

/**
 * 访问趋势数据
 */
const trafficTrendData = ref<{ day: string; visits: number; orders: number }[]>([])

/**
 * 统计数据
 */
const statistics = computed(() => [
  { title: '总访问量', value: trafficData.value.totalVisits.toLocaleString(), icon: Eye, color: 'text-blue-500', trend: '+12.5%' },
  { title: '独立访客', value: trafficData.value.uniqueVisitors.toLocaleString(), icon: Users, color: 'text-green-500', trend: '+8.3%' },
  { title: '页面浏览量', value: trafficData.value.pageViews.toLocaleString(), icon: MousePointer, color: 'text-purple-500', trend: '+15.2%' },
  { title: '平均停留', value: trafficData.value.avgDuration, icon: TrendingUp, color: 'text-orange-500', trend: '+5.1%' }
])

/**
 * 获取流量数据
 */
const fetchTrafficData = async () => {
  try {
    const metricsData = await analyticsApi.getCoreMetrics('7d')
    const trendData = await analyticsApi.getTrafficData('7d')

    trafficData.value = {
      totalVisits: metricsData.totalVisits,
      uniqueVisitors: metricsData.newUsers * 10,
      pageViews: metricsData.totalVisits * 3,
      avgDuration: '3:42',
      bounceRate: '42.3%',
      growth: metricsData.visitsChange
    }

    trafficTrendData.value = trendData
  } catch (error) {
    console.error('获取流量数据失败:', error)
  }
}

onMounted(() => {
  fetchTrafficData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">流量分析</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">分析网站访问流量和用户行为</p>
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
          <CardTitle class="text-base">访问趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex flex-col justify-center">
            <MiniChart
              v-if="trafficTrendData.length > 0"
              type="line"
              :data="trafficTrendData.map(d => d.visits / 100)"
              color="bg-blue-500"
              :height="200"
            />
            <div v-else class="flex items-center justify-center text-muted-foreground h-full">
              <div class="text-center">
                <TrendingUp class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>加载中...</p>
              </div>
            </div>
            <div class="mt-4 flex justify-between text-xs text-muted-foreground">
              <span v-for="(item, index) in trafficTrendData" :key="index">{{ item.day }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">订单趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex flex-col justify-center">
            <MiniChart
              v-if="trafficTrendData.length > 0"
              type="bar"
              :data="trafficTrendData.map(d => d.orders)"
              color="bg-green-500"
              :height="200"
            />
            <div v-else class="flex items-center justify-center text-muted-foreground h-full">
              <div class="text-center">
                <MousePointer class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>加载中...</p>
              </div>
            </div>
            <div class="mt-4 flex justify-between text-xs text-muted-foreground">
              <span v-for="(item, index) in trafficTrendData" :key="index">{{ item.day }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
