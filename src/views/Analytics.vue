<script setup lang="ts">
/**
 * 数据分析页 - 优化版
 *
 * @description 业务数据分析和趋势展示
 */
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-vue-next'

// 时间范围
const _timeRange = ref('7d')

// 核心指标
const metrics = computed(() => [
  {
    title: '总访问量',
    value: '45,231',
    change: 12.5,
    isPositive: true,
    icon: Eye,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    title: '新用户',
    value: '2,847',
    change: 8.2,
    isPositive: true,
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  {
    title: '转化率',
    value: '3.28%',
    change: -1.2,
    isPositive: false,
    icon: TrendingUp,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  {
    title: '平均订单价值',
    value: '¥127.50',
    change: 5.8,
    isPositive: true,
    icon: DollarSign,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50'
  }
])

// 热销商品
const topProducts = ref([
  { name: '高级无线耳机', sales: 342, revenue: 102258, trend: 15 },
  { name: '智能手表 Pro', sales: 187, revenue: 112013, trend: 8 },
  { name: '便携式充电宝', sales: 156, revenue: 7644, trend: -5 },
  { name: '蓝牙音箱', sales: 89, revenue: 11481, trend: 12 },
  { name: 'USB-C 数据线', sales: 67, revenue: 1273, trend: 3 }
])

// 分类占比
const topCategories = ref([
  { name: '电子产品', percentage: 45, color: 'bg-blue-500', amount: 224500 },
  { name: '配件', percentage: 28, color: 'bg-green-500', amount: 139600 },
  { name: '音频设备', percentage: 18, color: 'bg-purple-500', amount: 89800 },
  { name: '其他', percentage: 9, color: 'bg-orange-500', amount: 44900 }
])

// 访问趋势数据
const trafficData = ref([
  { day: '周一', visits: 5200, orders: 120 },
  { day: '周二', visits: 6100, orders: 145 },
  { day: '周三', visits: 5800, orders: 132 },
  { day: '周四', visits: 7200, orders: 168 },
  { day: '周五', visits: 8100, orders: 195 },
  { day: '周六', visits: 9500, orders: 230 },
  { day: '周日', visits: 8800, orders: 210 }
])

// 用户行为数据
const userBehavior = ref([
  { label: '平均会话时长', value: '4m 32s', change: 12, isPositive: true },
  { label: '跳出率', value: '32.5%', change: 3.2, isPositive: false },
  { label: '页面浏览量', value: '128,456', change: 8.5, isPositive: true },
  { label: '回访率', value: '45.8%', change: 2.1, isPositive: true }
])
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">数据分析</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">查看业务数据和趋势分析</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="gap-2">
          <Calendar class="h-4 w-4" />
          选择日期
        </Button>
        <Button variant="outline" size="sm" class="gap-2">
          <Download class="h-4 w-4" />
          导出报告
        </Button>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card
        v-for="metric in metrics"
        :key="metric.title"
        class="border-0 shadow-sm hover:shadow-md transition-shadow"
      >
        <CardContent class="p-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div :class="['p-2.5 rounded-xl', metric.bgColor]">
                <component :is="metric.icon" :class="['h-5 w-5', metric.color]" />
              </div>
              <div>
                <p class="text-sm text-muted-foreground">{{ metric.title }}</p>
                <p class="text-xl font-bold">{{ metric.value }}</p>
              </div>
            </div>
            <div
              :class="[
                'flex items-center gap-0.5 text-xs font-medium',
                metric.isPositive ? 'text-green-500' : 'text-red-500'
              ]"
            >
              <component :is="metric.isPositive ? ArrowUpRight : ArrowDownRight" class="h-3 w-3" />
              {{ Math.abs(metric.change) }}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 访问趋势 -->
      <Card class="border-0 shadow-sm">
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
              +15.3%
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="h-64 flex items-end justify-between gap-3">
            <div
              v-for="(item, index) in trafficData"
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
                    {{ item.visits.toLocaleString() }} 访问
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

      <!-- 分类占比 -->
      <Card class="border-0 shadow-sm">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold flex items-center gap-2">
                <PieChart class="h-4 w-4 text-muted-foreground" />
                分类销售占比
              </CardTitle>
              <CardDescription>各分类的销售金额占比</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="space-y-4">
            <div
              v-for="(category, index) in topCategories"
              :key="category.name"
              class="space-y-2"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium w-6 text-muted-foreground">{{ index + 1 }}</span>
                  <span class="text-sm font-medium">{{ category.name }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-muted-foreground">¥{{ category.amount.toLocaleString() }}</span>
                  <span class="text-sm font-medium w-10 text-right">{{ category.percentage }}%</span>
                </div>
              </div>
              <div class="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  :class="['h-full rounded-full transition-all duration-500', category.color]"
                  :style="{ width: `${category.percentage}%` }"
                />
              </div>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">总销售额</span>
              <span class="font-bold text-lg">¥{{ topCategories.reduce((sum, c) => sum + c.amount, 0).toLocaleString() }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 热销商品 & 用户行为 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 热销商品 -->
      <Card class="border-0 shadow-sm">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold flex items-center gap-2">
                <ShoppingCart class="h-4 w-4 text-muted-foreground" />
                热销商品
              </CardTitle>
              <CardDescription>按销量排序的 TOP 5 商品</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="space-y-3">
            <div
              v-for="(product, index) in topProducts"
              :key="index"
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
                <div>
                  <p class="font-medium text-sm">{{ product.name }}</p>
                  <p class="text-xs text-muted-foreground">销量: {{ product.sales }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium">¥{{ product.revenue.toLocaleString() }}</p>
                <p
                  :class="[
                    'text-xs flex items-center justify-end gap-0.5',
                    product.trend > 0 ? 'text-green-500' : 'text-red-500'
                  ]"
                >
                  <component :is="product.trend > 0 ? ArrowUpRight : ArrowDownRight" class="h-3 w-3" />
                  {{ Math.abs(product.trend) }}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 用户行为 -->
      <Card class="border-0 shadow-sm">
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base font-semibold flex items-center gap-2">
                <Activity class="h-4 w-4 text-muted-foreground" />
                用户行为
              </CardTitle>
              <CardDescription>用户活动统计数据</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="item in userBehavior"
              :key="item.label"
              class="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <p class="text-sm text-muted-foreground">{{ item.label }}</p>
              <p class="text-xl font-bold mt-1">{{ item.value }}</p>
              <p
                :class="[
                  'text-xs flex items-center gap-0.5 mt-1',
                  item.isPositive ? 'text-green-500' : 'text-red-500'
                ]"
              >
                <component :is="item.isPositive ? ArrowUpRight : ArrowDownRight" class="h-3 w-3" />
                {{ item.change }}% 较上周
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
