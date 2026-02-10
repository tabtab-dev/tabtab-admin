<script setup lang="ts">
/**
 * 流量分析页 - 优化版
 *
 * @description 网站流量分析和用户行为统计
 */
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Activity,
  ExternalLink,
  Search,
  Share2,
  Link2
} from 'lucide-vue-next'
import { StatCard, MiniChart } from '@/components/bento'
import { analyticsApi } from '@/api/modules/analytics'

/**
 * 时间范围
 */
const timeRange = ref('7d')

/**
 * 流量核心数据
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
 * 核心指标配置
 */
const metrics = computed(() => [
  {
    title: '总访问量',
    value: trafficData.value.totalVisits?.toLocaleString() ?? '0',
    change: 12.5,
    isPositive: true,
    icon: Eye,
    colorTheme: 'blue' as const,
    description: '较上周 +12.5%',
    chartData: [45, 52, 48, 65, 72, 68, 75]
  },
  {
    title: '独立访客',
    value: trafficData.value.uniqueVisitors?.toLocaleString() ?? '0',
    change: 8.3,
    isPositive: true,
    icon: Users,
    colorTheme: 'green' as const,
    description: '新访客占比 32%',
    chartData: [38, 42, 45, 48, 52, 55, 58]
  },
  {
    title: '页面浏览量',
    value: trafficData.value.pageViews?.toLocaleString() ?? '0',
    change: 15.2,
    isPositive: true,
    icon: MousePointer,
    colorTheme: 'purple' as const,
    description: '人均浏览 3.2 页',
    chartData: [55, 58, 62, 68, 72, 78, 82]
  },
  {
    title: '平均停留',
    value: trafficData.value.avgDuration,
    change: 5.1,
    isPositive: true,
    icon: Clock,
    colorTheme: 'orange' as const,
    description: '跳出率 42.3%',
    chartData: [40, 42, 45, 48, 52, 55, 58]
  }
])

/**
 * 访问来源数据
 */
const trafficSources = ref([
  { name: '直接访问', percentage: 35, visits: 15831, icon: ExternalLink, color: 'bg-blue-500' },
  { name: '搜索引擎', percentage: 28, visits: 12665, icon: Search, color: 'bg-green-500' },
  { name: '社交媒体', percentage: 22, visits: 9951, icon: Share2, color: 'bg-purple-500' },
  { name: '外部链接', percentage: 15, visits: 6785, icon: Link2, color: 'bg-orange-500' }
])

/**
 * 设备分布数据
 */
const deviceData = ref([
  { name: '桌面端', percentage: 58, visits: 26234, icon: Monitor, color: 'bg-blue-500' },
  { name: '移动端', percentage: 35, visits: 15831, icon: Smartphone, color: 'bg-green-500' },
  { name: '平板', percentage: 7, visits: 3166, icon: Tablet, color: 'bg-purple-500' }
])

/**
 * 地域分布数据
 */
const regionData = ref([
  { name: '北京', visits: 12580, percentage: 28 },
  { name: '上海', visits: 9876, percentage: 22 },
  { name: '广州', visits: 6789, percentage: 15 },
  { name: '深圳', visits: 5432, percentage: 12 },
  { name: '杭州', visits: 4321, percentage: 10 }
])

/**
 * 热门页面数据
 */
const topPages = ref([
  { path: '/products', title: '商品列表', visits: 12580, avgTime: '2m 35s', bounceRate: 32 },
  { path: '/home', title: '首页', visits: 9876, avgTime: '1m 48s', bounceRate: 28 },
  { path: '/cart', title: '购物车', visits: 6789, avgTime: '3m 12s', bounceRate: 45 },
  { path: '/checkout', title: '结算页', visits: 5432, avgTime: '4m 05s', bounceRate: 52 },
  { path: '/about', title: '关于我们', visits: 3210, avgTime: '1m 20s', bounceRate: 65 }
])

/**
 * 24小时访问分布
 */
const hourlyData = ref([
  { hour: '00:00', visits: 120 },
  { hour: '02:00', visits: 80 },
  { hour: '04:00', visits: 60 },
  { hour: '06:00', visits: 150 },
  { hour: '08:00', visits: 450 },
  { hour: '10:00', visits: 680 },
  { hour: '12:00', visits: 850 },
  { hour: '14:00', visits: 720 },
  { hour: '16:00', visits: 650 },
  { hour: '18:00', visits: 580 },
  { hour: '20:00', visits: 920 },
  { hour: '22:00', visits: 480 }
])

