<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/stores/global/app';
import { useAuthStore } from '@/stores/global/auth';
import { useMenuUtils } from '@/layouts/composables/useMenuUtils';
import type { MenuItem, SidebarConfig } from './config';
import SidebarItem from './SidebarItem.vue';
import SidebarSubMenu from './SidebarSubMenu.vue';
import Logo from '../Logo.vue';
import { ChevronLeft, User } from 'lucide-vue-next';

/**
 * 组件属性
 */
interface Props {
  /** 侧栏配置 */
  config: SidebarConfig;
  /** 展开的子菜单 keys */
  expandedKeys: Set<string>;
}

const props = defineProps<Props>();

/**
 * 组件事件
 */
interface Emits {
  /** 切换子菜单 */
  (e: 'toggle-sub-menu', key: string): void;
  /** 导航 */
  (e: 'navigate', path: string): void;
}

const emit = defineEmits<Emits>();

const route = useRoute();
const appStore = useAppStore();
const authStore = useAuthStore();
const { isActive } = useMenuUtils();

/**
 * 用户姓名首字母
 */
const userInitials = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || 'U';
});

/**
 * 触摸手势状态
 */
const touchStartX = ref(0);
const touchEndX = ref(0);
const touchStartY = ref(0);
const touchEndY = ref(0);
const minSwipeDistance = 80; // 最小滑动距离
const maxVerticalDistance = 100; // 最大垂直滑动距离（防止误触）

/**
 * 处理触摸开始
 */
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0]?.clientX ?? 0;
  touchStartY.value = e.touches[0]?.clientY ?? 0;
  touchEndX.value = touchStartX.value;
  touchEndY.value = touchStartY.value;
};

/**
 * 处理触摸移动
 */
const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0]?.clientX ?? 0;
  touchEndY.value = e.touches[0]?.clientY ?? 0;
};

/**
 * 处理触摸结束
 */
const handleTouchEnd = () => {
  const swipeDistance = touchStartX.value - touchEndX.value;
  const verticalDistance = Math.abs(touchStartY.value - touchEndY.value);
  
  // 检查是否为有效的左滑关闭手势
  // 1. 水平滑动距离超过阈值
  // 2. 垂直滑动距离不超过阈值（防止斜滑）
  if (swipeDistance > minSwipeDistance && verticalDistance < maxVerticalDistance) {
    appStore.setMobileSidebar(false);
  }
};

/**
 * 监听路由变化，移动端自动关闭侧边栏
 */
watch(() => route.path, () => {
  appStore.setMobileSidebar(false);
});

/**
 * 处理导航
 */
const handleNavigate = (path: string): void => {
  emit('navigate', path);
  appStore.setMobileSidebar(false);
};

/**
 * 切换子菜单
 */
const handleToggleSubMenu = (key: string): void => {
  emit('toggle-sub-menu', key);
};

/**
 * 判断是否有子菜单
 */
const hasChildren = (item: MenuItem): boolean => {
  return !!item.children && item.children.length > 0;
};

/**
 * 判断是否展开
 */
const isExpanded = (key: string): boolean => {
  return props.expandedKeys.has(key);
};
</script>

<template>
  <div class="lg:hidden flex flex-1">
    <Sheet 
      :open="appStore.mobileSidebarOpen" 
      @update:open="appStore.setMobileSidebar"
    >
      <SheetContent 
        side="left" 
        class="w-[280px] p-0"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div class="flex flex-col h-full bg-background">
          <!-- 移动端头部 - 优化后的设计 -->
          <div class="relative overflow-hidden">
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent"></div>
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl supports-[backdrop-filter]:blur-3xl"></div>
            
            <div class="relative p-4 border-b border-border/50">
              <!-- Logo 区域 -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <!-- Logo 图标 - 支持主题色切换 -->
                  <Logo :size="40" :collapsed="false" />
                  <div>
                    <span class="text-base font-bold tracking-tight block">TabTab Admin</span>
                    <span class="text-xs text-muted-foreground">管理系统</span>
                  </div>
                </div>
                <!-- 关闭提示 -->
                <div class="flex items-center gap-1 text-xs text-muted-foreground/60 bg-muted/50 px-2 py-1 rounded-full">
                  <ChevronLeft class="h-3 w-3" />
                  <span>滑动关闭</span>
                </div>
              </div>
              
              <!-- 用户信息卡片 -->
              <div class="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                <Avatar class="h-10 w-10 ring-2 ring-background shadow-sm">
                  <AvatarImage v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
                  <AvatarFallback class="bg-primary/10 text-primary text-sm font-semibold">
                    {{ userInitials }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ authStore.user?.name || '用户' }}</p>
                  <p class="text-xs text-muted-foreground truncate">{{ authStore.user?.email || 'user@example.com' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 菜单列表 -->
          <ScrollArea class="flex-1">
            <nav 
              class="p-3 space-y-1" 
              role="menubar" 
              aria-label="主导航"
            >
              <template v-for="item in config.menus" :key="item.key">
                <SidebarSubMenu
                  v-if="hasChildren(item)"
                  :item="item"
                  :collapsed="false"
                  :active="isActive(item.path)"
                  :expanded="isExpanded(item.key)"
                  @toggle="handleToggleSubMenu(item.key)"
                  @navigate="handleNavigate"
                />
                <SidebarItem
                  v-else
                  :item="item"
                  :collapsed="false"
                  :active="isActive(item.path)"
                  @navigate="handleNavigate"
                />
              </template>
            </nav>
          </ScrollArea>

          <!-- 底部区域 - 优化后的设计 -->
          <div class="p-4 border-t border-border/40 bg-muted/20">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-xs text-muted-foreground">系统运行正常</span>
              </div>
              <span class="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40">v1.0.0</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>

    <!-- 移动端内容区域 -->
    <main class="flex-1 bg-background">
      <slot />
    </main>
  </div>
</template>
