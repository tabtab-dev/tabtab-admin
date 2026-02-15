<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from '@/components/Icon';
import { useMenuUtils, formatBadge, getButtonVariant, getIconClass } from '@/layouts/composables/useMenuUtils';
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
  /** 是否激活 */
  active: boolean;
}

const props = defineProps<Props>();

/**
 * 组件事件
 */
interface Emits {
  /** 导航事件 */
  (e: 'navigate', path: string): void;
}

const emit = defineEmits<Emits>();

/**
 * 使用菜单工具
 */
const { getAriaCurrent } = useMenuUtils();

/**
 * 处理点击
 */
const handleClick = (): void => {
  emit('navigate', props.item.path);
};

/**
 * 按钮变体
 */
const variant = computed(() => getButtonVariant(props.active));

/**
 * 图标类名
 */
const iconClass = computed(() => getIconClass(props.active));

/**
 * 菜单标题（翻译后）
 */
const menuTitle = computed(() => {
  return props.item.i18nKey ? t(props.item.i18nKey) : props.item.title;
});

/**
 * ARIA 标签（折叠状态下使用）
 */
const ariaLabel = computed(() => {
  if (!props.collapsed) return undefined;
  return props.item.badge
    ? `${menuTitle.value} (${props.item.badge} 条通知)`
    : menuTitle.value;
});
</script>

<template>
  <!-- 折叠状态：显示 Tooltip -->
  <Tooltip v-if="collapsed">
    <TooltipTrigger as-child>
      <Button
        :variant="variant"
        size="icon"
        role="menuitem"
        :aria-label="ariaLabel"
        :aria-current="getAriaCurrent(item.path)"
        :class="[
          'relative h-10 w-10 transition-colors duration-150 rounded-lg',
          active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
        ]"
        @click="handleClick"
      >
        <Icon
          v-if="item.icon"
          :name="item.icon"
          class="h-5 w-5"
          aria-hidden="true"
        />

        <Badge
          v-if="item.badge"
          variant="destructive"
          class="absolute -top-1 -left-1 h-4 min-w-4 !px-1 text-[10px]"
          role="status"
          :aria-label="`${item.badge} 条通知`"
        >
          {{ formatBadge(item.badge) }}
        </Badge>
      </Button>
    </TooltipTrigger>

    <TooltipContent side="right" :side-offset="10">
      <div class="flex items-center gap-2">
        <span>{{ menuTitle }}</span>
        <Badge
          v-if="item.badge"
          variant="destructive"
          class="h-4 px-1 text-[10px]"
        >
          {{ item.badge }}
        </Badge>
      </div>
    </TooltipContent>
  </Tooltip>

  <!-- 展开状态：显示完整按钮 -->
  <Button
    v-else
    :variant="variant"
    role="menuitem"
    :aria-current="getAriaCurrent(item.path)"
    :class="[
      'w-full justify-start gap-2 h-9 px-3 group transition-colors duration-150 rounded-lg',
      active 
        ? 'bg-primary/10 text-primary hover:bg-primary/15' 
        : 'hover:bg-accent hover:text-accent-foreground'
    ]"
    @click="handleClick"
  >
    <Icon
      v-if="item.icon"
      :name="item.icon"
      :class="[
        'h-4 w-4',
        active ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
      ]"
      aria-hidden="true"
    />

    <span class="flex-1 text-left truncate text-sm">{{ menuTitle }}</span>

    <Badge
      v-if="item.badge"
      variant="destructive"
      class="h-4 px-1.5 text-[10px] font-medium"
      role="status"
    >
      {{ formatBadge(item.badge) }}
    </Badge>
  </Button>
</template>
