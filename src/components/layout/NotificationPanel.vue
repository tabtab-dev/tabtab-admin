<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications, type NotificationItem, type NotificationTypeConfig } from '@/layouts/composables/useNotifications';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Check,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

/**
 * 通知类型配置 - 带渐变背景
 */
const notificationTypeConfig: Record<string, NotificationTypeConfig> = {
  info: { 
    icon: Info, 
    color: 'text-blue-500', 
    bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
    gradient: 'from-blue-500/30 to-blue-600/5'
  },
  warning: { 
    icon: AlertTriangle, 
    color: 'text-amber-500', 
    bgColor: 'bg-gradient-to-br from-amber-500/20 to-orange-600/10',
    gradient: 'from-amber-500/30 to-orange-600/5'
  },
  success: { 
    icon: CheckCircle, 
    color: 'text-emerald-500', 
    bgColor: 'bg-gradient-to-br from-emerald-500/20 to-green-600/10',
    gradient: 'from-emerald-500/30 to-green-600/5'
  },
  message: { 
    icon: MessageSquare, 
    color: 'text-purple-500', 
    bgColor: 'bg-gradient-to-br from-purple-500/20 to-violet-600/10',
    gradient: 'from-purple-500/30 to-violet-600/5'
  },
};

/**
 * 组件属性
 */
const props = withDefaults(defineProps<{
  /** 初始通知列表 */
  initialNotifications?: NotificationItem[];
}>(), {
  initialNotifications: () => [
    {
      id: '1',
      title: '系统更新完成',
      content: '系统已成功更新到最新版本 v2.0.0',
      type: 'success',
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
    },
    {
      id: '2',
      title: '新用户注册',
      content: '用户 "张三" 刚刚完成了注册',
      type: 'info',
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
    },
    {
      id: '3',
      title: '存储空间警告',
      content: '您的存储空间使用率已超过 85%，请及时清理',
      type: 'warning',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
    },
    {
      id: '4',
      title: '新消息',
      content: '您收到一条来自管理员的新消息',
      type: 'message',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
    },
  ],
});

/**
 * 组件事件
 */
const emit = defineEmits<{
  /** 通知已读事件 */
  (e: 'read', id: string): void;
  /** 全部已读事件 */
  (e: 'readAll'): void;
  /** 删除通知事件 */
  (e: 'delete', id: string): void;
  /** 清空所有通知事件 */
  (e: 'clearAll'): void;
}>();

const { t } = useI18n();
const router = useRouter();

/**
 * 使用通知功能
 */
const {
  notifications,
  isNotificationOpen,
  unreadCount,
  hasUnread,
  formatTime,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  groupedNotifications,
  getGroupTitle,
  hasGroupItems,
} = useNotifications(props.initialNotifications, notificationTypeConfig);

/**
 * 处理标记已读
 */
const handleMarkAsRead = (id: string) => {
  markAsRead(id);
  emit('read', id);
};

/**
 * 处理全部已读
 */
const handleMarkAllAsRead = () => {
  markAllAsRead();
  emit('readAll');
};

/**
 * 处理删除通知
 */
const handleDeleteNotification = (id: string) => {
  deleteNotification(id);
  emit('delete', id);
};

/**
 * 处理清空所有通知
 */
const handleClearAllNotifications = () => {
  clearAllNotifications();
  emit('clearAll');
};

/**
 * 查看所有通知
 */
const viewAllNotifications = () => {
  router.push('/notifications');
};

/**
 * 暴露方法供父组件调用
 */
defineExpose({
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  addNotification: (notification: NotificationItem) => {
    notifications.value.unshift(notification);
  },
});
</script>

