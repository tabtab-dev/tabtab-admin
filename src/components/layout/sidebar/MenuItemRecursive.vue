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
 * 获取按钮样式类
 */
const buttonClasses = computed(() => {
  const baseClasses = 'w-full justify-between h-9 px-3 group transition-colors duration-150 rounded-lg';

  if (props.item.disabled) {
    return `${baseClasses} opacity-50 cursor-not-allowed`;
  }

  if (active.value) {
    return `${baseClasses} bg-primary/10 text-primary`;
  }
  if (isChildActive.value) {
    return `${baseClasses} bg-muted/50`;
  }
  return `${baseClasses} hover:bg-accent hover:text-accent-foreground`;
});

/**
 * 获取图标样式类
 */
const iconClasses = computed(() => {
  if (active.value) {
    return 'h-4 w-4 text-primary';
  }
  if (isChildActive.value) {
    return 'h-4 w-4 text-muted-foreground';
  }
  return 'h-4 w-4 text-muted-foreground group-hover:text-foreground';
});

/**
 * 获取展开/收起图标样式类
 */
const expandIconClasses = computed(() => {
  if (active.value || isChildActive.value) {
    return 'h-3.5 w-3.5 text-primary';
  }
  return 'h-3.5 w-3.5 text-muted-foreground';
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
  <div class="relative">
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
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <!-- 图标 -->
        <Icon
          v-if="item.icon"
          :name="item.icon"
          :class="iconClasses"
          aria-hidden="true"
        />
        <span class="truncate text-sm">{{ menuTitle }}</span>
      </div>

      <div class="flex items-center gap-1.5 flex-shrink-0">
        <Badge
          v-if="item.badge"
          variant="destructive"
          class="h-4 px-1.5 text-[10px] font-medium"
          role="status"
        >
          {{ formatBadge(item.badge) }}
        </Badge>

        <!-- 展开/收起图标 -->
        <ChevronDown
          v-if="hasChildren && !collapsed && isExpanded"
          :class="expandIconClasses"
          aria-hidden="true"
        />
        <ChevronRight
          v-else-if="hasChildren && !collapsed"
          :class="expandIconClasses"
          aria-hidden="true"
        />
      </div>
    </Button>

    <!-- 子菜单 -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[500px]"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 max-h-[500px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div
        v-if="hasChildren && isExpanded && !collapsed"
        role="menu"
        :aria-label="`${item.title} 子菜单`"
        class="ml-4 mt-1 space-y-0.5 overflow-hidden border-l border-border/50 pl-3"
      >
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
export default {
  name: 'MenuItemRecursive'
}
</script>
