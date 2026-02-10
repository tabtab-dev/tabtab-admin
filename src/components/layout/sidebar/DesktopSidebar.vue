<script setup lang="ts">
import type { SplitterPanel } from 'reka-ui';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useThemeStore } from '@/stores/global/theme';
import { pxToPercent, useMenuUtils } from '@/layouts/composables/useMenuUtils';
import { getGroupTitleKey, groupMenus } from './config';
import type { SidebarConfig, SidebarMenuItem } from '@/types/menu';
import SidebarItem from './SidebarItem.vue';
import SidebarSubMenu from './SidebarSubMenu.vue';
import { useAuthStore } from '@/stores/global/auth';
import {
  PanelLeft,
  PanelRight,
} from 'lucide-vue-next';

const { t } = useI18n();

/**
 * 组件属性
 */
interface Props {
  /** 侧栏配置 */
  config: SidebarConfig;
  /** 是否折叠 */
  collapsed: boolean;
  /** 当前尺寸（百分比） */
  currentSize: number;
  /** 是否拖拽中 */
  isDragging: boolean;
  /** 展开的子菜单 keys */
  expandedKeys: Set<string>;
}

const props = defineProps<Props>();

/**
 * 组件事件
 */
interface Emits {
  /** 调整尺寸 */
  (e: 'resize', size: number): void;
  /** 拖拽状态变化 */
  (e: 'dragging', dragging: boolean): void;
  /** 切换子菜单 */
  (e: 'toggle-sub-menu', key: string): void;
  /** 导航 */
  (e: 'navigate', path: string): void;
  /** 切换折叠状态 */
  (e: 'toggle-collapse'): void;
}

const emit = defineEmits<Emits>();

const themeStore = useThemeStore();
const authStore = useAuthStore();

/**
 * 侧边栏面板 ref
 */
const sidebarPanelRef = ref<InstanceType<typeof SplitterPanel> | null>(null);

/**
 * 侧边栏宽度（像素）
 */
const sidebarWidth = computed(() => themeStore.layoutConfig.sidebarWidth);

/**
 * 折叠宽度
 */
const collapsedWidth = computed(() => themeStore.layoutConfig.sidebarCollapsedWidth);

/**
 * 面板大小（百分比）
 */
const panelSize = computed(() => pxToPercent(sidebarWidth.value, window.innerWidth));

/**
 * 最小尺寸（百分比）
 */
const minSizePercent = computed(() => pxToPercent(props.config.minWidth, window.innerWidth));

/**
 * 最大尺寸（百分比）
 */
const maxSizePercent = computed(() => pxToPercent(props.config.maxWidth, window.innerWidth));

/**
 * 按分组组织的菜单
 */
const groupedMenus = computed(() => groupMenus(props.config.menus));

/**
 * 使用菜单工具函数
 */
const { isActive, isExpanded: checkExpanded } = useMenuUtils({
  expandedKeys: computed(() => props.expandedKeys),
});

/**
 * 判断是否展开
 */
const isExpanded = (key: string): boolean => {
  return checkExpanded(key);
};

/**
 * 处理导航
 * @param path - 导航路径
 */
const handleNavigate = (path: string): void => {
  emit('navigate', path);
};

/**
 * 切换子菜单
 * @param key - 菜单 key
 */
const handleToggleSubMenu = (key: string): void => {
  emit('toggle-sub-menu', key);
};

/**
 * 判断是否有子菜单
 */
const hasChildren = (item: SidebarMenuItem): boolean => {
  return !!item.children && item.children.length > 0;
};

/**
 * 获取分组标题
 * @param groupKey 分组 key
 * @returns 翻译后的标题
 */
const getGroupTitle = (groupKey: string): string => {
  return t(getGroupTitleKey(groupKey));
};

/**
 * 处理折叠切换
 */
const handleToggleCollapse = (): void => {
  emit('toggle-collapse');
};

/**
 * 用户姓名首字母
 */
const userInitials = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || 'U';
});

/**
 * 监听主题配置宽度变化，使用 resize() 方法实时调整面板大小
 */
watch(() => themeStore.layoutConfig.sidebarWidth, (newWidth) => {
  document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
  // 使用 resize() 方法实时调整面板大小
  if (sidebarPanelRef.value && !props.collapsed) {
    const newPercent = pxToPercent(newWidth, window.innerWidth);
    sidebarPanelRef.value.resize(newPercent);
  }
});
</script>

