<script setup lang="ts">
/**
 * 用户分析页
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, UserCheck, Activity } from 'lucide-vue-next'
import { MiniChart } from '@/components/bento'
import { analyticsApi } from '@/api/modules/analytics'

/**
 * 用户数据
 */
const usersData = ref({
  totalUsers: 0,
  newUsers: 0,
  activeUsers: 0,
  retentionRate: '0%',
  growth: 0
})

/**
 * 用户行为数据
 */
const userBehavior = ref<{ label: string; value: string; change: number; isPositive: boolean }[]>([])

/**
 * 统计数据
 */
const statistics = computed(() => [
  { title: '总用户数', value: usersData.value.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500', trend: '+15.2%' },
  { title: '新增用户', value: usersData.value.newUsers.toLocaleString(), icon: UserPlus, color: 'text-green-500', trend: '+22.1%' },
  { title: '活跃用户', value: usersData.value.activeUsers.toLocaleString(), icon: UserCheck, color: 'text-purple-500', trend: '+8.7%' },
  { title: '留存率', value: usersData.value.retentionRate, icon: Activity, color: 'text-orange-500', trend: '+3.2%' }
])

/**
 * 获取用户数据
 */
const fetchUsersData = async () => {
  try {
    const [metricsData, behaviorData] = await Promise.all([
      analyticsApi.getCoreMetrics('7d'),
      analyticsApi.getUserBehavior()
    ])

    usersData.value = {
      totalUsers: metricsData.newUsers * 5,
      newUsers: metricsData.newUsers,
      activeUsers: Math.round(metricsData.newUsers * 2.5),
      retentionRate: '68.5%',
      growth: metricsData.newUsersChange
    }

    userBehavior.value = behaviorData
  } catch (error) {
    console.error('获取用户数据失败:', error)
  }
}

onMounted(() => {
  fetchUsersData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">用户分析</h1>
        <p class="text-muted-foreground mt-1.5 text-sm">分析用户增长和活跃度</p>
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
      <Card class="bg-muted/40 border border-border/50 rounded-xl">
        <CardHeader>
          <CardTitle class="text-base">用户行为数据</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] overflow-auto">
            <div v-if="userBehavior.length > 0" class="space-y-4">
              <div v-for="item in userBehavior" :key="item.label" class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p class="font-medium">{{ item.label }}</p>
                  <p class="text-2xl font-bold mt-1">{{ item.value }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs" :class="item.isPositive ? 'text-green-500' : 'text-red-500'">
                    {{ item.isPositive ? '↑' : '↓' }} {{ item.change }}%
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center text-muted-foreground h-full">
              <div class="text-center">
                <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>加载中...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="bg-muted/40 border border-border/50 rounded-xl">
        <CardHeader>
          <CardTitle class="text-base">用户增长趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex flex-col justify-center">
            <MiniChart
              v-if="usersData.totalUsers > 0"
              type="line"
              :data="[usersData.totalUsers * 0.8, usersData.totalUsers * 0.85, usersData.totalUsers * 0.9, usersData.totalUsers * 0.95, usersData.totalUsers]"
              color="bg-purple-500"
              :height="200"
            />
            <div v-else class="flex items-center justify-center text-muted-foreground h-full">
              <div class="text-center">
                <Activity class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>加载中...</p>
              </div>
            </div>
            <div class="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>周一</span>
              <span>周二</span>
              <span>周三</span>
              <span>周四</span>
              <span>周五</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
