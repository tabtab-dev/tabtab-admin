<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { SplitterPanel } from 'reka-ui';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useThemeStore } from '@/stores/theme';
import { pxToPercent } from '@/layouts/composables/useMenuUtils';
import type { MenuItem, SidebarConfig } from './config';
import SidebarItem from './SidebarItem.vue';
import SidebarSubMenu from './SidebarSubMenu.vue';
import Logo from '@/components/Logo.vue';

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
  /** 更新折叠状态 */
  (e: 'update:collapsed', value: boolean): void;
  /** 调整尺寸 */
  (e: 'resize', size: number): void;
  /** 拖拽状态变化 */
  (e: 'dragging', dragging: boolean): void;
  /** 切换子菜单 */
  (e: 'toggle-sub-menu', key: string): void;
  /** 导航 */
  (e: 'navigate', path: string): void;
}

const emit = defineEmits<Emits>();

const route = useRoute();
const themeStore = useThemeStore();

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
const groupedMenus = computed(() => {
  const groups: Record<string, MenuItem[]> = {};
  
  props.config.menus.forEach(item => {
    const group = item.group || 'default';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
  });
  
  return groups;
});

/**
 * 分组标题映射
 */
const groupTitles: Record<string, string> = {
  main: '主要菜单',
  analytics: '数据分析',
  system: '系统',
  default: '菜单',
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
const hasChildren = (item: MenuItem): boolean => {
  return !!item.children && item.children.length > 0;
};

/**
 * 判断是否激活
 */
const isActive = (path: string): boolean => {
  return route.path === path || (path !== '/' && route.path.startsWith(path));
};

/**
 * 判断是否展开
 */
const isExpanded = (key: string): boolean => {
  return props.expandedKeys.has(key);
};

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
      <!-- 侧边栏头部 Logo 区域 - 优化后的设计 -->
      <div
        class="flex items-center border-b border-border/40 bg-gradient-to-r from-background to-muted/20 transition-all duration-300 ease-in-out overflow-hidden"
        :class="collapsed ? 'justify-center px-2 py-3.5' : 'gap-3 px-4 py-3.5'"
      >
        <!-- Logo 图标 - 支持主题色切换 -->
        <Logo :size="36" :collapsed="collapsed" />
        <div
          class="flex flex-col min-w-0 transition-all duration-300 ease-in-out"
          :class="collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'"
        >
          <span class="text-sm font-bold tracking-tight leading-tight truncate">TabTab Admin</span>
          <span class="text-[10px] text-muted-foreground/80 leading-tight font-medium">管理系统</span>
        </div>
      </div>

      <!-- 菜单列表 -->
      <ScrollArea class="flex-1 h-0">
        <nav class="p-3 space-y-4 relative z-10">
          <!-- 按分组渲染菜单 -->
          <template v-for="(items, groupKey) in groupedMenus" :key="groupKey">
            <!-- 分组卡片（仅展开状态显示） - 优化后的设计 -->
            <div
              v-if="!collapsed && items.length > 0"
              class="bg-muted/30 border border-border/40 p-2 space-y-1"
              :style="{ borderRadius: 'calc(var(--radius))' }"
            >
              <!-- 分组标题 - 优化后的样式 -->
              <div class="px-2.5 py-1.5 flex items-center gap-2">
                <div class="h-1.5 w-1.5 rounded-full bg-primary/70"></div>
                <span class="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {{ groupTitles[groupKey] || groupKey }}
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
            <div v-else-if="collapsed" class="space-y-2">
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

      <!-- 底部区域 - 优化后的设计 -->
      <div class="p-3 border-t border-border/40 bg-muted/20">
        <slot name="footer">
          <!-- 展开状态显示完整信息 -->
          <div
            class="flex items-center transition-all duration-300 ease-in-out"
            :class="collapsed ? 'justify-center' : 'justify-between px-2'"
          >
            <div
              class="flex items-center"
              :class="collapsed ? '' : 'gap-2'"
            >
              <span class="relative flex h-2 w-2 flex-shrink-0">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span
                class="text-xs text-muted-foreground font-medium transition-all duration-300 whitespace-nowrap"
                :class="collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
              >在线</span>
            </div>
            <span
              class="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40 transition-all duration-300 whitespace-nowrap"
              :class="collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'"
            >v1.0.0</span>
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
