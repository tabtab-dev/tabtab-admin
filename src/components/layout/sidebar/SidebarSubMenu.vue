<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';
import { Icon } from '@/components/Icon';
import { useMenuUtils, formatBadge } from '@/layouts/composables/useMenuUtils';
import MenuItemRecursive from './MenuItemRecursive.vue';
import type { SidebarMenuItem } from '@/types/menu';

const { t } = useI18n();

/**
 * 弹窗位置信息
 */
interface PopoverPosition {
  top: number;
  left: number;
}

/**
 * 组件属性
 */
interface Props {
  /** 菜单项数据 */
  item: SidebarMenuItem;
  /** 是否折叠 */
  collapsed: boolean;
  /** 是否激活 */
  active: boolean;
  /** 是否展开 */
  expanded: boolean;
}

const props = defineProps<Props>();

/**
 * 组件事件
 */
interface Emits {
  /** 切换展开 */
  (e: 'toggle'): void;
  /** 导航事件 */
  (e: 'navigate', path: string): void;
}

const emit = defineEmits<Emits>();
const route = useRoute();

/**
 * 使用菜单工具
 */
const { isActive, hasActiveChild, getAriaCurrent } = useMenuUtils();

/**
 * 按钮元素引用
 */
const buttonRef = ref<HTMLElement | null>(null);

/**
 * 获取按钮位置
 */
const { top, left, width, update: updateBounding } = useElementBounding(buttonRef);

/**
 * 窗口滚动位置
 */
const { y: scrollY } = useWindowScroll();

/**
 * 窗口尺寸
 */
const { height: windowHeight } = useWindowSize();

/**
 * 计算菜单项总数量（包括嵌套子菜单）
 */
const getTotalMenuItemCount = (items: SidebarMenuItem[] | undefined): number => {
  if (!items || items.length === 0) return 0;
  let count = items.length;
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      count += getTotalMenuItemCount(item.children);
    }
  }
  return count;
};

/**
 * 弹窗位置 - 考虑滚动偏移和视口边界
 */
const popoverPosition = computed<PopoverPosition>(() => {
  const rawTop = top.value - scrollY.value;
  // 计算所有可能的子菜单项总数（包括嵌套），用于估算最大高度
  const totalItemCount = getTotalMenuItemCount(props.item.children);
  // 弹框高度 = 标题(60px) + 最大内容高度(400px) + 底部装饰(10px)
  const estimatedPopoverHeight = 470;
  const maxTop = windowHeight.value - estimatedPopoverHeight - 20; // 20px 底部边距

  // 如果弹框底部超出视口，向上调整位置
  const adjustedTop = maxTop > 0 ? Math.min(rawTop, maxTop) : 10;

  return {
    top: Math.max(10, adjustedTop), // 确保顶部至少有 10px 边距
    left: left.value + width.value + 8, // 8px 间距
  };
});

/**
 * 滚动时更新位置
 */
const handleScroll = () => {
  if (showPopover.value) {
    updateBounding();
  }
};

// 监听滚动事件
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

/**
 * 判断是否有子菜单处于激活状态
 */
const isChildActive = computed(() => hasActiveChild(props.item.children));

/** 折叠状态下的子菜单弹窗显示控制 */
const showPopover = ref(false);

/**
 * 延迟关闭弹窗的 timeout 控制
 */
const { start: startHidePopover, stop: stopHidePopover } = useTimeoutFn(() => {
  showPopover.value = false;
}, 150);

/**
 * 处理父菜单点击
 */
const handleParentClick = (): void => {
  if (!props.collapsed) {
    emit('toggle');
  }
};

/**
 * 处理子菜单导航
 */
const handleChildNavigate = (path: string): void => {
  emit('navigate', path);
  showPopover.value = false;
};

/**
 * 处理鼠标进入（折叠状态）
 */
const handleMouseEnter = (): void => {
  if (props.collapsed) {
    stopHidePopover();
    showPopover.value = true;
  }
};

/**
 * 处理鼠标离开（折叠状态）
 */
const handleMouseLeave = (): void => {
  if (props.collapsed) {
    startHidePopover();
  }
};

/**
 * 按钮变体
 */
const variant = computed(() => {
  if (props.active || isChildActive.value) return 'default';
  return 'ghost';
});

