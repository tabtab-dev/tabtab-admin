<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';
import { useMenuUtils, formatBadge } from '@/layouts/composables/useMenuUtils';
import type { MenuItem } from './config';

/**
 * 组件属性
 */
interface Props {
  /** 菜单项数据 */
  item: MenuItem;
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
 * 缩进样式
 */
const indentStyle = computed(() => ({
  paddingLeft: `${props.level * 12 + 12}px`,
}));

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
</script>

<template>
  <div class="space-y-0.5">
    <!-- 菜单项 -->
    <Button
      :variant="active || isChildActive ? 'default' : 'ghost'"
      role="menuitem"
      :aria-expanded="hasChildren ? isExpanded : undefined"
      :aria-haspopup="hasChildren ? true : undefined"
      :aria-current="getAriaCurrent(item.path)"
      :disabled="item.disabled"
      class="w-full justify-between h-9 px-3 group transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative overflow-hidden"
      :class="[
        (active || isChildActive)
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90'
          : 'hover:bg-primary/10 hover:text-primary',
        item.disabled && 'opacity-50 cursor-not-allowed'
      ]"
      :style="{ borderRadius: 'calc(var(--radius) * 0.6)' }"
      @click="handleClick"
    >
      <!-- 激活状态左侧指示器 -->
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

      <div class="flex items-center gap-2.5 relative z-10 flex-1 min-w-0">
        <component
          :is="item.icon"
          :class="[
            'h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200',
            (active || isChildActive) ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
          ]"
          aria-hidden="true"
        />
        <span class="truncate font-medium text-sm">{{ item.title }}</span>
      </div>

      <div class="flex items-center gap-1.5 relative z-10 flex-shrink-0">
        <Badge
          v-if="item.badge"
          variant="destructive"
          class="h-4 px-1.5 text-[10px] animate-in zoom-in-50 shadow-sm font-medium"
          role="status"
        >
          {{ formatBadge(item.badge) }}
        </Badge>

        <!-- 展开/收起图标 -->
        <template v-if="hasChildren && !collapsed">
          <ChevronDown
            v-if="isExpanded"
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
        </template>
      </div>
    </Button>

    <!-- 子菜单 - 递归渲染 -->
    <Transition
      enter-active-class="transition-all duration-250 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="hasChildren && isExpanded && !collapsed"
        role="menu"
        :aria-label="`${item.title} 子菜单`"
        class="space-y-0.5 overflow-hidden relative py-0.5"
        :style="indentStyle"
      >
        <!-- 连接线装饰 -->
        <div
          v-if="level < 2"
          class="absolute left-2 top-1.5 bottom-1.5 w-px bg-gradient-to-b from-border/60 via-border/40 to-transparent rounded-full"
        />

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
