<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';
import { Icon } from '@/components/Icon';
import { useMenuUtils, formatBadge } from '@/layouts/composables/useMenuUtils';
import type { SidebarMenuItem } from '@/types/menu';

const { t } = useI18n();

/**
 * 组件属性
 */
interface Props {
  /** 菜单项数据 */
  item: SidebarMenuItem;
  /** 是否折叠 */
  collapsed: boolean;
  /** 当前层级 */
  level?: number;
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
});

/**
 * 组件事件
 */
const emit = defineEmits<{
  /** 导航事件 */
  (e: 'navigate', path: string): void;
}>();

const route = useRoute();
const { isActive, hasActiveChild, getAriaCurrent } = useMenuUtils();

/**
 * 是否展开
 */
const isExpanded = ref(props.item.defaultExpanded ?? false);

/**
 * 是否激活
 */
const active = computed(() => isActive(props.item.path));

/**
 * 是否有子菜单处于激活状态
 */
const isChildActive = computed(() => hasActiveChild(props.item.children));

/**
 * 是否有子菜单
 */
const hasChildren = computed(() => {
  return !!props.item.children && props.item.children.length > 0;
});

/**
 * 获取按钮样式类 - 根据层级和激活状态返回不同的样式
 */
const buttonClasses = computed(() => {
  const baseClasses = 'w-full justify-between h-9 px-3 group transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative overflow-hidden rounded-lg touch-manipulation';

  if (props.item.disabled) {
    return `${baseClasses} opacity-50 cursor-not-allowed`;
  }

  // 深层级菜单（level>=1，即二级及以上）
  if (active.value) {
    return `${baseClasses} bg-primary/10 text-primary shadow-sm`;
  }
  if (isChildActive.value) {
    return `${baseClasses} bg-muted/50 text-foreground shadow-sm`;
  }
  return `${baseClasses} hover:bg-muted/60 hover:shadow-sm`;
});

/**
 * 获取左侧指示器样式 - 根据层级返回不同的指示器样式
 */
const indicatorClasses = computed(() => {
  // 深层级使用圆点指示器
  if (active.value) {
    return 'absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary shadow-sm';
  }
  if (isChildActive.value) {
    return 'absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary/50';
  }
  return null;
});

/**
 * 获取图标样式类
 */
const iconClasses = computed(() => {
  const baseClasses = 'h-4 w-4 transition-colors duration-200';

  if (active.value) {
    return `${baseClasses} text-primary`;
  }
  if (isChildActive.value) {
    return `${baseClasses} text-primary/70 group-hover:text-primary`;
  }
  return `${baseClasses} text-muted-foreground group-hover:text-primary`;
});

/**
 * 获取展开/收起图标样式类
 */
const expandIconClasses = computed(() => {
  const baseClasses = 'h-3.5 w-3.5 transition-transform duration-200';

  if (active.value || isChildActive.value) {
    return `${baseClasses} text-primary`;
  }
  return `${baseClasses} text-muted-foreground group-hover:text-foreground`;
});

/**
 * 处理点击
 */
const handleClick = (): void => {
  if (hasChildren.value && !props.collapsed) {
    isExpanded.value = !isExpanded.value;
  } else {
    emit('navigate', props.item.path);
  }
};

/**
 * 处理子菜单导航
 */
const handleChildNavigate = (path: string): void => {
  emit('navigate', path);
};

/**
 * 菜单标题（翻译后）
 */
const menuTitle = computed(() => {
  return props.item.i18nKey ? t(props.item.i18nKey) : props.item.title;
});
</script>

<template>
  <div class="relative pl-5">
    <!-- 左侧连接线 - 每个菜单项都有 -->
    <div 
      v-if="level >= 1"
      class="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-gradient-to-r from-primary/30 to-transparent"
    />
    
    <!-- 菜单项 -->
    <Button
      :variant="active || isChildActive ? 'default' : 'ghost'"
      role="menuitem"
      :aria-expanded="hasChildren ? isExpanded : undefined"
      :aria-haspopup="hasChildren ? true : undefined"
      :aria-current="getAriaCurrent(item.path)"
      :disabled="item.disabled"
      :class="buttonClasses"
      @click="handleClick"
    >
      <!-- 激活状态左侧指示器 -->
      <span
        v-if="indicatorClasses"
        :class="indicatorClasses"
        aria-hidden="true"
      />

      <!-- 激活状态背景光效 -->
      <span
        v-if="active"
        class="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent"
        aria-hidden="true"
      />

      <!-- 悬停时的背景光效 - 仅非激活状态显示 -->
      <span
        v-if="!active && !isChildActive"
        class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
        aria-hidden="true"
      />

      <div class="flex items-center gap-2 relative z-10 flex-1 min-w-0">
        <!-- 图标容器 -->
        <div
          v-if="item.icon"
          :class="[
            'h-6 w-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200',
            active ? 'bg-primary/15' : 'bg-muted/50 group-hover:bg-primary/10'
          ]"
        >
          <Icon
            :name="item.icon"
            :class="iconClasses"
            aria-hidden="true"
          />
        </div>
        <span class="truncate font-medium text-sm">{{ menuTitle }}</span>
      </div>

      <div class="flex items-center gap-1.5 relative z-10 flex-shrink-0">
        <Badge
          v-if="item.badge"
          variant="destructive"
          class="h-4 px-1.5 text-[10px] animate-in zoom-in-50 font-medium shadow-sm"
          role="status"
        >
          {{ formatBadge(item.badge) }}
        </Badge>

        <!-- 展开/收起图标容器 -->
        <div
          v-if="hasChildren && !collapsed"
          :class="[
            'h-5 w-5 rounded flex items-center justify-center transition-all duration-200',
            (active || isChildActive) ? 'bg-primary/10' : 'bg-muted/50 group-hover:bg-primary/5'
          ]"
        >
          <ChevronDown
            v-if="isExpanded"
            :class="expandIconClasses"
            aria-hidden="true"
          />
          <ChevronRight
            v-else
            :class="expandIconClasses"
            aria-hidden="true"
          />
        </div>
      </div>
    </Button>

    <!-- 子菜单 - 递归渲染 -->
    <Transition
      enter-active-class="transition-all duration-250 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[500px]"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[500px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div
        v-if="hasChildren && isExpanded && !collapsed"
        role="menu"
        :aria-label="`${item.title} 子菜单`"
        class="mt-1 space-y-0.5 overflow-hidden relative"
      >
        <!-- 子菜单容器背景 -->
        <div class="absolute inset-0 bg-muted/20 rounded-lg" />
        
        <!-- 垂直主干线 - 渐变效果 -->
        <div class="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary/30 via-primary/15 to-primary/30 rounded-full" />

        <!-- 递归渲染子菜单项 -->
        <MenuItemRecursive
          v-for="child in item.children"
          :key="child.key"
          :item="child"
          :collapsed="collapsed"
          :level="level + 1"
          @navigate="handleChildNavigate"
        />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
// 自引用组件
export default {
  name: 'MenuItemRecursive'
}
</script>
