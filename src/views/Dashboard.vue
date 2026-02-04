<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  MasonryGrid, 
  HeroCard, 
  StatCard, 
  ActivityCard, 
  QuickActions,
  MiniChart,
  ProgressRing 
} from '@/components/bento';
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Activity, 
  Settings, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Package, 
  Clock,
  Calendar,
  Bell,
  Sparkles,
  ArrowUpRight,
  Zap
} from 'lucide-vue-next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ActivityItem, QuickAction } from '@/types/bento';

/**
 * 当前日期格式化
 */
const currentDate = computed(() => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  };
  return date.toLocaleDateString('zh-CN', options);
});

/**
 * 问候语
 */
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
});

/**
 * 活动列表数据
 */
const activities = ref<ActivityItem[]>([
  { id: '1', type: 'success', title: '新用户注册', description: '用户 user@example.com 完成注册', time: '2 分钟前' },
  { id: '2', type: 'info', title: '订单更新', description: '订单 #12345 状态已更新为已发货', time: '15 分钟前' },
  { id: '3', type: 'warning', title: '库存预警', description: '商品 SKU-001 库存低于阈值', time: '1 小时前' },
  { id: '4', type: 'success', title: '支付成功', description: '收到支付 $299.00', time: '2 小时前' },
  { id: '5', type: 'error', title: '系统错误', description: 'API 响应超时', time: '3 小时前' },
  { id: '6', type: 'success', title: '退款完成', description: '订单 #12340 退款已处理', time: '4 小时前' }
]);

/**
 * 快捷操作列表
 */
const quickActions = ref<QuickAction[]>([
  { id: '1', label: '新建订单', icon: ShoppingCart, onClick: () => console.log('新建订单'), variant: 'primary' },
  { id: '2', label: '添加用户', icon: Users, onClick: () => console.log('添加用户'), variant: 'default' },
  { id: '3', label: '生成报表', icon: FileText, onClick: () => console.log('生成报表'), variant: 'default' },
  { id: '4', label: '系统设置', icon: Settings, onClick: () => console.log('系统设置'), variant: 'default' }
]);

/**
 * 核心指标数据
 */
const metrics = ref([
  { 
    title: '总用户数', 
    value: '12,847', 
    change: 12.5, 
    icon: Users, 
    description: '活跃用户占比 68%',
    colorTheme: 'blue' as const,
    chartData: [45, 52, 48, 65, 72, 68, 75, 82, 78, 85, 88, 92]
  },
  { 
    title: '总收入', 
    value: '$84,230', 
    change: 8.2, 
    icon: DollarSign, 
    description: '本月目标完成率 92%',
    colorTheme: 'green' as const,
    chartData: [60, 65, 58, 70, 75, 72, 80, 85, 82, 88, 90, 95]
  },
  { 
    title: '订单数', 
    value: '3,421', 
    change: -2.4, 
    icon: ShoppingCart, 
    description: '待处理订单 156',
    colorTheme: 'orange' as const,
    chartData: [70, 68, 72, 65, 60, 58, 62, 65, 68, 70, 72, 75]
  },
  { 
    title: '转化率', 
    value: '4.28%', 
    change: 1.8, 
    icon: TrendingUp, 
    description: '高于行业平均 15%',
    colorTheme: 'purple' as const,
    chartData: [35, 38, 42, 40, 45, 48, 52, 50, 55, 58, 60, 65]
  }
]);

/**
 * 系统状态数据
 */
const systemStatus = ref([
  { name: 'API 服务', status: 'running', uptime: '99.9%' },
  { name: '数据库', status: 'running', uptime: '99.8%' },
  { name: '缓存服务', status: 'running', uptime: '99.9%' },
  { name: '消息队列', status: 'running', uptime: '99.5%' }
]);

/**
 * 待处理事项
 */
