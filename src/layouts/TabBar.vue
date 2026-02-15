<script setup lang="ts">
import { useTabBarStore } from '@/stores/global/tabbar';
import { useTabBar } from '@/composables/useTabBar';
import { useFullscreen } from '@/composables/useFullscreen';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from '@/components/Icon';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Ellipsis,
  RotateCw,
  X,
  GripVertical,
  Settings,
  Expand,
  Shrink,
} from 'lucide-vue-next';

const { t, locale } = useI18n();
const tabBarStore = useTabBarStore();

/**
 * 使用全屏功能
 */
const { isFullscreen, toggle, isSupported } = useFullscreen();

/**
 * 获取标签标题（支持多语言响应式切换）
 * @param titleKey - 国际化 key
 * @returns 翻译后的标题
 */
const getTabTitle = (titleKey: string): string => {
  // locale 被访问时会建立响应式依赖，语言切换时自动重新计算
  return t(titleKey);
};

// Refs for scroll containers
const scrollContainerRef = ref<HTMLElement | null>(null);
const tabsContainerRef = ref<HTMLElement | null>(null);

// Dragging state - 用于控制拖拽时的动画
const isDragging = ref(false);

// 触摸滑动状态
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchEndX = ref(0);
const isTouchScrolling = ref(false);
const minSwipeDistance = 30; // 最小滑动距离
const maxVerticalDistance = 50; // 最大垂直滑动距离

// Use the tab bar composable
const {
  isOverflowing,
  canScrollLeft,
  canScrollRight,
  scrollProgress,
  scrollLeft,
  scrollRight,
  scrollToStart,
  scrollToEnd,
  handleTabClick,
  handleCloseTab,
  handleRefreshTab,
  handleCloseOthers,
  handleCloseLeft,
  handleCloseRight,
  handleCloseAll,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
} = useTabBar({
  scrollContainerRef,
  tabsContainerRef,
});

// Get context menu items for a tab
const getContextMenuItems = (tab: typeof tabBarStore.tabs[0]) => {
  const tabIndex = tabBarStore.tabs.findIndex(t => t.path === tab.path);
  const isFirst = tabIndex === 0;
  const isLast = tabIndex === tabBarStore.tabs.length - 1;

  return [
    { key: 'refresh', label: t('common.tabbar.refresh'), icon: 'RotateCw', disabled: tab.isRefreshing },
    { key: 'close', label: t('common.tabbar.closeCurrent'), icon: 'X', disabled: tab.affix },
    { type: 'separator' as const },
    { key: 'closeOther', label: t('common.tabbar.closeOthers'), icon: 'X' },
    { key: 'closeLeft', label: t('common.tabbar.closeLeft'), icon: 'ChevronLeft', disabled: isFirst },
    { key: 'closeRight', label: t('common.tabbar.closeRight'), icon: 'ChevronRight', disabled: isLast },
    { type: 'separator' as const },
    { key: 'closeAll', label: t('common.tabbar.closeAll'), icon: 'Ellipsis' },
  ];
};

// Drag handlers with animation control
const onDragStart = (event: DragEvent, path: string) => {
  isDragging.value = true;
  handleDragStart(event, path);
};

const onDragEnd = () => {
  isDragging.value = false;
  handleDragEnd();
};

/**
 * 处理触摸开始
 * @param e - 触摸事件
 */
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0]?.clientX ?? 0;
  touchStartY.value = e.touches[0]?.clientY ?? 0;
  touchEndX.value = touchStartX.value;
  isTouchScrolling.value = false;
};

/**
 * 处理触摸移动
 * @param e - 触摸事件
 */
const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0]?.clientX ?? 0;
  const currentY = e.touches[0]?.clientY ?? 0;
  const verticalDistance = Math.abs(currentY - touchStartY.value);

  // 如果垂直滑动超过阈值，不处理水平滑动
  if (verticalDistance > maxVerticalDistance) {
    isTouchScrolling.value = false;
    return;
  }

  // 标记为触摸滑动状态
  isTouchScrolling.value = true;
};

