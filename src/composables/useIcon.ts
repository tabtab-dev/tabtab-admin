/**
 * 图标工具函数
 * @description 提供图标获取功能，使用 lucide-vue-next
 */
import { computed, type Ref, type MaybeRefOrGetter, toValue } from 'vue';
import * as icons from 'lucide-vue-next';
import type { Component } from 'vue';

/**
 * 将各种命名格式转换为 PascalCase
 */
function toPascalCase(name: string): string {
  return name
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^[a-z]/, (first) => first.toUpperCase());
}

/**
 * 获取图标组件
 * @param iconName - 图标名称（支持 kebab-case, camelCase, PascalCase）
 * @returns 图标组件或 undefined
 */
export function getIcon(iconName?: string): Component | undefined {
  if (!iconName) return undefined;
  const pascalName = toPascalCase(iconName);
  return (icons as Record<string, Component>)[pascalName];
}

/**
 * 响应式获取图标
 * @param iconName - 图标名称（支持响应式）
 * @returns 图标组件的计算属性
 */
export function useIcon(iconName: MaybeRefOrGetter<string | undefined>) {
  return computed(() => getIcon(toValue(iconName)));
}
