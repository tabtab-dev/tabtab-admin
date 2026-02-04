<script setup lang="ts">
import { ref } from 'vue';
import { BentoGrid, FeatureCard, SupportingCard } from '@/components/bento';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye, Download, Calendar } from 'lucide-vue-next';

const timeRange = ref('7d');

const metrics = ref([
  {
    title: '总访问量',
    value: '45,231',
    change: 12.5,
    isPositive: true,
    icon: Eye
  },
  {
    title: '新用户',
    value: '2,847',
    change: 8.2,
    isPositive: true,
    icon: Users
  },
  {
    title: '转化率',
    value: '3.28%',
    change: -1.2,
    isPositive: false,
    icon: TrendingUp
  },
  {
    title: '平均订单价值',
    value: '$127.50',
    change: 5.8,
    isPositive: true,
    icon: DollarSign
  }
]);

const topProducts = ref([
  { name: '高级无线耳机', sales: 342, revenue: 102258 },
  { name: '智能手表 Pro', sales: 187, revenue: 112013 },
  { name: '便携式充电宝', sales: 156, revenue: 7644 },
  { name: '蓝牙音箱', sales: 89, revenue: 11481 },
  { name: 'USB-C 数据线', sales: 67, revenue: 1273 }
]);

const topCategories = ref([
  { name: '电子产品', percentage: 45, color: 'bg-blue-500' },
  { name: '配件', percentage: 28, color: 'bg-green-500' },
  { name: '音频设备', percentage: 18, color: 'bg-purple-500' },
  { name: '其他', percentage: 9, color: 'bg-orange-500' }
]);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">数据分析</h1>
        <p class="text-muted-foreground mt-1">查看业务数据和趋势分析</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Calendar class="h-4 w-4 mr-2" />
          选择日期
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4 mr-2" />
          导出报告
        </Button>
      </div>
    </div>

    <BentoGrid :columns="4" gap="md">
      <FeatureCard
        v-for="(metric, index) in metrics"
        :key="index"
        :title="metric.title"
        :value="metric.value"
        :trend="{ value: Math.abs(metric.change), isPositive: metric.isPositive }"
        :icon="metric.icon"
        size="md"
      />
    </BentoGrid>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>访问趋势</CardTitle>
          <CardDescription>过去 7 天的访问量变化</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-64 flex items-end justify-between gap-2">
            <div v-for="i in 7" :key="i" class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-primary/20 rounded-t transition-all hover:bg-primary/40" :style="{ height: `${30 + Math.random() * 70}%` }"></div>
              <span class="text-xs text-muted-foreground">{{ ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i - 1] }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>分类占比</CardTitle>
          <CardDescription>各分类的销售占比</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="category in topCategories" :key="category.name" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">{{ category.name }}</span>
                <span class="text-sm text-muted-foreground">{{ category.percentage }}%</span>
              </div>
              <div class="h-2 bg-muted rounded-full overflow-hidden">
                <div :class="['h-full rounded-full transition-all', category.color]" :style="{ width: `${category.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>热销商品</CardTitle>
          <CardDescription>按销量排序的商品</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(product, index) in topProducts"
              :key="index"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <Badge variant="outline" class="w-8 h-8 flex items-center justify-center rounded-full">
                  {{ index + 1 }}
                </Badge>
                <div>
                  <p class="font-medium">{{ product.name }}</p>
                  <p class="text-sm text-muted-foreground">销量: {{ product.sales }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium">${{ product.revenue.toLocaleString() }}</p>
                <p class="text-xs text-muted-foreground">收入</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>用户行为</CardTitle>
          <CardDescription>用户活动统计</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-lg bg-muted/50">
                <p class="text-sm text-muted-foreground">平均会话时长</p>
                <p class="text-2xl font-bold mt-1">4m 32s</p>
                <p class="text-xs text-green-500 mt-1">↑ 12% 较上周</p>
              </div>
              <div class="p-4 rounded-lg bg-muted/50">
                <p class="text-sm text-muted-foreground">跳出率</p>
                <p class="text-2xl font-bold mt-1">32.5%</p>
                <p class="text-xs text-red-500 mt-1">↑ 3.2% 较上周</p>
              </div>
              <div class="p-4 rounded-lg bg-muted/50">
                <p class="text-sm text-muted-foreground">页面浏览量</p>
                <p class="text-2xl font-bold mt-1">128,456</p>
                <p class="text-xs text-green-500 mt-1">↑ 8.5% 较上周</p>
              </div>
              <div class="p-4 rounded-lg bg-muted/50">
                <p class="text-sm text-muted-foreground">回访率</p>
                <p class="text-2xl font-bold mt-1">45.8%</p>
                <p class="text-xs text-green-500 mt-1">↑ 2.1% 较上周</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
