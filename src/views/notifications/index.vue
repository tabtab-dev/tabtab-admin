<script setup lang="ts">
import type { NotificationItem, NotificationTypeConfig } from '@/layouts/composables/useNotifications'
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  CheckCircle,
  Info,
  MessageSquare,
  Trash2,
  X,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { TPageHeader } from '@/components/business'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

/**
 * 筛选类型
 */
type FilterType = 'all' | 'unread' | 'read'

/**
 * 通知类型
 */
type NotificationType = 'info' | 'warning' | 'success' | 'message'

/**
 * 通知类型配置
 */
const notificationTypeConfig: Record<NotificationType, NotificationTypeConfig> = {
  info: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
    gradient: 'from-blue-500/30 to-blue-600/5',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bgColor: 'bg-gradient-to-br from-amber-500/20 to-orange-600/10',
    gradient: 'from-amber-500/30 to-orange-600/5',
  },
  success: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bgColor: 'bg-gradient-to-br from-emerald-500/20 to-green-600/10',
    gradient: 'from-emerald-500/30 to-green-600/5',
  },
  message: {
    icon: MessageSquare,
    color: 'text-purple-500',
    bgColor: 'bg-gradient-to-br from-purple-500/20 to-violet-600/10',
    gradient: 'from-purple-500/30 to-violet-600/5',
  },
}

const { t } = useI18n()

/**
 * 筛选标签配置
 */
const filterTabs: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unread', label: '未读' },
  { key: 'read', label: '已读' },
]

/**
 * 类型筛选配置
 */
const typeFilters: { key: NotificationType | 'all'; label: string }[] = [
  { key: 'all', label: '全部类型' },
  { key: 'info', label: '系统' },
  { key: 'warning', label: '警告' },
  { key: 'success', label: '成功' },
  { key: 'message', label: '消息' },
]

/**
 * 初始通知数据
 */
const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: '系统更新完成',
    content: '系统已成功更新到最新版本 v2.0.0，新增多项功能优化和性能提升',
    type: 'success',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
  },
  {
    id: '2',
    title: '新用户注册',
    content: '用户 "张三" 刚刚完成了注册，请及时审核',
    type: 'info',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
  },
  {
    id: '3',
    title: '存储空间警告',
    content: '您的存储空间使用率已超过 85%，请及时清理或升级存储方案',
    type: 'warning',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
  },
  {
    id: '4',
    title: '新消息',
    content: '您收到一条来自管理员的新消息，请查看详情',
    type: 'message',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true,
  },
  {
    id: '5',
    title: '订单支付成功',
    content: '订单 #20240306001 已完成支付，金额 ¥1,299.00',
    type: 'success',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    isRead: true,
  },
  {
    id: '6',
    title: '系统维护通知',
    content: '系统将于今晚 22:00-23:00 进行例行维护，届时服务可能暂时不可用',
    type: 'warning',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50),
    isRead: true,
  },
  {
    id: '7',
    title: '安全提醒',
    content: '检测到您的账号在新设备上登录，如非本人操作请及时修改密码',
    type: 'info',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    isRead: true,
  },
]

/**
 * 通知列表
 */
const notifications = ref<NotificationItem[]>(initialNotifications)

/**
 * 当前筛选类型
 */
const currentFilter = ref<FilterType>('all')

/**
 * 当前类型筛选
 */
const currentTypeFilter = ref<NotificationType | 'all'>('all')

/**
 * 筛选后的通知列表
 */