/**
 * 获取流量数据
 */
const fetchTrafficData = async () => {
  try {
    const [metricsData, trendData] = await Promise.all([
      analyticsApi.getCoreMetrics(timeRange.value),
      analyticsApi.getTrafficData(timeRange.value)
    ])

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

/**
 * 处理时间范围切换
 */
const handleTimeRangeChange = (value: string) => {
  timeRange.value = value
  fetchTrafficData()
}

onMounted(() => {
  fetchTrafficData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">流量分析</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">分析网站访问流量和用户行为</p>
      </div>
      <div class="flex items-center gap-2">
        <Tabs :model-value="timeRange" @update:model-value="handleTimeRangeChange">
          <TabsList class="h-9">
            <TabsTrigger value="7d" class="text-xs">近7天</TabsTrigger>
            <TabsTrigger value="30d" class="text-xs">近30天</TabsTrigger>
            <TabsTrigger value="90d" class="text-xs">近90天</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" class="gap-2">
          <Download class="h-4 w-4" />
          导出报告
        </Button>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        v-for="metric in metrics"
        :key="metric.title"
        :title="metric.title"
        :value="metric.value"
        :description="metric.description"
        :icon="metric.icon"
        :color-theme="metric.colorTheme"
        :trend="metric.change"
        :chart-data="metric.chartData"
      />
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 访问趋势 -->
      <Card class="bg-muted/40 border border-border/50 rounded-xl">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold flex items-center gap-2">
                <BarChart3 class="h-4 w-4 text-muted-foreground" />
                访问趋势
              </CardTitle>
              <CardDescription>过去 7 天的访问量和订单量</CardDescription>
            </div>
            <Badge variant="outline" class="text-green-500 border-green-500/20 bg-green-500/10">
              <TrendingUp class="h-3 w-3 mr-1" />
              +{{ trafficData.growth }}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="h-64 flex items-end justify-between gap-3">
            <div
              v-for="(item, index) in trafficTrendData"
              :key="index"
              class="flex-1 flex flex-col items-center gap-2"
            >
              <div class="w-full flex flex-col gap-1">
                <!-- 访问量柱状图 -->
                <div
                  class="w-full bg-primary/20 rounded-t transition-all hover:bg-primary/40 relative group"
                  :style="{ height: `${(item.visits / 10000) * 150}px` }"
                >
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                    {{ item.visits?.toLocaleString() ?? 0 }} 访问
                  </div>
                </div>
                <!-- 订单量柱状图 -->
                <div
                  class="w-full bg-orange-400/30 rounded-t transition-all hover:bg-orange-400/50"
                  :style="{ height: `${(item.orders / 250) * 40}px` }"
                />
              </div>
              <span class="text-xs text-muted-foreground">{{ item.day }}</span>
            </div>
          </div>
          <div class="flex items-center justify-center gap-6 mt-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-primary/20 rounded" />
              <span class="text-muted-foreground">访问量</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-orange-400/30 rounded" />
              <span class="text-muted-foreground">订单量</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 24小时分布 -->
      <Card class="bg-muted/40 border border-border/50 rounded-xl">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold flex items-center gap-2">
                <Clock class="h-4 w-4 text-muted-foreground" />
                时段分布
              </CardTitle>
              <CardDescription>24小时访问量分布</CardDescription>
            </div>
            <Badge variant="outline" class="text-blue-500 border-blue-500/20 bg-blue-500/10">
              <Activity class="h-3 w-3 mr-1" />
              高峰 20:00
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="h-64 flex items-end justify-between gap-2">
            <div
              v-for="(item, index) in hourlyData"
              :key="index"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <div
                class="w-full bg-blue-500/20 rounded-t transition-all hover:bg-blue-500/40 relative group"
                :style="{ height: `${(item.visits / 1000) * 150}px` }"
              >
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                  {{ item.visits }} 次
                </div>
              </div>
              <span class="text-xs text-muted-foreground">{{ item.hour }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 来源、设备、地域分析 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 访问来源 -->
      <Card class="bg-muted/40 border border-border/50 rounded-xl">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold flex items-center gap-2">
                <PieChart class="h-4 w-4 text-muted-foreground" />
                访问来源
              </CardTitle>
              <CardDescription>用户访问渠道分布</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="space-y-4">
            <div
              v-for="(source, index) in trafficSources"
              :key="source.name"
              class="space-y-2"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div :class="['p-1.5 rounded-lg', source.color.replace('bg-', 'bg-').replace('500', '500/10')]">
                    <component :is="source.icon" :class="['h-4 w-4', source.color.replace('bg-', 'text-')]" />
                  </div>
                  <span class="text-sm font-medium">{{ source.name }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-muted-foreground">{{ source.visits?.toLocaleString() ?? 0 }}</span>
                  <span class="text-sm font-medium w-10 text-right">{{ source.percentage }}%</span>
                </div>
              </div>
              <div class="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  :class="['h-full rounded-full transition-all duration-500', source.color]"
                  :style="{ width: `${source.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 设备分布 -->
      <Card class="bg-muted/40 border border-border/50 rounded-xl">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold flex items-center gap-2">
                <Monitor class="h-4 w-4 text-muted-foreground" />
                设备分布
              </CardTitle>
              <CardDescription>用户设备类型占比</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="space-y-4">
            <div
              v-for="(device, index) in deviceData"
              :key="device.name"
              class="space-y-2"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div :class="['p-1.5 rounded-lg', device.color.replace('bg-', 'bg-').replace('500', '500/10')]">
                    <component :is="device.icon" :class="['h-4 w-4', device.color.replace('bg-', 'text-')]" />
                  </div>
                  <span class="text-sm font-medium">{{ device.name }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-muted-foreground">{{ device.visits?.toLocaleString() ?? 0 }}</span>
                  <span class="text-sm font-medium w-10 text-right">{{ device.percentage }}%</span>
                </div>
              </div>
              <div class="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  :class="['h-full rounded-full transition-all duration-500', device.color]"
                  :style="{ width: `${device.percentage}%` }"
                />
              </div>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t">
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="p-2 bg-muted/50 rounded-lg">
                <p class="text-lg font-semibold">1920</p>
                <p class="text-xs text-muted-foreground">平均分辨率</p>
              </div>
              <div class="p-2 bg-muted/50 rounded-lg">
                <p class="text-lg font-semibold">Chrome</p>
                <p class="text-xs text-muted-foreground">主流浏览器</p>
              </div>
              <div class="p-2 bg-muted/50 rounded-lg">
                <p class="text-lg font-semibold">Win10</p>
                <p class="text-xs text-muted-foreground">主流系统</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 地域分布 -->
      <Card class="bg-muted/40 border border-border/50 rounded-xl">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold flex items-center gap-2">
                <MapPin class="h-4 w-4 text-muted-foreground" />
                地域分布
              </CardTitle>
              <CardDescription>访问量 TOP 5 地区</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="space-y-3">
            <div
              v-for="(region, index) in regionData"
              :key="region.name"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-8 h-8 flex items-center justify-center rounded-lg font-medium text-sm',
                    index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <span class="font-medium text-sm">{{ region.name }}</span>
              </div>
              <div class="text-right">
                <p class="font-medium">{{ region.visits?.toLocaleString() ?? 0 }}</p>
                <p class="text-xs text-muted-foreground">{{ region.percentage }}%</p>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">覆盖全国</span>
              <span class="font-medium">31 个省市</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 热门页面 -->
    <Card class="bg-muted/40 border border-border/50 rounded-xl">
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-base font-semibold flex items-center gap-2">
              <Globe class="h-4 w-4 text-muted-foreground" />
              热门页面
            </CardTitle>
            <CardDescription>访问量最高的页面排行</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-sm font-medium text-muted-foreground">排名</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-muted-foreground">页面路径</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-muted-foreground">页面标题</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-muted-foreground">访问量</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-muted-foreground">平均停留</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-muted-foreground">跳出率</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(page, index) in topPages"
                :key="page.path"
                class="border-b last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td class="py-3 px-4">
                  <div
                    :class="[
                      'w-6 h-6 flex items-center justify-center rounded font-medium text-xs',
                      index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    ]"
                  >
                    {{ index + 1 }}
                  </div>
                </td>
                <td class="py-3 px-4 text-sm font-mono text-muted-foreground">{{ page.path }}</td>
                <td class="py-3 px-4 text-sm font-medium">{{ page.title }}</td>
                <td class="py-3 px-4 text-right text-sm">{{ page.visits?.toLocaleString() ?? 0 }}</td>
                <td class="py-3 px-4 text-right text-sm">{{ page.avgTime }}</td>
                <td class="py-3 px-4 text-right">
                  <Badge
                    :variant="page.bounceRate > 50 ? 'destructive' : 'secondary'"
                    class="text-xs"
                  >
                    {{ page.bounceRate }}%
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
