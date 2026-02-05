<script setup lang="ts">
/**
 * 用户分析页
 */
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, UserCheck, Activity } from 'lucide-vue-next'

const usersData = ref({
  totalUsers: 12456,
  newUsers: 1234,
  activeUsers: 5678,
  retentionRate: '68.5%',
  growth: 15.2
})

const statistics = computed(() => [
  { title: '总用户数', value: usersData.value.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500', trend: '+15.2%' },
  { title: '新增用户', value: usersData.value.newUsers.toLocaleString(), icon: UserPlus, color: 'text-green-500', trend: '+22.1%' },
  { title: '活跃用户', value: usersData.value.activeUsers.toLocaleString(), icon: UserCheck, color: 'text-purple-500', trend: '+8.7%' },
  { title: '留存率', value: usersData.value.retentionRate, icon: Activity, color: 'text-orange-500', trend: '+3.2%' }
])
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
      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">用户增长趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center text-muted-foreground">
            <div class="text-center">
              <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>用户增长图表</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">用户分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex items-center justify-center text-muted-foreground">
            <div class="text-center">
              <Activity class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>用户地域分布</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