const filteredNotifications = computed(() => {
  let result = [...notifications.value]

  if (currentFilter.value === 'unread') {
    result = result.filter(n => !n.isRead)
  }
  else if (currentFilter.value === 'read') {
    result = result.filter(n => n.isRead)
  }

  if (currentTypeFilter.value !== 'all') {
    result = result.filter(n => n.type === currentTypeFilter.value)
  }

  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

/**
 * 未读数量
 */
const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)

/**
 * 分组后的通知
 */
const groupedNotifications = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

  const groups = {
    unread: [] as NotificationItem[],
    today: [] as NotificationItem[],
    yesterday: [] as NotificationItem[],
    earlier: [] as NotificationItem[],
  }

  filteredNotifications.value.forEach((notification) => {
    const notificationDate = new Date(
      notification.createdAt.getFullYear(),
      notification.createdAt.getMonth(),
      notification.createdAt.getDate(),
    )

    if (!notification.isRead) {
      groups.unread.push(notification)
    }
    else if (notificationDate.getTime() >= today.getTime()) {
      groups.today.push(notification)
    }
    else if (notificationDate.getTime() >= yesterday.getTime()) {
      groups.yesterday.push(notification)
    }
    else {
      groups.earlier.push(notification)
    }
  })

  return groups
})

/**
 * 获取分组标题
 */
function getGroupTitle(group: 'unread' | 'today' | 'yesterday' | 'earlier'): string {
  const titles = {
    unread: '未读消息',
    today: '今天',
    yesterday: '昨天',
    earlier: '更早',
  }
  return titles[group]
}

/**
 * 判断分组是否有内容
 */
function hasGroupItems(group: 'unread' | 'today' | 'yesterday' | 'earlier'): boolean {
  return groupedNotifications.value[group].length > 0
}

/**
 * 格式化时间
 */
function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1)
    return '刚刚'
  if (minutes < 60)
    return `${minutes}分钟前`
  if (hours < 24)
    return `${hours}小时前`
  if (days < 7)
    return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

/**
 * 标记通知为已读
 */
function markAsRead(id: string): void {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.isRead = true
  }
}

/**
 * 标记全部已读
 */
function markAllAsRead(): void {
  notifications.value.forEach(n => n.isRead = true)
}

/**
 * 删除通知
 */
