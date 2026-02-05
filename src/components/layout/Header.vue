<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/global/auth';
import { useAppStore } from '@/stores/global/app';
import { useThemeStore } from '@/stores/global/theme';
import { useMenuStore } from '@/stores/global/menu';
import { useNotifications } from '@/layouts/composables/useNotifications';
import ThemeSettings from './ThemeSettings.vue';
import LanguageSwitch from './LanguageSwitch.vue';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  ChevronDown,
  PanelLeft,
  PanelRight,
  Palette,
  Command,
  X,
  Check,
  CheckCheck,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
} from 'lucide-vue-next';
import Breadcrumb from './Breadcrumb.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const appStore = useAppStore();
const themeStore = useThemeStore();
const menuStore = useMenuStore();

const searchQuery = ref('');
const isSearchFocused = ref(false);
const isSearchExpanded = ref(false);
const isThemeDrawerOpen = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);

/**
 * 通知类型配置
 */
const notificationTypeConfig = {
  info: { icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  message: { icon: MessageSquare, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
};

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
} = useNotifications([
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
], notificationTypeConfig);

/**
 * 当前路由标题
 */
const currentRouteTitle = computed(() => {
  return menuStore.getRouteTitleKey(route.path);
});

/**
 * 处理登出
 */
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

/**
 * 处理搜索
 */
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Search:', searchQuery.value);
    // TODO: 实现搜索逻辑
  }
};

/**
 * 展开搜索框（移动端/平板）
 */
const expandSearch = async () => {
  isSearchExpanded.value = true;
  // 等待 DOM 更新后聚焦
  await nextTick();
  searchInputRef.value?.focus();
};

/**
 * 关闭搜索框
 */
const collapseSearch = () => {
  isSearchExpanded.value = false;
  searchQuery.value = '';
};

/**
 * 处理键盘快捷键
 */
const handleKeydown = (e: KeyboardEvent) => {
  // Cmd/Ctrl + K 聚焦搜索
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (window.innerWidth < 768) {
      expandSearch();
    } else {
      searchInputRef.value?.focus();
    }
  }
  
  // ESC 关闭搜索
  if (e.key === 'Escape' && isSearchExpanded.value) {
    collapseSearch();
  }
};

/**
 * 点击外部关闭搜索
 */
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (isSearchExpanded.value && !target.closest('.search-container')) {
    collapseSearch();
  }
};

/**
 * 组件属性
 */
defineProps<{
  /** 侧栏是否折叠 */
  sidebarCollapsed?: boolean;
}>();

/**
 * 组件事件
 */
defineEmits<{
  /** 折叠侧栏 */
  (e: 'toggle-collapse'): void;
}>();

