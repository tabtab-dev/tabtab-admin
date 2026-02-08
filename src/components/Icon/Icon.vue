<script setup lang="ts">
/**
 * 动态图标组件
 * @description 基于 lucide-vue-next 的动态图标加载组件
 */
import type { Component } from 'vue';

/**
 * 组件属性
 */
interface Props {
  /** 图标名称（PascalCase，如 'Home', 'User', 'Settings'） */
  name: string;
  /** 图标大小 */
  size?: number | string;
  /** 图标类名 */
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
});

/**
 * 图标缓存
 */
const iconCache = new Map<string, Component>();

/**
 * 使用 Vite 的 import.meta.glob 预加载所有图标模块
 */
const iconModules = import.meta.glob('/node_modules/lucide-vue-next/dist/esm/icons/*.js', {
  eager: false,
  import: 'default'
});

/**
 * 将 PascalCase 图标名称转换为 kebab-case 文件名
 */
function toKebabCase(iconName: string): string {
  return iconName
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * 动态加载图标
 */
async function loadIcon(iconName: string): Promise<Component | null> {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  try {
    const fileName = toKebabCase(iconName);
    const modulePath = `/node_modules/lucide-vue-next/dist/esm/icons/${fileName}.js`;
    
    const moduleLoader = iconModules[modulePath];
    
    if (!moduleLoader) {
      console.warn(`[Icon] Icon module not found: ${iconName}`);
      return null;
    }

    const icon = await moduleLoader() as Component;
    
    if (icon) {
      iconCache.set(iconName, icon);
      return icon;
    }
    return null;
  } catch {
    console.warn(`[Icon] Failed to load icon: ${iconName}`);
    return null;
  }
}

/**
 * 当前图标组件
 */
const currentIcon = shallowRef<Component | null>(iconCache.get(props.name) || null);

/**
 * 计算图标尺寸
 */
const iconSize = computed(() => {
  const size = props.size;
  return typeof size === 'number' ? size : parseInt(size, 10);
});

/**
 * 监听图标名称变化，动态加载新图标
 */
watch(
  () => props.name,
  async (newName) => {
    if (!newName) {
      currentIcon.value = null;
      return;
    }
    
    const icon = await loadIcon(newName);
    currentIcon.value = icon;
  },
  { immediate: true }
);
</script>

<template>
  <component
    :is="currentIcon"
    v-if="currentIcon"
    :size="iconSize"
    :class="props.class"
  />
  <span v-else class="inline-block" :style="{ width: iconSize + 'px', height: iconSize + 'px' }"></span>
</template>