/**
 * 处理触摸结束 - 实现滑动切换标签
 */
const handleTouchEnd = () => {
  if (!isTouchScrolling.value) return;

  const swipeDistance = touchStartX.value - touchEndX.value;

  // 左滑 - 切换到下一个标签
  if (swipeDistance > minSwipeDistance) {
    const currentIndex = tabBarStore.tabs.findIndex(t => t.path === tabBarStore.activeTab);
    if (currentIndex < tabBarStore.tabs.length - 1) {
      const nextTab = tabBarStore.tabs[currentIndex + 1];
      handleTabClick(nextTab.path);
    }
  }
  // 右滑 - 切换到上一个标签
  else if (swipeDistance < -minSwipeDistance) {
    const currentIndex = tabBarStore.tabs.findIndex(t => t.path === tabBarStore.activeTab);
    if (currentIndex > 0) {
      const prevTab = tabBarStore.tabs[currentIndex - 1];
      handleTabClick(prevTab.path);
    }
  }

  isTouchScrolling.value = false;
};
</script>

<template>
  <div class="relative flex items-center w-full min-w-0 h-9 sm:h-10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 border-b border-border/30 px-1 sm:px-2 gap-0.5 sm:gap-1">
    <!-- Left Scroll Controls -->
    <div v-show="isOverflowing" class="flex items-center gap-0.5 flex-shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 sm:h-7 sm:w-7"
              :disabled="!canScrollLeft"
              @click="scrollToStart"
            >
              <ChevronsLeft class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{{ t('common.tabbar.scrollToStart') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 sm:h-7 sm:w-7"
              :disabled="!canScrollLeft"
              @click="scrollLeft"
            >
              <ChevronLeft class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{{ t('common.tabbar.scrollLeft') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <!-- Tabs Container - 支持触摸滑动切换标签 -->
    <div
      ref="scrollContainerRef"
      class="flex-1 min-w-0 h-full overflow-hidden"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div
        ref="tabsContainerRef"
        class="flex items-center gap-1 h-full overflow-x-auto overflow-y-hidden"
        style="scrollbar-width: none; -ms-overflow-style: none;"
      >
        <TransitionGroup
          name="tab"
          tag="div"
          class="flex items-center gap-1"
          :class="{ 'dragging': isDragging }"
        >
          <div
            v-for="tab in tabBarStore.tabs"
            :key="tab.path"
          >
            <ContextMenu>
              <ContextMenuTrigger as-child>
                <div
                  :data-tab-path="tab.path"
                  draggable="true"
                  class="group relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md cursor-pointer transition-all duration-200 select-none whitespace-nowrap border touch-manipulation"
                  :class="[
                    tabBarStore.activeTab === tab.path
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground hover:border-border',
                    tab.isLoading && 'opacity-70',
                  ]"
                  @click="handleTabClick(tab.path)"
                  @dragstart="onDragStart($event, tab.path)"
                  @dragover="handleDragOver($event, tab.path)"
                  @dragend="onDragEnd"
                >
                  <!-- Drag Handle - 移动端隐藏拖拽图标 -->
                  <GripVertical
                    class="h-3 w-3 opacity-0 group-hover:opacity-50 cursor-grab active:cursor-grabbing transition-opacity hidden sm:block"
                    :class="tabBarStore.activeTab === tab.path ? 'text-primary-foreground/70' : 'text-muted-foreground'"
                  />

                  <!-- Refresh Animation -->
                  <RotateCw
                    v-if="tab.isRefreshing"
                    class="h-3.5 w-3.5 animate-spin"
                  />

                  <!-- Icon -->
                  <Icon
                    v-else-if="tab.icon"
                    :name="tab.icon"
                    class="h-3.5 w-3.5"
                  />

                  <!-- Title -->
                  <span class="max-w-[80px] sm:max-w-[120px] truncate">{{ getTabTitle(tab.title) }}</span>

                  <!-- Close Button - 移动端始终显示，桌面端 hover 显示 -->
                  <button
                    v-if="!tab.affix"
                    class="ml-0.5 rounded-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all p-0.5 min-w-[20px] min-h-[20px] flex items-center justify-center"
                    :class="tabBarStore.activeTab === tab.path ? 'hover:bg-primary-foreground/20' : 'hover:bg-foreground/10'"
                    @click.stop="handleCloseTab(tab.path)"
                  >
                    <X class="h-3 w-3" />
                  </button>

                  <!-- Active Indicator -->
                  <div
                    v-if="tabBarStore.activeTab === tab.path"
                    class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground/50"
                  />
                </div>
              </ContextMenuTrigger>

              <ContextMenuContent class="w-48">
                <template v-for="(item, index) in getContextMenuItems(tab)" :key="index">
                  <ContextMenuSeparator v-if="item.type === 'separator'" />
                  <ContextMenuItem
                    v-else
                    :disabled="item.disabled"
                    @click="item.key === 'refresh' ? handleRefreshTab(tab.path) : item.key === 'close' ? handleCloseTab(tab.path) : item.key === 'closeOther' ? handleCloseOthers(tab.path) : item.key === 'closeLeft' ? handleCloseLeft(tab.path) : item.key === 'closeRight' ? handleCloseRight(tab.path) : handleCloseAll()"
                  >
                    <Icon
                      v-if="item.icon"
                      :name="item.icon"
                      class="h-4 w-4 mr-2"
                    />
                    <span>{{ item.label }}</span>
                  </ContextMenuItem>
                </template>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Right Scroll Controls -->
    <div v-show="isOverflowing" class="flex items-center gap-0.5 flex-shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 sm:h-7 sm:w-7"
              :disabled="!canScrollRight"
              @click="scrollRight"
            >
              <ChevronRight class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{{ t('common.tabbar.scrollRight') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 sm:h-7 sm:w-7"
              :disabled="!canScrollRight"
              @click="scrollToEnd"
            >
              <ChevronsRight class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{{ t('common.tabbar.scrollToEnd') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <!-- More Actions Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0"
          :title="t('common.tabbar.moreActions')"
        >
          <Ellipsis class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-48">
        <DropdownMenuItem v-if="isSupported()" @click="toggle">
          <Shrink v-if="isFullscreen" class="h-4 w-4 mr-2" />
          <Expand v-else class="h-4 w-4 mr-2" />
          <span>{{ isFullscreen ? t('common.tabbar.exitFullscreen') : t('common.tabbar.enterFullscreen') }}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="isSupported()" />
        <DropdownMenuItem @click="handleCloseAll">
          <X class="h-4 w-4 mr-2" />
          <span>{{ t('common.tabbar.closeAll') }}</span>
        </DropdownMenuItem>
        <template v-if="isOverflowing">
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="scrollToStart">
            <ChevronsLeft class="h-4 w-4 mr-2" />
            <span>{{ t('common.tabbar.scrollToStart') }}</span>
          </DropdownMenuItem>
          <DropdownMenuItem @click="scrollToEnd">
            <ChevronsRight class="h-4 w-4 mr-2" />
            <span>{{ t('common.tabbar.scrollToEnd') }}</span>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Progress Bar -->
    <div
      v-show="isOverflowing"
      class="absolute bottom-0 left-0 h-0.5 bg-primary/20 transition-all duration-300"
      :style="{ width: `${scrollProgress}%` }"
    />
  </div>
</template>

<style scoped>
/* Hide scrollbar for webkit browsers */
.overflow-x-auto::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

/* Tab transition animations */
.tab-enter-active,
.tab-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-enter-from {
  opacity: 0;
  transform: translateX(-10px) scale(0.95);
}

.tab-leave-to {
  opacity: 0;
  transform: translateX(10px) scale(0.95);
}

.tab-move {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Disable animations during drag */
.dragging .tab-enter-active,
.dragging .tab-leave-active,
.dragging .tab-move {
  transition: none !important;
}

.dragging .tab-enter-from,
.dragging .tab-leave-to {
  opacity: 1;
  transform: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .tab-enter-active,
  .tab-leave-active,
  .tab-move {
    transition: none;
  }
}
</style>