/**
 * 菜单标题（翻译后）
 */
const menuTitle = computed(() => {
  return t(props.item.i18nKey);
});

/**
 * ARIA 标签（折叠状态下使用）
 */
const ariaLabel = computed(() => {
  if (!props.collapsed) return undefined;
  const childCount = props.item.children?.length ?? 0;
  return props.item.badge
    ? `${menuTitle.value} (${props.item.badge} 条通知, ${childCount} 个子菜单)`
    : `${menuTitle.value} (${childCount} 个子菜单)`;
});

/**
 * 子菜单数量文本
 */
const childCountText = computed(() => {
  const count = props.item.children?.length ?? 0;
  return t('common.total', { total: count });
});
</script>

<template>
  <!-- 折叠状态：悬停显示子菜单弹窗 -->
  <div
    v-if="collapsed"
    ref="buttonRef"
    class="relative"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 有子菜单时不显示 Tooltip，避免与子菜单弹框重叠 -->
    <Button
      :variant="variant"
      size="icon"
      role="menuitem"
      :aria-label="ariaLabel"
      :aria-expanded="showPopover"
      :aria-haspopup="true"
      :class="[
        'relative h-10 w-10 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg',
        (active || isChildActive) ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10 hover:text-primary'
      ]"
    >
      <Icon
        v-if="item.icon"
        :name="item.icon"
        class="h-5 w-5"
        aria-hidden="true"
      />

      <!-- 徽标 - 使用 shadcn-vue Badge 组件 -->
      <Badge
        v-if="item.badge"
        variant="destructive"
        class="absolute -top-1 left-1 h-4 min-w-4 !px-1 text-[10px] animate-in zoom-in-50"
        role="status"
      >
        {{ formatBadge(item.badge) }}
      </Badge>

      <!-- 子菜单数量指示 - 优化后的样式 -->
      <span
        v-else-if="item.children?.length"
        class="absolute -bottom-1 -right-1 h-4 min-w-4 px-1 text-[10px] font-medium flex items-center justify-center rounded-full border z-10"
        :class="(active || isChildActive) ? 'bg-primary-foreground text-primary border-primary-foreground/50' : 'bg-primary/10 text-primary border-primary/20'"
        aria-hidden="true"
      >
        {{ item.children.length }}
      </span>

      <!-- 激活状态指示点 - 折叠状态下移至左下角避免与子菜单数量重叠 -->
      <span
        v-if="(active || isChildActive) && !item.children?.length"
        class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary-foreground"
        aria-hidden="true"
      />
    </Button>

    <!-- 子菜单弹窗 - 保持原有逻辑 -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-250 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-x-3"
        enter-to-class="opacity-100 scale-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-x-0"
        leave-to-class="opacity-0 scale-95 -translate-x-3"
      >
        <div
          v-if="showPopover"
          role="menu"
          :aria-label="`${menuTitle} 子菜单`"
          class="fixed w-56 bg-popover/95 backdrop-blur-sm border border-border/50 z-[9999] overflow-hidden"
          :style="{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
            borderRadius: 'calc(var(--radius) * 0.9)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(var(--primary), 0.05)'
          }"
          @mouseenter="stopHidePopover(); showPopover = true"
          @mouseleave="startHidePopover()"
        >
          <!-- 箭头指示器 -->
          <div
            class="absolute left-0 top-4 w-2 h-2 bg-popover border-l border-b border-border/50 transform -translate-x-1 rotate-45"
          />

          <!-- 标题区域 - 优化后的设计 -->
          <div class="relative px-4 py-3 border-b border-border/40 bg-gradient-to-r from-muted/30 to-transparent">
            <div class="flex items-center gap-2.5">
              <div
                class="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="(active || isChildActive) ? 'bg-primary/15' : 'bg-muted'"
              >
                <Icon
                  v-if="item.icon"
                  :name="item.icon"
                  class="h-4 w-4"
                  :class="(active || isChildActive) ? 'text-primary' : 'text-muted-foreground'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-foreground truncate">{{ menuTitle }}</p>
                <p class="text-[10px] text-muted-foreground">{{ item.children?.length }} {{ t('common.items') }}</p>
              </div>
            </div>
          </div>

          <!-- 子菜单列表 - 多级递归渲染，使用 shadcn-vue ScrollArea -->
          <ScrollArea :class="item.children && item.children.length > 8 ? 'h-[320px]' : ''">
            <div
              class="p-2 space-y-0.5"
              role="group"
              :aria-label="`${menuTitle} 子菜单项`"
            >
              <MenuItemRecursive
                v-for="child in item.children"
                :key="child.key"
                :item="child"
                :collapsed="false"
                :level="1"
                @navigate="handleChildNavigate"
              />
            </div>
          </ScrollArea>

          <!-- 底部装饰线 -->
          <div class="h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        </div>
      </Transition>
    </Teleport>
  </div>

  <!-- 展开状态：树形结构 - 优化后的设计 -->
  <div v-else class="space-y-0.5">
    <!-- 父菜单 -->
    <Button
      :variant="variant"
      role="menuitem"
      :aria-expanded="expanded"
      :aria-haspopup="true"
      :aria-current="getAriaCurrent(item.path)"
      :class="[
        'w-full justify-between h-10 sm:h-9 px-3 sm:px-2.5 group transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative overflow-hidden rounded-lg touch-manipulation',
        (active || isChildActive) ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-muted/60 hover:shadow-sm'
      ]"
      @click="handleParentClick"
    >
      <!-- 激活状态左侧指示器 - 全高度渐变条 -->
      <span
        v-if="active || isChildActive"
        class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary to-primary rounded-r-full"
        aria-hidden="true"
      />

      <!-- 激活状态背景光效 -->
      <span
        v-if="active || isChildActive"
        class="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent"
        aria-hidden="true"
      />

      <!-- 悬停时的背景光效 -->
      <span
        v-if="!(active || isChildActive)"
        class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
        aria-hidden="true"
      />

      <div class="flex items-center gap-2.5 relative z-10 flex-1 min-w-0">
        <!-- 图标容器 -->
        <div
          :class="[
            'h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200',
            (active || isChildActive) ? 'bg-primary/15' : 'bg-muted/50 group-hover:bg-primary/10'
          ]"
        >
          <Icon
            v-if="item.icon"
            :name="item.icon"
            :class="[
              'h-4 w-4 transition-colors duration-200',
              (active || isChildActive) ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
            ]"
            aria-hidden="true"
          />
        </div>
        <span class="truncate font-medium text-sm">{{ menuTitle }}</span>
      </div>

      <div class="flex items-center gap-1.5 relative z-10">
        <Badge
          v-if="item.badge"
          variant="destructive"
          class="h-4 px-1.5 text-[10px] animate-in zoom-in-50 font-medium shadow-sm"
          role="status"
        >
          {{ formatBadge(item.badge) }}
        </Badge>

        <div
          :class="[
            'h-5 w-5 rounded flex items-center justify-center transition-all duration-200',
            (active || isChildActive) ? 'bg-primary/10' : 'bg-muted/50 group-hover:bg-primary/5'
          ]"
        >
          <ChevronDown
            v-if="expanded"
            :class="[
              'h-3.5 w-3.5 transition-transform duration-200',
              (active || isChildActive) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
            ]"
            aria-hidden="true"
          />
          <ChevronRight
            v-else
            :class="[
              'h-3.5 w-3.5 transition-transform duration-200',
              (active || isChildActive) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
            ]"
            aria-hidden="true"
          />
        </div>
      </div>
    </Button>

    <!-- 子菜单 - 优化后的展开动画 -->
    <Transition
      enter-active-class="transition-all duration-250 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[500px]"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[500px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div
        v-if="expanded"
        role="menu"
        :aria-label="`${menuTitle} 子菜单`"
        class="ml-3 mt-1 space-y-0.5 overflow-hidden relative"
      >
        <!-- 子菜单容器背景 -->
        <div class="absolute inset-0 bg-muted/30 rounded-lg" />
        
        <!-- 垂直主干线 - 渐变虚线效果 -->
        <div class="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-primary/40 rounded-full" />

        <!-- 递归渲染多级子菜单 -->
        <MenuItemRecursive
          v-for="child in item.children"
          :key="child.key"
          :item="child"
          :collapsed="collapsed"
          :level="1"
          @navigate="handleChildNavigate"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 使用 shadcn-vue ScrollArea 组件，无需自定义滚动条样式 */
</style>