const pendingTasks = ref([
  { label: '库存预警', count: 5, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { label: '待审核订单', count: 12, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { label: '待处理退款', count: 2, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { label: '系统通知', count: 8, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' }
]);
</script>

<template>
  <div class="space-y-6">
    <!-- 顶部欢迎区域 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <Avatar class="h-14 w-14 border-2 border-primary/20">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
          <AvatarFallback class="bg-primary/10 text-primary text-lg">AD</AvatarFallback>
        </Avatar>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold">{{ greeting }}，管理员</h1>
            <Sparkles class="h-5 w-5 text-amber-500" />
          </div>
          <p class="text-muted-foreground text-sm mt-0.5 flex items-center gap-2">
            <Calendar class="h-4 w-4" />
            {{ currentDate }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <Button variant="outline" size="sm" class="gap-2">
          <Bell class="h-4 w-4" />
          <span class="hidden sm:inline">通知</span>
          <Badge variant="secondary" class="ml-1">3</Badge>
        </Button>
        <Button size="sm" class="gap-2">
          <Zap class="h-4 w-4" />
          <span class="hidden sm:inline">快速操作</span>
        </Button>
      </div>
    </div>

    <!-- 核心指标卡片 - 使用网格布局 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        v-for="(metric, index) in metrics"
        :key="index"
        :title="metric.title"
        :value="metric.value"
        :description="metric.description"
        :icon="metric.icon"
        :color-theme="metric.colorTheme"
        :trend="metric.change"
        :chart-data="metric.chartData"
      />
    </div>

    <!-- 瀑布流布局 - 其他内容 -->
    <MasonryGrid :columns="{ default: 1, sm: 1, md: 2, lg: 3, xl: 3 }" gap="md">
      <!-- HeroCard - 仪表板概览 -->
      <HeroCard
        title="本月业绩"
        description="实时监控业务数据和核心指标"
        value="$84,230"
        :trend="{ value: 12.5, isPositive: true }"
        :icon="Activity"
        :action="{ label: '查看详细报告', onClick: () => console.log('查看报告') }"
      >
        <div class="grid grid-cols-3 gap-3 mt-2">
          <div class="text-center p-3 bg-white/10 backdrop-blur-sm" :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }">
            <p class="text-xs text-white/70">本周收入</p>
            <p class="text-lg font-semibold text-white">$18.5k</p>
          </div>
          <div class="text-center p-3 bg-white/10 backdrop-blur-sm" :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }">
            <p class="text-xs text-white/70">本周订单</p>
            <p class="text-lg font-semibold text-white">856</p>
          </div>
          <div class="text-center p-3 bg-white/10 backdrop-blur-sm" :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }">
            <p class="text-xs text-white/70">新客户</p>
            <p class="text-lg font-semibold text-white">128</p>
          </div>
        </div>
      </HeroCard>

      <!-- 最近活动 -->
      <ActivityCard title="最近动态" :items="activities" :max-items="6" />

      <!-- 快捷操作 -->
      <QuickActions title="快捷入口" :actions="quickActions" />

      <!-- 系统状态 -->
      <div class="bg-card border border-border/40 shadow-none p-5" :style="{ borderRadius: 'calc(var(--radius))' }">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">系统状态</h3>
          <Badge variant="outline" class="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
            <div class="w-1.5 h-1.5 bg-emerald-500 mr-1.5 animate-pulse" :style="{ borderRadius: 'calc(var(--radius) * 0.3)' }" />
            正常运行
          </Badge>
        </div>
        <div class="space-y-3">
          <div
            v-for="service in systemStatus"
            :key="service.name"
            class="flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
            :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-emerald-500" :style="{ borderRadius: 'calc(var(--radius) * 0.3)' }" />
              <span class="text-sm font-medium">{{ service.name }}</span>
            </div>
            <span class="text-xs text-muted-foreground">可用率 {{ service.uptime }}</span>
          </div>
        </div>
      </div>

      <!-- 待处理事项 -->
      <div class="bg-card border border-border/40 shadow-none p-5" :style="{ borderRadius: 'calc(var(--radius))' }">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">待处理事项</h3>
          <Badge variant="secondary">{{ pendingTasks.reduce((acc, t) => acc + t.count, 0) }}</Badge>
        </div>
        <div class="space-y-2">
          <div
            v-for="task in pendingTasks"
            :key="task.label"
            class="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors cursor-pointer group"
            :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-8 h-8 flex items-center justify-center', task.bgColor]" :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }">
                <AlertCircle :class="['h-4 w-4', task.color]" />
              </div>
              <span class="text-sm">{{ task.label }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span :class="['text-sm font-semibold', task.color]">{{ task.count }}</span>
              <ArrowUpRight class="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>

      <!-- 本周趋势 -->
      <div class="bg-card border border-border/40 shadow-none p-5" :style="{ borderRadius: 'calc(var(--radius))' }">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold">本周趋势</h3>
            <p class="text-xs text-muted-foreground mt-0.5">过去 7 天数据变化</p>
          </div>
          <Badge variant="default" class="gap-1">
            <TrendingUp class="h-3 w-3" />
            +5.3%
          </Badge>
        </div>
        <MiniChart
          type="line"
          :data="[45, 52, 48, 65, 72, 68, 75]"
          color="bg-primary"
          :height="80"
        />
        <div class="flex justify-between text-xs text-muted-foreground mt-3">
          <span>周一</span>
          <span>周三</span>
          <span>周五</span>
          <span>周日</span>
        </div>
      </div>

      <!-- 订单状态分布 -->
      <div class="bg-card border border-border/40 shadow-none p-5" :style="{ borderRadius: 'calc(var(--radius))' }">
        <h3 class="font-semibold mb-4">订单状态</h3>
        <div class="flex items-center justify-center mb-4">
          <ProgressRing :progress="75" color="text-primary" :size="100" :stroke-width="10" text="75%" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="text-center p-2 bg-muted/50" :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }">
            <p class="text-lg font-semibold">28</p>
            <p class="text-xs text-muted-foreground">新订单</p>
          </div>
          <div class="text-center p-2 bg-muted/50" :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }">
            <p class="text-lg font-semibold">15</p>
            <p class="text-xs text-muted-foreground">处理中</p>
          </div>
          <div class="text-center p-2 bg-muted/50" :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }">
            <p class="text-lg font-semibold">8</p>
            <p class="text-xs text-muted-foreground">配送中</p>
          </div>
          <div class="text-center p-2 bg-muted/50" :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }">
            <p class="text-lg font-semibold">42</p>
            <p class="text-xs text-muted-foreground">已完成</p>
          </div>
        </div>
      </div>

      <!-- 处理效率 -->
      <div class="bg-card border border-border/40 shadow-none p-5" :style="{ borderRadius: 'calc(var(--radius))' }">
        <h3 class="font-semibold mb-4">平均处理时间</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-muted-foreground">支付处理</span>
              <span class="font-medium">2.3 秒</span>
            </div>
            <div class="h-2 bg-muted overflow-hidden" :style="{ borderRadius: 'calc(var(--radius) * 0.3)' }">
              <div class="h-full bg-emerald-500 transition-all duration-1000" style="width: 85%; borderRadius: calc(var(--radius) * 0.3)" />
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-muted-foreground">订单确认</span>
              <span class="font-medium">5.1 秒</span>
            </div>
            <div class="h-2 bg-muted overflow-hidden" :style="{ borderRadius: 'calc(var(--radius) * 0.3)' }">
              <div class="h-full bg-blue-500 transition-all duration-1000" style="width: 70%; borderRadius: calc(var(--radius) * 0.3)" />
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-muted-foreground">发货处理</span>
              <span class="font-medium">12.5 分钟</span>
            </div>
            <div class="h-2 bg-muted overflow-hidden" :style="{ borderRadius: 'calc(var(--radius) * 0.3)' }">
              <div class="h-full bg-amber-500 transition-all duration-1000" style="width: 60%; borderRadius: calc(var(--radius) * 0.3)" />
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-muted-foreground">客户响应</span>
              <span class="font-medium">3.2 分钟</span>
            </div>
            <div class="h-2 bg-muted overflow-hidden" :style="{ borderRadius: 'calc(var(--radius) * 0.3)' }">
              <div class="h-full bg-purple-500 transition-all duration-1000" style="width: 90%; borderRadius: calc(var(--radius) * 0.3)" />
            </div>
          </div>
        </div>
      </div>
    </MasonryGrid>
  </div>
</template>