// 添加事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="h-14 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
    <div class="flex items-center justify-between h-full px-4 lg:px-6">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <!-- 移动端菜单按钮 -->
        <Button
          variant="ghost"
          size="icon"
          @click="appStore.toggleMobileSidebar"
          class="lg:hidden hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-lg flex-shrink-0"
        >
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>

        <!-- 桌面端折叠按钮 -->
        <Button
          variant="ghost"
          size="icon"
          @click="$emit('toggle-collapse')"
          class="hidden lg:flex hover:bg-muted hover:text-foreground h-8 w-8 rounded-lg flex-shrink-0"
        >
          <PanelLeft v-if="!sidebarCollapsed" class="h-4 w-4" />
          <PanelRight v-else class="h-4 w-4" />
        </Button>

        <!-- 面包屑导航 -->
        <div v-if="themeStore.layoutConfig.showBreadcrumb" class="hidden md:flex items-center min-w-0">
          <Breadcrumb />
        </div>

        <!-- 移动端页面标题 -->
        <h1 class="md:hidden text-sm font-semibold text-foreground truncate">
          {{ $t(currentRouteTitle) }}
        </h1>
      </div>

      <div class="flex items-center gap-1.5 flex-shrink-0">
        <!-- 搜索框 - 桌面端 -->
        <div
          class="search-container hidden md:flex items-center gap-2 transition-all duration-300 ease-out rounded-xl px-3 py-1.5 border"
          :class="[
            isSearchFocused
              ? 'bg-background border-primary/30 w-72 shadow-sm ring-2 ring-primary/10'
              : 'bg-muted/60 border-transparent w-56 hover:bg-muted hover:border-border/50'
          ]"
        >
          <Search class="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :placeholder="t('common.header.search')"
            class="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            @keyup.enter="handleSearch"
          />
          <kbd class="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground flex-shrink-0">
            <Command class="h-3 w-3" />
            <span>K</span>
          </kbd>
        </div>

        <!-- 搜索按钮 - 移动端/平板 -->
        <Button
          variant="ghost"
          size="icon"
          class="md:hidden h-8 w-8 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
          @click="expandSearch"
        >
          <Search class="h-4 w-4" />
        </Button>

        <!-- 移动端展开的搜索框 -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isSearchExpanded"
            class="search-container fixed inset-x-4 top-14 z-50 md:hidden flex items-center gap-2 bg-background border rounded-lg px-3 py-2 shadow-lg"
          >
            <Search class="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              :placeholder="t('common.header.search')"
              class="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
              @keyup.enter="handleSearch"
            />
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 rounded flex-shrink-0"
              @click="collapseSearch"
            >
              <X class="h-3 w-3" />
            </Button>
          </div>
        </Transition>

        <!-- 遮罩层 -->
        <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isSearchExpanded"
            class="fixed inset-0 bg-black/40 z-40 md:hidden"
            @click="collapseSearch"
          />
        </Transition>

        <!-- 语言切换 -->
        <LanguageSwitch mode="dropdown" size="icon" variant="ghost" />

        <!-- 主题切换 -->
        <Button
          variant="ghost"
          size="icon"
          @click="themeStore.toggleMode"
          class="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
          :title="themeStore.currentMode === 'dark' ? t('common.header.switchToLight') : t('common.header.switchToDark')"
        >
          <Sun v-if="themeStore.currentMode === 'dark'" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </Button>

        <!-- 主题设置抽屉 -->
        <Sheet v-model:open="isThemeDrawerOpen">
          <SheetTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors hidden sm:flex"
              :title="t('common.header.themeSettings')"
            >
              <Palette class="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-[360px] sm:w-[400px] p-0">
            <SheetHeader class="px-6 py-4 border-b border-border/50">
              <SheetTitle class="flex items-center gap-2">
                <Palette class="h-5 w-5 text-primary" />
                {{ t('common.header.themeSettings') }}
              </SheetTitle>
              <SheetDescription class="sr-only">
                {{ t('common.header.themeSettingsDesc') }}
              </SheetDescription>
            </SheetHeader>
            <div class="p-6 overflow-y-auto h-[calc(100vh-80px)]">
              <ThemeSettings />
            </div>
          </SheetContent>
        </Sheet>

        <!-- 通知按钮 - 优化后的设计 -->
        <DropdownMenu v-model:open="isNotificationOpen">
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary relative transition-all duration-200"
              :title="t('common.header.notifications')"
            >
              <Bell class="h-4 w-4" />
              <!-- 徽标指示 - 优化为更精致的脉冲效果 -->
              <span v-if="hasUnread" class="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-background"></span>
              </span>
            </Button>
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
                  @click="markAllAsRead"
                >
                  <CheckCheck class="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span class="truncate">{{ t('common.header.markAllRead') }}</span>
                </Button>
                <Button
                  v-if="notifications.length > 0"
                  variant="ghost"
                  size="icon"
                  class="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                  @click="clearAllNotifications"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <!-- 通知列表 -->
            <div class="max-h-[360px] overflow-y-auto">
              <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
                <div class="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bell class="h-5 w-5 text-muted-foreground" />
                </div>
                <p class="text-sm text-muted-foreground">{{ t('common.header.noNotifications') }}</p>
              </div>

              <div
                v-for="notification in notifications"
                :key="notification.id"
                v-memo="[notification.isRead, notification.title, notification.content]"
                class="group flex items-start gap-3 px-4 py-3 transition-all duration-200 cursor-pointer border-b border-border/30 last:border-b-0 relative overflow-hidden"
                :class="[
                  notification.isRead === false
                    ? 'bg-primary/[0.03]'
                    : '',
                  'hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset'
                ]"
                @click="markAsRead(notification.id)"
              >
                <!-- 左侧激活指示条 -->
                <div
                  v-if="notification.isRead === false"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-primary rounded-r-full"
                />

                <!-- 悬停时的背景光效 -->
                <span
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
                  aria-hidden="true"
                />

                <!-- 类型图标 -->
                <div
                  class="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 relative z-10"
                  :class="[
                    notificationTypeConfig[notification.type].bgColor,
                    notification.isRead === false ? 'scale-110' : ''
                  ]"
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
                    <p
                      class="text-sm font-medium truncate transition-colors duration-200 group-hover:text-primary"
                      :class="notification.isRead === false ? 'text-foreground' : 'text-foreground/80'"
                    >
                      {{ notification.title }}
                    </p>
                    <span class="text-[10px] text-muted-foreground flex-shrink-0">
                      {{ formatTime(notification.createdAt) }}
                    </span>
                  </div>
                  <p class="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed group-hover:text-muted-foreground/80">
                    {{ notification.content }}
                  </p>
                </div>

                <!-- 未读指示器和操作 -->
                <div class="flex flex-col items-center gap-1 flex-shrink-0 relative z-10">
                  <div
                    v-if="notification.isRead === false"
                    class="h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/30"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    @click.stop="deleteNotification(notification.id)"
                  >
                    <X class="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <!-- 底部查看更多 -->
            <div v-if="notifications.length > 0" class="border-t border-border/50 p-2">
              <Button
                variant="ghost"
                size="sm"
                class="w-full text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-lg"
                @click="router.push('/notifications')"
              >
                {{ t('common.header.viewAll') }}
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- 用户菜单 - 优化后的设计 -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="flex items-center gap-2 px-2 h-9 rounded-lg hover:bg-primary/10 hover:text-primary ml-1 transition-all duration-200">
              <Avatar class="h-7 w-7 ring-2 ring-primary/20 shadow-sm">
                <AvatarImage v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
                <AvatarFallback class="text-xs bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                  {{ authStore.user?.name?.charAt(0) || 'U' }}
                </AvatarFallback>
              </Avatar>
              <div class="hidden md:flex flex-col items-start min-w-0">
                <span class="text-sm font-medium leading-tight truncate max-w-[100px]">
                  {{ authStore.user?.name || t('common.header.user') }}
                </span>
                <span class="text-[10px] text-muted-foreground leading-tight">{{ t('common.header.admin') }}</span>
              </div>
              <ChevronDown class="h-3.5 w-3.5 text-muted-foreground/70 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56" :side-offset="8">
            <!-- 用户信息头部 - 优化设计 -->
            <div class="p-3 border-b border-border/50 bg-muted/30">
              <div class="flex items-center gap-3">
                <Avatar class="h-10 w-10 ring-2 ring-background shadow-sm">
                  <AvatarImage v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
                  <AvatarFallback class="text-sm bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                    {{ authStore.user?.name?.charAt(0) || 'U' }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex flex-col min-w-0">
                  <p class="text-sm font-semibold truncate">{{ authStore.user?.name || t('common.header.user') }}</p>
                  <p class="text-xs text-muted-foreground truncate">{{ authStore.user?.email || 'user@example.com' }}</p>
                </div>
              </div>
            </div>
            <DropdownMenuItem
              @click="router.push('/settings')"
              class="cursor-pointer py-2.5 focus:bg-primary focus:text-primary-foreground group"
            >
              <div
                class="h-8 w-8 flex items-center justify-center mr-3 transition-colors"
                :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }"
                :class="'bg-primary/10 group-focus:bg-primary-foreground/20'"
              >
                <User class="h-4 w-4 text-primary group-focus:text-primary-foreground" />
              </div>
              <div>
                <p class="text-sm font-medium">{{ t('common.header.profile') }}</p>
                <p class="text-xs text-muted-foreground group-focus:text-primary-foreground/70">{{ t('common.header.profileDesc') }}</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="router.push('/settings')"
              class="cursor-pointer py-2.5 focus:bg-primary focus:text-primary-foreground group"
            >
              <div
                class="h-8 w-8 flex items-center justify-center mr-3 transition-colors"
                :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }"
                :class="'bg-muted group-focus:bg-primary-foreground/20'"
              >
                <Settings class="h-4 w-4 text-muted-foreground group-focus:text-primary-foreground" />
              </div>
              <div>
                <p class="text-sm font-medium">{{ t('common.header.settings') }}</p>
                <p class="text-xs text-muted-foreground group-focus:text-primary-foreground/70">{{ t('common.header.settingsDesc') }}</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              @click.stop="handleLogout"
              class="cursor-pointer py-2.5 focus:bg-red-500 focus:text-white group"
            >
              <div
                class="h-8 w-8 flex items-center justify-center mr-3 transition-colors"
                :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }"
                :class="'bg-red-100 group-focus:bg-white/20'"
              >
                <LogOut class="h-4 w-4 text-red-500 group-focus:text-white" />
              </div>
              <span class="font-medium text-red-500 group-focus:text-white">{{ t('common.header.logout') }}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
