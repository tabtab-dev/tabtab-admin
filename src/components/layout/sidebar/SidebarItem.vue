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
  <!-- 折叠状态：显示 Tooltip - 优化后的设计 -->
  <Tooltip v-if="collapsed">
    <TooltipTrigger as-child>
      <Button
        :variant="variant"
        size="icon"
        role="menuitem"
        :aria-label="ariaLabel"
        :aria-current="getAriaCurrent(item.path)"
        :class="[
          'relative h-10 w-10 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg',
          active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'hover:bg-primary/10 hover:text-primary'
        ]"
        @click="handleClick"
      >
        <Icon
          v-if="item.icon"
          :name="item.icon"
          class="h-5 w-5"
          aria-hidden="true"
        />

        <!-- 徽标 - 折叠状态下显示在左上角 - 使用 shadcn-vue Badge 组件 -->
        <Badge
          v-if="item.badge"
          variant="destructive"
          class="absolute -top-1 -left-1 h-4 min-w-4 !px-1 text-[10px] shadow-sm animate-in zoom-in-50"
          role="status"
          :aria-label="`${item.badge} 条通知`"
        >
          {{ formatBadge(item.badge) }}
        </Badge>

        <!-- 激活状态指示点 -->
        <span
          v-if="active"
          class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-primary-foreground rounded-full border-2 border-background"
          aria-hidden="true"
        />
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

  <!-- 展开状态：显示完整按钮 - 优化后的设计 -->
  <Button
    v-else
    :variant="variant"
    role="menuitem"
    :aria-current="getAriaCurrent(item.path)"
    :class="[
      'w-full justify-start gap-2.5 h-9 px-2.5 group transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative overflow-hidden rounded-md',
      active ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90' : 'hover:bg-primary/10 hover:text-primary'
    ]"
    @click="handleClick"
  >
    <!-- 激活状态左侧指示器 - 优化后的流动光效 -->
    <span
      v-if="active"
      class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-primary-foreground/40 via-primary-foreground/60 to-primary-foreground/40 rounded-r-full"
      aria-hidden="true"
    />

    <!-- 悬停时的背景光效 -->
    <span
      v-if="!active"
      class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
      aria-hidden="true"
    />

    <Icon
      v-if="item.icon"
      :name="item.icon"
      :class="[
        'h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200',
        active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
      ]"
      aria-hidden="true"
    />

    <span class="flex-1 text-left truncate font-medium text-sm">{{ menuTitle }}</span>

    <!-- 徽标 - 展开状态下显示为 Badge - 优化后的动画 -->
    <Badge
      v-if="item.badge"
      variant="destructive"
      class="h-4 px-1.5 text-[10px] animate-in zoom-in-50 shadow-sm font-medium"
      role="status"
    >
      {{ formatBadge(item.badge) }}
    </Badge>
  </Button>
</template>
