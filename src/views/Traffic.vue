<script setup lang="ts">
/**
 * 流量分析页
 */
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, Eye, MousePointer } from 'lucide-vue-next'

const trafficData = ref({
  totalVisits: 45231,
  uniqueVisitors: 28456,
  pageViews: 128456,
  avgDuration: '3:42',
  bounceRate: '42.3%',
  growth: 12.5
})

const statistics = computed(() => [
  { title: '总访问量', value: trafficData.value.totalVisits.toLocaleString(), icon: Eye, color: 'text-blue-500', trend: '+12.5%' },
  { title: '独立访客', value: trafficData.value.uniqueVisitors.toLocaleString(), icon: Users, color: 'text-green-500', trend: '+8.3%' },
  { title: '页面浏览量', value: trafficData.value.pageViews.toLocaleString(), icon: MousePointer, color: 'text-purple-500', trend: '+15.2%' },
  { title: '平均停留', value: trafficData.value.avgDuration, icon: TrendingUp, color: 'text-orange-500', trend: '+5.1%' }
])
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
          <div class="h-[300px] flex items-center justify-center text-muted-foreground">
            <div class="text-center">
              <TrendingUp class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>访问趋势图表</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">来源分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center text-muted-foreground">
            <div class="text-center">
              <MousePointer class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>流量来源分布</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
