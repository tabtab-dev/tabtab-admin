<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useTabBarStore } from '@/stores/tabbar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Home,
  MoreHorizontal,
} from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const tabBarStore = useTabBarStore();

/** 标签栏容器引用 */
const tabBarRef = ref<HTMLDivElement | null>(null);
/** 标签列表容器引用 */
const tabListRef = ref<HTMLDivElement | null>(null);
/** 是否可以向左滚动 */
const canScrollLeft = ref(false);
/** 是否可以向右滚动 */
const canScrollRight = ref(false);
/** 右键菜单状态 */
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuTabPath = ref<string>('');

/**
 * 当前激活的标签路径
 */
const activeTabPath = computed(() => tabBarStore.activeTab);

/**
 * 标签列表
 */
const tabs = computed(() => tabBarStore.tabs);

/**
 * 检查滚动状态
 */
const checkScrollStatus = () => {
  if (!tabListRef.value) return;
  const { scrollLeft, scrollWidth, clientWidth } = tabListRef.value;
  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1;
};

/**
 * 向左滚动
 */
const scrollLeftFn = () => {
  if (!tabListRef.value) return;
  tabListRef.value.scrollBy({ left: -200, behavior: 'smooth' });
};

/**
 * 向右滚动
 */
const scrollRightFn = () => {
  if (!tabListRef.value) return;
  tabListRef.value.scrollBy({ left: 200, behavior: 'smooth' });
};

/**
 * 处理标签点击
 * @param path 标签路径
 */
const handleTabClick = (path: string) => {
  if (path !== route.path) {
    router.push(path);
  }
  tabBarStore.activateTab(path);
};

/**
 * 处理标签关闭
 * @param path 标签路径
 * @param event 鼠标事件
 */
const handleTabClose = (path: string, event?: MouseEvent) => {
  event?.stopPropagation();
  tabBarStore.closeTab(path, router, route.path);
};

/**
 * 处理右键菜单
 * @param event 鼠标事件
 * @param path 标签路径
 */
const handleContextMenu = (event: MouseEvent, path: string) => {
  event.preventDefault();
  contextMenuTabPath.value = path;
  contextMenuPosition.value = { x: event.clientX, y: event.clientY };
  contextMenuVisible.value = true;
};

/**
 * 关闭右键菜单
 */
const closeContextMenu = () => {
  contextMenuVisible.value = false;
};

/**
 * 关闭当前标签
 */
const handleCloseCurrent = () => {
  if (contextMenuTabPath.value) {
    tabBarStore.closeTab(contextMenuTabPath.value, router, route.path);
  }
  closeContextMenu();
};

/**
 * 关闭其他标签
 */
const handleCloseOthers = () => {
  if (contextMenuTabPath.value) {
    tabBarStore.closeOthers(contextMenuTabPath.value);
    if (route.path !== contextMenuTabPath.value) {
      router.push(contextMenuTabPath.value);
    }
  }
  closeContextMenu();
};

/**
 * 关闭全部标签
 */
const handleCloseAll = () => {
  tabBarStore.closeAll(router);
  closeContextMenu();
};

/**
 * 刷新当前标签
 */
const handleRefresh = () => {
  if (contextMenuTabPath.value) {
    tabBarStore.refreshTab(contextMenuTabPath.value);
  }
  closeContextMenu();
};

/**
 * 获取标签标题
 * @param tab 标签项
 */
const getTabTitle = (tab: typeof tabs.value[0]) => {
  if (tab.titleKey) {
    return t(tab.titleKey);
  }
  return tab.title;
};

/**
 * 获取标签图标组件
 * @param icon 图标名称
 */
const getTabIcon = (icon?: string) => {
  if (icon === 'Home') {
    return Home;
  }
  return null;
};

/**
 * 监听路由变化，自动添加标签
 */
const unwatchRoute = router.afterEach((to) => {
  nextTick(() => {
    tabBarStore.addTabFromRoute(to);
    scrollToActiveTab();
  });
});

/**
 * 滚动到激活的标签
 */
const scrollToActiveTab = () => {
  nextTick(() => {
    if (!tabListRef.value) return;
    const activeTabElement = tabListRef.value.querySelector('[data-active="true"]') as HTMLElement;
    if (activeTabElement) {
      const containerRect = tabListRef.value.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();
      
      if (tabRect.left < containerRect.left) {
        tabListRef.value.scrollBy({ left: tabRect.left - containerRect.left - 20, behavior: 'smooth' });
      } else if (tabRect.right > containerRect.right) {
        tabListRef.value.scrollBy({ left: tabRect.right - containerRect.right + 20, behavior: 'smooth' });
      }
    }
    checkScrollStatus();
  });
};

/**
 * 监听标签列表变化
 */
watch(
  () => tabs.value.length,
  () => {
    nextTick(() => {
      checkScrollStatus();
    });
  }
);

// 点击外部关闭右键菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.context-menu')) {
    closeContextMenu();
  }
};

