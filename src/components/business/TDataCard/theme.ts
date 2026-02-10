/**
 * TDataCard 主题配置
 * @description 统计卡片组件的主题配置，与 shadcn-vue Card 风格统一
 */

import type { CardColor, CardSize } from './types'

/**
 * 颜色配置映射
 * @description 统一使用与 shadcn-vue Card 一致的风格：border + shadow-sm
 */
export const colorConfig: Record<CardColor, { bg: string; text: string; border: string; iconBg: string }> = {
  blue: {
    bg: 'bg-card',
    text: 'text-blue-600',
    border: 'border-blue-200/50',
    iconBg: 'bg-blue-100'
  },
  green: {
    bg: 'bg-card',
    text: 'text-green-600',
    border: 'border-green-200/50',
    iconBg: 'bg-green-100'
  },
  purple: {
    bg: 'bg-card',
    text: 'text-purple-600',
    border: 'border-purple-200/50',
    iconBg: 'bg-purple-100'
  },
  orange: {
    bg: 'bg-card',
    text: 'text-orange-600',
    border: 'border-orange-200/50',
    iconBg: 'bg-orange-100'
  },
  red: {
    bg: 'bg-card',
    text: 'text-red-600',
    border: 'border-red-200/50',
    iconBg: 'bg-red-100'
  },
  cyan: {
    bg: 'bg-card',
    text: 'text-cyan-600',
    border: 'border-cyan-200/50',
    iconBg: 'bg-cyan-100'
  },
  default: {
    bg: 'bg-card',
    text: 'text-foreground',
    border: 'border-border',
    iconBg: 'bg-muted'
  }
}

/**
 * 尺寸配置映射
 */
export const sizeConfig: Record<CardSize, { padding: string; iconSize: string; titleSize: string; valueSize: string }> = {
  sm: {
    padding: 'px-4 py-3',
    iconSize: 'w-8 h-8',
    titleSize: 'text-xs',
    valueSize: 'text-lg'
  },
  default: {
    padding: 'p-5',
    iconSize: 'w-10 h-10',
    titleSize: 'text-sm',
    valueSize: 'text-2xl'
  },
  lg: {
    padding: 'p-6',
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

/**
 * 获取统一的卡片样式类
 * @description 与 shadcn-vue Card 风格保持一致
 */
export function getCardClassNames(color: CardColor = 'default', bordered: boolean = true): string {
  const colorCfg = getColorConfig(color)

  return [
    'rounded-xl',
    'border',
    bordered ? colorCfg.border : 'border-border',
    'bg-card',
    'text-card-foreground',
    'shadow-sm',
    'transition-all',
    'duration-200',
  ].join(' ')
}