<template>
  <DropdownMenu v-model:open="isNotificationOpen">
    <DropdownMenuTrigger as-child>
      <slot name="trigger">
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary relative transition-all duration-200"
          :title="t('common.header.notifications')"
        >
          <Bell class="h-4 w-4" />
          <!-- 徽标指示 -->
          <span v-if="hasUnread" class="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-background"></span>
          </span>
        </Button>
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-80 p-0" :side-offset="8">
      <!-- 通知头部 -->
      <div class="flex items-center justify-between px-3 py-2.5 border-b border-border/50 gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <Bell class="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span class="font-semibold text-sm truncate">{{ t('common.header.notifications') }}</span>
          <span
            v-if="unreadCount > 0"
            class="bg-primary text-primary-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex-shrink-0"
          >
            {{ unreadCount }}
          </span>
        </div>
        <div class="flex items-center gap-0.5 flex-shrink-0">
          <Button
            v-if="hasUnread"
            variant="ghost"
            size="sm"
            class="h-7 px-1.5 text-xs hover:bg-primary/10 hover:text-primary whitespace-nowrap"
            @click="handleMarkAllAsRead"
          >
            <CheckCheck class="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span class="truncate">{{ t('common.header.markAllRead') }}</span>
          </Button>
          <Button
            v-if="notifications.length > 0"
            variant="ghost"
            size="icon"
            class="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
            @click="handleClearAllNotifications"
          >
            <Trash2 class="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <!-- 通知列表 -->
      <ScrollArea class="h-[360px]">
        <!-- 空状态 -->
        <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <div class="relative mb-4">
            <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-sm">
              <Bell class="h-7 w-7 text-muted-foreground/60" />
            </div>
            <div class="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border-2 border-muted flex items-center justify-center">
              <Check class="h-3 w-3 text-muted-foreground/60" />
            </div>
          </div>
          <p class="text-sm font-medium text-foreground/80 mb-1">暂无通知</p>
          <p class="text-xs text-muted-foreground">所有通知都将显示在这里</p>
        </div>

        <!-- 分组显示通知 -->
        <template v-else>
          <!-- 未读消息组 -->
          <template v-if="hasGroupItems('unread')">
            <div class="px-4 py-2 bg-primary/5 border-b border-border/30">
              <span class="text-xs font-semibold text-primary flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
                {{ getGroupTitle('unread') }}
                <span class="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
                  {{ groupedNotifications.unread.length }}
                </span>
              </span>
            </div>
            <div
              v-for="notification in groupedNotifications.unread"
              :key="notification.id"
              class="group flex items-start gap-3 px-4 py-3 transition-all duration-200 cursor-pointer border-b border-border/20 relative overflow-hidden"
              @click="handleMarkAsRead(notification.id)"
            >
                <!-- 左侧激活指示条 -->
                <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-primary/50" />

                <!-- 悬停时的背景光效 -->
                <span
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
                  aria-hidden="true"
                />

                <!-- 类型图标 -->
                <div
                  class="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 relative z-10 shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                  :class="notificationTypeConfig[notification.type].bgColor"
                >
                  <component
                    :is="notificationTypeConfig[notification.type].icon"
                    class="h-4 w-4 transition-colors duration-200"
                    :class="notificationTypeConfig[notification.type].color"
                  />
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0 relative z-10">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm font-medium text-foreground truncate">
                      {{ notification.title }}
                    </p>
                    <span class="text-[10px] text-muted-foreground flex-shrink-0 bg-muted/50 px-1.5 py-0.5 rounded">
                      {{ formatTime(notification.createdAt) }}
                    </span>
                  </div>
                  <p class="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {{ notification.content }}
                  </p>
                </div>

                <!-- 操作按钮 -->
                <div class="flex flex-col items-center gap-1 flex-shrink-0 relative z-10">
                  <div class="h-2 w-2 rounded-full bg-primary" />
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    @click.stop="handleDeleteNotification(notification.id)"
                  >
                    <X class="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </template>

          <!-- 今天 -->
          <template v-if="hasGroupItems('today')">
            <div class="px-4 py-2 bg-muted/30 border-b border-border/30">
              <span class="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                {{ getGroupTitle('today') }}
              </span>
            </div>
            <div
              v-for="notification in groupedNotifications.today"
              :key="notification.id"
              class="group flex items-start gap-3 px-4 py-3 transition-all duration-200 cursor-pointer border-b border-border/20 relative overflow-hidden hover:bg-muted/50"
              @click="handleMarkAsRead(notification.id)"
            >
                <!-- 悬停时的背景光效 -->
                <span
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-muted/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
                  aria-hidden="true"
                />

                <!-- 类型图标 -->
                <div
                  class="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 relative z-10"
                  :class="notificationTypeConfig[notification.type].bgColor"
                >
                  <component
                    :is="notificationTypeConfig[notification.type].icon"
                    class="h-3.5 w-3.5 transition-colors duration-200"
                    :class="notificationTypeConfig[notification.type].color"
                  />
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0 relative z-10">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm text-foreground/80 truncate group-hover:text-foreground transition-colors">
                      {{ notification.title }}
                    </p>
                    <span class="text-[10px] text-muted-foreground flex-shrink-0">
                      {{ formatTime(notification.createdAt) }}
                    </span>
                  </div>
                  <p class="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                    {{ notification.content }}
                  </p>
                </div>

                <!-- 删除按钮 -->
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 relative z-10"
                  @click.stop="handleDeleteNotification(notification.id)"
                >
                  <X class="h-3 w-3" />
                </Button>
              </div>
            </template>

          <!-- 昨天 -->
          <template v-if="hasGroupItems('yesterday')">
            <div class="px-4 py-2 bg-muted/30 border-b border-border/30">
              <span class="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <span class="h-1 w-1 rounded-full bg-muted-foreground/40"></span>
                {{ getGroupTitle('yesterday') }}
              </span>
            </div>
            <div
              v-for="notification in groupedNotifications.yesterday"
              :key="notification.id"
              class="group flex items-start gap-3 px-4 py-3 transition-all duration-200 cursor-pointer border-b border-border/20 relative overflow-hidden hover:bg-muted/50"
              @click="handleMarkAsRead(notification.id)"
            >
                <!-- 悬停时的背景光效 -->
                <span
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-muted/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
                  aria-hidden="true"
                />

                <!-- 类型图标 -->
                <div
                  class="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 relative z-10 opacity-80"
                  :class="notificationTypeConfig[notification.type].bgColor"
                >
                  <component
                    :is="notificationTypeConfig[notification.type].icon"
                    class="h-3.5 w-3.5 transition-colors duration-200"
                    :class="notificationTypeConfig[notification.type].color"
                  />
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0 relative z-10">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm text-foreground/70 truncate group-hover:text-foreground/90 transition-colors">
                      {{ notification.title }}
                    </p>
                    <span class="text-[10px] text-muted-foreground flex-shrink-0">
                      {{ formatTime(notification.createdAt) }}
                    </span>
                  </div>
                  <p class="text-xs text-muted-foreground/80 line-clamp-2 mt-0.5 leading-relaxed">
                    {{ notification.content }}
                  </p>
                </div>

                <!-- 删除按钮 -->
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 relative z-10"
                  @click.stop="handleDeleteNotification(notification.id)"
                >
                  <X class="h-3 w-3" />
                </Button>
              </div>
            </template>

          <!-- 更早 -->
          <template v-if="hasGroupItems('earlier')">
            <div class="px-4 py-2 bg-muted/30 border-b border-border/30">
              <span class="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <span class="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                {{ getGroupTitle('earlier') }}
              </span>
            </div>
            <div
              v-for="notification in groupedNotifications.earlier"
              :key="notification.id"
              class="group flex items-start gap-3 px-4 py-3 transition-all duration-200 cursor-pointer border-b border-border/20 relative overflow-hidden hover:bg-muted/50"
              @click="handleMarkAsRead(notification.id)"
            >
                <!-- 悬停时的背景光效 -->
                <span
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-muted/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
                  aria-hidden="true"
                />

                <!-- 类型图标 -->
                <div
                  class="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 relative z-10 opacity-60"
                  :class="notificationTypeConfig[notification.type].bgColor"
                >
                  <component
                    :is="notificationTypeConfig[notification.type].icon"
                    class="h-3.5 w-3.5 transition-colors duration-200"
                    :class="notificationTypeConfig[notification.type].color"
                  />
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0 relative z-10">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm text-foreground/60 truncate group-hover:text-foreground/80 transition-colors">
                      {{ notification.title }}
                    </p>
                    <span class="text-[10px] text-muted-foreground flex-shrink-0">
                      {{ formatTime(notification.createdAt) }}
                    </span>
                  </div>
                  <p class="text-xs text-muted-foreground/70 line-clamp-2 mt-0.5 leading-relaxed">
                    {{ notification.content }}
                  </p>
                </div>

                <!-- 删除按钮 -->
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 relative z-10"
                  @click.stop="handleDeleteNotification(notification.id)"
                >
                  <X class="h-3 w-3" />
                </Button>
              </div>
            </template>
        </template>
      </ScrollArea>

      <!-- 底部查看更多 -->
      <div v-if="notifications.length > 0" class="border-t border-border/50 p-2">
        <Button
          variant="ghost"
          size="sm"
          class="w-full text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-lg"
          @click="viewAllNotifications"
        >
          {{ t('common.header.viewAll') }}
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