onMounted(() => {
  // 初始化当前路由标签
  tabBarStore.addTabFromRoute(route);
  
  // 检查滚动状态
  checkScrollStatus();
  
  // 监听滚动事件
  tabListRef.value?.addEventListener('scroll', checkScrollStatus);
  
  // 监听窗口大小变化
  window.addEventListener('resize', checkScrollStatus);
  
  // 监听点击事件关闭右键菜单
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  // 移除路由监听
  unwatchRoute();
  
  // 移除事件监听
  tabListRef.value?.removeEventListener('scroll', checkScrollStatus);
  window.removeEventListener('resize', checkScrollStatus);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div
    ref="tabBarRef"
    class="h-10 bg-background border-b border-border/60 flex items-center px-2 gap-1 flex-shrink-0"
  >
    <!-- 向左滚动按钮 -->
    <Button
      v-show="canScrollLeft"
      variant="ghost"
      size="icon"
      class="h-6 w-6 flex-shrink-0"
      @click="scrollLeftFn"
    >
      <ChevronLeft class="h-4 w-4" />
    </Button>

    <!-- 标签列表 -->
    <div
      ref="tabListRef"
      class="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      <div
        v-for="tab in tabs"
        :key="tab.path"
        class="group relative flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200 whitespace-nowrap select-none"
        :class="[
          activeTabPath === tab.path
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
        ]"
        :data-active="activeTabPath === tab.path"
        @click="handleTabClick(tab.path)"
        @contextmenu="handleContextMenu($event, tab.path)"
      >
        <!-- 图标 -->
        <component
          :is="getTabIcon(tab.icon)"
          v-if="tab.icon && getTabIcon(tab.icon)"
          class="h-3.5 w-3.5"
        />
        
        <!-- 标题 -->
        <span class="max-w-[120px] truncate">{{ getTabTitle(tab) }}</span>
        
        <!-- 关闭按钮 -->
        <Button
          v-if="tab.closable"
          variant="ghost"
          size="icon"
          class="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="handleTabClose(tab.path, $event)"
        >
          <X class="h-3 w-3" />
        </Button>
        
        <!-- 激活指示器 -->
        <div
          v-if="activeTabPath === tab.path"
          class="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
        />
      </div>
    </div>

    <!-- 向右滚动按钮 -->
    <Button
      v-show="canScrollRight"
      variant="ghost"
      size="icon"
      class="h-6 w-6 flex-shrink-0"
      @click="scrollRightFn"
    >
      <ChevronRight class="h-4 w-4" />
    </Button>

    <!-- 更多操作下拉菜单 -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="h-6 w-6 flex-shrink-0"
        >
          <MoreHorizontal class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-40">
        <DropdownMenuItem
          class="cursor-pointer"
          :disabled="!tabBarStore.canCloseOthers"
          @click="handleCloseOthers"
        >
          <MoreHorizontal class="h-4 w-4 mr-2" />
          {{ t('common.tabbar.closeOthers') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="cursor-pointer"
          :disabled="!tabBarStore.canCloseAll"
          @click="handleCloseAll"
        >
          <X class="h-4 w-4 mr-2" />
          {{ t('common.tabbar.closeAll') }}
        </DropdownMenuItem>
        <DropdownMenuItem
          class="cursor-pointer"
          @click="handleRefresh"
        >
          <RotateCcw class="h-4 w-4 mr-2" />
          {{ t('common.tabbar.refresh') }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- 自定义右键菜单 -->
    <Teleport to="body">
      <div
        v-if="contextMenuVisible"
        class="context-menu fixed z-50 min-w-[160px] bg-popover border border-border rounded-md shadow-lg py-1"
        :style="{
          left: `${contextMenuPosition.x}px`,
          top: `${contextMenuPosition.y}px`,
        }"
      >
        <button
          class="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          :disabled="!contextMenuTabPath || tabs.find(t => t.path === contextMenuTabPath)?.affix"
          @click="handleCloseCurrent"
        >
          <X class="h-4 w-4 mr-2" />
          {{ t('common.tabbar.closeCurrent') }}
        </button>
        <button
          class="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          :disabled="!tabBarStore.canCloseOthers"
          @click="handleCloseOthers"
        >
          <MoreHorizontal class="h-4 w-4 mr-2" />
          {{ t('common.tabbar.closeOthers') }}
        </button>
        <button
          class="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          :disabled="!tabBarStore.canCloseAll"
          @click="handleCloseAll"
        >
          <X class="h-4 w-4 mr-2" />
          {{ t('common.tabbar.closeAll') }}
        </button>
        <div class="h-px bg-border my-1" />
        <button
          class="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center"
          @click="handleRefresh"
        >
          <RotateCcw class="h-4 w-4 mr-2" />
          {{ t('common.tabbar.refresh') }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* 隐藏滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* 标签项动画 */
.tab-item-enter-active,
.tab-item-leave-active {
  transition: all 0.2s ease;
}

.tab-item-enter-from,
.tab-item-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