function deleteNotification(id: string): void {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

/**
 * 清空所有通知
 */
function clearAllNotifications(): void {
  notifications.value = []
}

/**
 * 设置筛选类型
 */
function setFilter(filter: FilterType): void {
  currentFilter.value = filter
}

/**
 * 设置类型筛选
 */
function setTypeFilter(type: NotificationType | 'all'): void {
  currentTypeFilter.value = type
}
</script>

<template>
  <div class="space-y-6">
    <TPageHeader
      title="消息通知"
      subtitle="查看和管理您的所有通知消息"
    />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3 space-y-4">
        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardContent class="p-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-2">
                <Button
                  v-for="tab in filterTabs"
                  :key="tab.key"
                  :variant="currentFilter === tab.key ? 'default' : 'ghost'"
                  size="sm"
                  class="h-8"
                  @click="setFilter(tab.key)"
                >
                  {{ tab.label }}
                  <span
                    v-if="tab.key === 'unread' && unreadCount > 0"
                    class="ml-1.5 bg-primary-foreground/20 text-xs px-1.5 py-0.5 rounded-full"
                  >
                    {{ unreadCount }}
                  </span>
                </Button>
              </div>

              <div class="flex items-center gap-2">
                <Button
                  v-if="unreadCount > 0"
                  variant="outline"
                  size="sm"
                  class="h-8"
                  @click="markAllAsRead"
                >
                  <CheckCheck class="h-4 w-4 mr-1.5" />
                  全部已读
                </Button>
                <Button
                  v-if="notifications.length > 0"
                  variant="outline"
                  size="sm"
                  class="h-8 text-destructive hover:text-destructive"
                  @click="clearAllNotifications"
                >
                  <Trash2 class="h-4 w-4 mr-1.5" />
                  清空
                </Button>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
              <span class="text-sm text-muted-foreground mr-2">类型筛选：</span>
              <Button
                v-for="typeFilter in typeFilters"
                :key="typeFilter.key"
                :variant="currentTypeFilter === typeFilter.key ? 'secondary' : 'ghost'"
                size="sm"
                class="h-7 text-xs"
                @click="setTypeFilter(typeFilter.key)"
              >
                {{ typeFilter.label }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <ScrollArea class="h-[calc(100vh-380px)] min-h-[400px]">
            <div v-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
              <div class="relative mb-4">
                <div class="h-20 w-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-sm">
                  <Bell class="h-9 w-9 text-muted-foreground/60" />
                </div>
                <div class="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-muted flex items-center justify-center">
                  <Check class="h-3.5 w-3.5 text-muted-foreground/60" />
                </div>
              </div>
              <p class="text-base font-medium text-foreground/80 mb-1">
                暂无通知
              </p>
              <p class="text-sm text-muted-foreground">
                所有通知都将显示在这里
              </p>
            </div>

            <template v-else>
              <template v-if="hasGroupItems('unread')">
                <div class="px-4 py-2 bg-primary/5 border-b border-border/30 sticky top-0 z-10">
                  <span class="text-sm font-semibold text-primary flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    {{ getGroupTitle('unread') }}
                    <span class="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                      {{ groupedNotifications.unread.length }}
                    </span>
                  </span>
                </div>
                <div
                  v-for="notification in groupedNotifications.unread"
                  :key="notification.id"
                  class="group flex items-start gap-4 px-4 py-4 transition-all duration-200 cursor-pointer border-b border-border/20 relative overflow-hidden hover:bg-muted/50"
                  @click="markAsRead(notification.id)"
                >
                  <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-primary/50" />

                  <div
                    class="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 relative z-10 shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                    :class="notificationTypeConfig[notification.type].bgColor"
                  >
                    <component
                      :is="notificationTypeConfig[notification.type].icon"
                      class="h-5 w-5 transition-colors duration-200"
                      :class="notificationTypeConfig[notification.type].color"
                    />
                  </div>

                  <div class="flex-1 min-w-0 relative z-10">
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-sm font-medium text-foreground truncate">
                        {{ notification.title }}
                      </p>
                      <span class="text-xs text-muted-foreground flex-shrink-0 bg-muted/50 px-2 py-0.5 rounded">
                        {{ formatTime(notification.createdAt) }}
                      </span>
                    </div>
                    <p class="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {{ notification.content }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2 flex-shrink-0 relative z-10">
                    <div class="h-2.5 w-2.5 rounded-full bg-primary" />
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      @click.stop="deleteNotification(notification.id)"
                    >
                      <X class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </template>

              <template v-if="hasGroupItems('today')">
                <div class="px-4 py-2 bg-muted/30 border-b border-border/30 sticky top-0 z-10">
                  <span class="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <span class="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                    {{ getGroupTitle('today') }}
                  </span>
                </div>
                <div
                  v-for="notification in groupedNotifications.today"
                  :key="notification.id"
                  class="group flex items-start gap-4 px-4 py-4 transition-all duration-200 cursor-pointer border-b border-border/20 relative overflow-hidden hover:bg-muted/50"
                  @click="markAsRead(notification.id)"
                >
                  <div
                    class="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 relative z-10"
                    :class="notificationTypeConfig[notification.type].bgColor"
                  >
                    <component
                      :is="notificationTypeConfig[notification.type].icon"
                      class="h-4 w-4 transition-colors duration-200"
                      :class="notificationTypeConfig[notification.type].color"
                    />
                  </div>

                  <div class="flex-1 min-w-0 relative z-10">
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-sm text-foreground/80 truncate group-hover:text-foreground transition-colors">
                        {{ notification.title }}
                      </p>
                      <span class="text-xs text-muted-foreground flex-shrink-0">
                        {{ formatTime(notification.createdAt) }}
                      </span>
                    </div>
                    <p class="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {{ notification.content }}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 relative z-10"
                    @click.stop="deleteNotification(notification.id)"
                  >
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </template>

              <template v-if="hasGroupItems('yesterday')">
                <div class="px-4 py-2 bg-muted/30 border-b border-border/30 sticky top-0 z-10">
                  <span class="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <span class="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    {{ getGroupTitle('yesterday') }}
                  </span>
                </div>
                <div
                  v-for="notification in groupedNotifications.yesterday"
                  :key="notification.id"
                  class="group flex items-start gap-4 px-4 py-4 transition-all duration-200 cursor-pointer border-b border-border/20 relative overflow-hidden hover:bg-muted/50"
                  @click="markAsRead(notification.id)"
                >
                  <div
                    class="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 relative z-10 opacity-80"
                    :class="notificationTypeConfig[notification.type].bgColor"
                  >
                    <component
                      :is="notificationTypeConfig[notification.type].icon"
                      class="h-4 w-4 transition-colors duration-200"
                      :class="notificationTypeConfig[notification.type].color"
                    />
                  </div>

                  <div class="flex-1 min-w-0 relative z-10">
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-sm text-foreground/70 truncate group-hover:text-foreground/90 transition-colors">
                        {{ notification.title }}
                      </p>
                      <span class="text-xs text-muted-foreground flex-shrink-0">
                        {{ formatTime(notification.createdAt) }}
                      </span>
                    </div>
                    <p class="text-sm text-muted-foreground/80 line-clamp-2 mt-1 leading-relaxed">
                      {{ notification.content }}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 relative z-10"
                    @click.stop="deleteNotification(notification.id)"
                  >
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </template>

              <template v-if="hasGroupItems('earlier')">
                <div class="px-4 py-2 bg-muted/30 border-b border-border/30 sticky top-0 z-10">
                  <span class="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <span class="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    {{ getGroupTitle('earlier') }}
                  </span>
                </div>
                <div
                  v-for="notification in groupedNotifications.earlier"
                  :key="notification.id"
                  class="group flex items-start gap-4 px-4 py-4 transition-all duration-200 cursor-pointer border-b border-border/20 relative overflow-hidden hover:bg-muted/50"
                  @click="markAsRead(notification.id)"
                >
                  <div
                    class="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 relative z-10 opacity-60"
                    :class="notificationTypeConfig[notification.type].bgColor"
                  >
                    <component
                      :is="notificationTypeConfig[notification.type].icon"
                      class="h-4 w-4 transition-colors duration-200"
                      :class="notificationTypeConfig[notification.type].color"
                    />
                  </div>

                  <div class="flex-1 min-w-0 relative z-10">
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-sm text-foreground/60 truncate group-hover:text-foreground/80 transition-colors">
                        {{ notification.title }}
                      </p>
                      <span class="text-xs text-muted-foreground flex-shrink-0">
                        {{ formatTime(notification.createdAt) }}
                      </span>
                    </div>
                    <p class="text-sm text-muted-foreground/70 line-clamp-2 mt-1 leading-relaxed">
                      {{ notification.content }}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 relative z-10"
                    @click.stop="deleteNotification(notification.id)"
                  >
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </template>
            </template>
          </ScrollArea>
        </Card>
      </div>

      <div class="space-y-4">
        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardContent class="p-4">
            <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
              <Bell class="h-4 w-4" />
              通知统计
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">全部通知</span>
                <span class="text-sm font-medium">{{ notifications.length }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">未读通知</span>
                <span class="text-sm font-medium text-primary">{{ unreadCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">已读通知</span>
                <span class="text-sm font-medium">{{ notifications.length - unreadCount }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-muted/40 border border-border/50 rounded-xl">
          <CardContent class="p-4">
            <h3 class="text-sm font-semibold mb-3">
              类型分布
            </h3>
            <div class="space-y-2">
              <div
                v-for="(config, type) in notificationTypeConfig"
                :key="type"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="h-6 w-6 rounded-md flex items-center justify-center"
                    :class="config.bgColor"
                  >
                    <component
                      :is="config.icon"
                      class="h-3.5 w-3.5"
                      :class="config.color"
                    />
                  </div>
                  <span class="text-sm text-muted-foreground capitalize">{{ type }}</span>
                </div>
                <span class="text-sm font-medium">
                  {{ notifications.filter(n => n.type === type).length }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
