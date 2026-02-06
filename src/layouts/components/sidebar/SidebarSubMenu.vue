<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useTimeoutFn, useElementBounding, useWindowScroll } from '@vueuse/core';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';
import { useMenuUtils, formatBadge } from '@/layouts/composables/useMenuUtils';
import MenuItemRecursive from './MenuItemRecursive.vue';
import type { MenuItem } from './config';

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
  item: MenuItem;
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
 * 弹窗位置 - 考虑滚动偏移
 */
const popoverPosition = computed<PopoverPosition>(() => ({
  top: top.value - scrollY.value,
  left: left.value + width.value + 8, // 8px 间距
}));

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
        'relative h-10 w-10 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        (active || isChildActive) ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'hover:bg-primary/10 hover:text-primary'
      ]"
      :style="{ borderRadius: 'calc(var(--radius) * 0.8)' }"
    >
      <component
        :is="item.icon"
        class="h-5 w-5"
        aria-hidden="true"
      />

      <!-- 徽标 - 使用 shadcn-vue Badge 组件 -->
      <Badge
        v-if="item.badge"
        variant="destructive"
        class="absolute -top-1 -right-1 h-4 min-w-4 !px-1 text-[10px] shadow-sm animate-in zoom-in-50"
        role="status"
      >
        {{ formatBadge(item.badge) }}
      </Badge>

      <!-- 子菜单数量指示 - 优化后的样式 -->
      <span
        v-else-if="item.children?.length"
        class="absolute -bottom-1 -right-1 h-4 min-w-4 px-1 text-[10px] font-medium flex items-center justify-center rounded-full border shadow-sm z-10"
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
          class="fixed w-56 bg-popover/95 backdrop-blur-sm border border-border/50 shadow-2xl shadow-primary/10 z-[9999] overflow-hidden"
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
            style="box-shadow: -2px 2px 2px rgba(0,0,0,0.02)"
          />

          <!-- 标题区域 - 优化后的设计 -->
          <div class="relative px-4 py-3 border-b border-border/40 bg-gradient-to-r from-muted/30 to-transparent">
            <div class="flex items-center gap-2.5">
              <div
                class="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                :class="(active || isChildActive) ? 'bg-primary/15' : 'bg-muted'"
              >
                <component
                  :is="item.icon"
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

          <!-- 子菜单列表 - 多级递归渲染 -->
          <div class="p-2 space-y-0.5" role="group" :aria-label="`${menuTitle} 子菜单项`">
            <MenuItemRecursive
              v-for="child in item.children"
              :key="child.key"
              :item="child"
              :collapsed="false"
              :level="1"
              @navigate="handleChildNavigate"
            />
          </div>

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
        'w-full justify-between h-9 px-2.5 group transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative overflow-hidden',
        (active || isChildActive) ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90' : 'hover:bg-primary/10 hover:text-primary'
      ]"
      :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }"
      @click="handleParentClick"
    >
      <!-- 激活状态左侧指示器 - 优化后的流动光效 -->
      <span
        v-if="active || isChildActive"
        class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b"
        :class="active ? 'from-primary-foreground/40 via-primary-foreground/60 to-primary-foreground/40' : 'from-primary/30 via-primary/50 to-primary/30'"
        aria-hidden="true"
      />

      <!-- 悬停时的背景光效 -->
      <span
        v-if="!(active || isChildActive)"
        class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
        aria-hidden="true"
      />

      <div class="flex items-center gap-2.5 relative z-10">
        <component
          :is="item.icon"
          :class="[
            'h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200',
            (active || isChildActive) ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
          ]"
          aria-hidden="true"
        />
        <span class="truncate font-medium text-sm">{{ menuTitle }}</span>
      </div>

      <div class="flex items-center gap-1.5 relative z-10">
        <Badge
          v-if="item.badge"
          variant="destructive"
          class="h-4 px-1.5 text-[10px] animate-in zoom-in-50 shadow-sm font-medium"
          role="status"
        >
          {{ formatBadge(item.badge) }}
        </Badge>

        <ChevronDown
          v-if="expanded"
          :class="[
            'h-3.5 w-3.5 transition-transform duration-200',
            (active || isChildActive) ? 'text-primary-foreground/70' : 'text-muted-foreground group-hover:text-foreground'
          ]"
          aria-hidden="true"
        />
        <ChevronRight
          v-else
          :class="[
            'h-3.5 w-3.5 transition-transform duration-200',
            (active || isChildActive) ? 'text-primary-foreground/70' : 'text-muted-foreground group-hover:text-foreground'
          ]"
          aria-hidden="true"
        />
      </div>
    </Button>

    <!-- 子菜单 - 优化后的展开动画 -->
    <Transition
      enter-active-class="transition-all duration-250 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="expanded"
        role="menu"
        :aria-label="`${menuTitle} 子菜单`"
        class="ml-3.5 space-y-0.5 overflow-hidden relative py-0.5"
      >
        <!-- 连接线装饰 - 优化后的样式 -->
        <div class="absolute left-2 top-1.5 bottom-1.5 w-px bg-gradient-to-b from-border/60 via-border/40 to-transparent rounded-full"></div>

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
