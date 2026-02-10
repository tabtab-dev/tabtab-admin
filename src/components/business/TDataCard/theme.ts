/**
 * TDataCard 主题配置
 * @description 统计卡片组件的主题配置
 */

import type { CardColor, CardSize } from './types'

/**
 * 颜色配置映射
 */
export const colorConfig: Record<CardColor, { bg: string; text: string; border: string; iconBg: string }> = {
  blue: {
    bg: 'bg-blue-50/50',
    text: 'text-blue-600',
    border: 'border-blue-200/50',
    iconBg: 'bg-blue-100'
  },
  green: {
    bg: 'bg-green-50/50',
    text: 'text-green-600',
    border: 'border-green-200/50',
    iconBg: 'bg-green-100'
  },
  purple: {
    bg: 'bg-purple-50/50',
    text: 'text-purple-600',
    border: 'border-purple-200/50',
    iconBg: 'bg-purple-100'
  },
  orange: {
    bg: 'bg-orange-50/50',
    text: 'text-orange-600',
    border: 'border-orange-200/50',
    iconBg: 'bg-orange-100'
  },
  red: {
    bg: 'bg-red-50/50',
    text: 'text-red-600',
    border: 'border-red-200/50',
    iconBg: 'bg-red-100'
  },
  cyan: {
    bg: 'bg-cyan-50/50',
    text: 'text-cyan-600',
    border: 'border-cyan-200/50',
    iconBg: 'bg-cyan-100'
  },
  default: {
    bg: 'bg-muted/30',
    text: 'text-foreground',
    border: 'border-border/50',
    iconBg: 'bg-muted'
  }
}

/**
 * 尺寸配置映射
 */
export const sizeConfig: Record<CardSize, { padding: string; iconSize: string; titleSize: string; valueSize: string }> = {
  sm: {
    padding: 'px-3 py-2',
    iconSize: 'w-8 h-8',
    titleSize: 'text-xs',
    valueSize: 'text-lg'
  },
  default: {
    padding: 'px-4 py-3',
    iconSize: 'w-10 h-10',
    titleSize: 'text-sm',
    valueSize: 'text-2xl'
  },
  lg: {
    padding: 'px-6 py-4',
    iconSize: 'w-12 h-12',
    titleSize: 'text-base',
    valueSize: 'text-3xl'
  }
}

/**
 * 获取颜色配置
 * @param color - 主题色
 * @returns 颜色配置对象
 */
export function getColorConfig(color: CardColor = 'default') {
  return colorConfig[color] || colorConfig.default
}

/**
 * 获取尺寸配置
 * @param size - 尺寸
 * @returns 尺寸配置对象
 */
export function getSizeConfig(size: CardSize = 'default') {
  return sizeConfig[size] || sizeConfig.default
}