<template>
  <ResizablePanelGroup
    direction="horizontal"
    class="h-full hidden lg:flex"
  >
    <!-- 侧栏面板 -->
    <ResizablePanel
      ref="sidebarPanelRef"
      :min-size="minSizePercent"
      :max-size="maxSizePercent"
      :default-size="panelSize"
      @resize="(size: number) => $emit('resize', size)"
      class="flex flex-col border-r bg-background"
      :class="{ 'transition-none': isDragging }"
      :style="collapsed ? { flex: `0 0 ${collapsedWidth}px` } : {}"
    >
      <!-- 菜单列表 -->
      <ScrollArea class="flex-1 h-0">
        <nav class="p-3 space-y-4 relative z-10">
          <!-- 按分组渲染菜单 -->
          <template v-for="(items, groupKey) in groupedMenus" :key="groupKey">
            <!-- 分组卡片（仅展开状态显示） - 优化后的设计 -->
            <div
              v-if="!collapsed && items.length > 0"
              class="bg-muted/40 border border-border/50 p-2.5 space-y-1.5 rounded-xl"
            >
              <!-- 分组标题 - 优化后的样式 -->
              <div class="px-2 py-1 flex items-center gap-2">
                <div class="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                <span class="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                  {{ getGroupTitle(groupKey) }}
                </span>
              </div>

              <!-- 分组菜单项 -->
              <template v-for="item in items" :key="item.key">
                <!-- 有子菜单 -->
                <SidebarSubMenu
                  v-if="hasChildren(item)"
                  :item="item"
                  :collapsed="collapsed"
                  :active="isActive(item.path)"
                  :expanded="isExpanded(item.key)"
                  @toggle="handleToggleSubMenu(item.key)"
                  @navigate="handleNavigate"
                />

                <!-- 无子菜单 -->
                <SidebarItem
                  v-else
                  :item="item"
                  :collapsed="collapsed"
                  :active="isActive(item.path)"
                  @navigate="handleNavigate"
                />
              </template>
            </div>

            <!-- 折叠状态：只渲染菜单项，不显示分组 -->
            <div v-else-if="collapsed" class="space-y-2 flex flex-col items-center">
              <template v-for="item in items" :key="item.key">
                <SidebarSubMenu
                  v-if="hasChildren(item)"
                  :item="item"
                  :collapsed="collapsed"
                  :active="isActive(item.path)"
                  :expanded="isExpanded(item.key)"
                  @toggle="handleToggleSubMenu(item.key)"
                  @navigate="handleNavigate"
                />
                <SidebarItem
                  v-else
                  :item="item"
                  :collapsed="collapsed"
                  :active="isActive(item.path)"
                  @navigate="handleNavigate"
                />
              </template>
            </div>
          </template>
        </nav>
      </ScrollArea>

      <!-- 底部区域 - 展开状态：左侧用户信息 + 右侧折叠按钮 -->
      <div class="border-t border-border/50 bg-muted/30">
        <slot name="footer">
          <!-- 展开状态 -->
          <div
            v-if="!collapsed"
            class="p-3 flex items-center justify-between"
          >
            <!-- 左侧：用户信息 -->
            <div class="flex items-center gap-2 min-w-0">
              <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-semibold text-primary">{{ userInitials }}</span>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-medium truncate">{{ authStore.user?.name || '用户' }}</span>
                <span class="text-[10px] text-muted-foreground truncate">{{ authStore.user?.email || 'user@example.com' }}</span>
              </div>
            </div>
            <!-- 右侧：折叠按钮 -->
            <button
              @click="handleToggleCollapse"
              class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
              :title="t('common.sidebar.collapse')"
            >
              <PanelLeft class="h-4 w-4" />
            </button>
          </div>
          <!-- 折叠状态：只显示展开按钮 -->
          <div
            v-else
            class="py-3 flex justify-center"
          >
            <button
              @click="handleToggleCollapse"
              class="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted hover:text-foreground transition-colors"
              :title="t('common.sidebar.expand')"
            >
              <PanelRight class="h-5 w-5" />
            </button>
          </div>
        </slot>
      </div>
    </ResizablePanel>

    <!-- 拖拽手柄 -->
    <ResizableHandle
      v-if="!collapsed"
      with-handle
      class="w-1.5 bg-transparent hover:bg-primary/20 transition-colors relative after:absolute after:inset-y-4 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-8 after:rounded-full after:bg-border/60 hover:after:bg-primary/50"
      @dragging="(dragging: boolean) => $emit('dragging', dragging)"
    />

    <!-- 内容面板 - 自动填充剩余空间 -->
    <ResizablePanel :min-size="50">
      <main class="h-full bg-background">
        <slot />
      </main>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
