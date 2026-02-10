/**
 * TStatusBadge 主题配置
 * @description 状态徽章组件的主题配置
 */

import type { StatusType, BadgeSize, BadgeVariant } from './types'

/**
 * 状态颜色配置映射
 */
export const statusColorConfig: Record<StatusType, { bg: string; text: string; border: string; dot: string }> = {
  success: {
    bg: 'bg-green-500',
    text: 'text-green-700',
    border: 'border-green-500',
    dot: 'bg-green-500'
  },
  warning: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-700',
    border: 'border-yellow-500',
    dot: 'bg-yellow-500'
  },
  error: {
    bg: 'bg-red-500',
    text: 'text-red-700',
    border: 'border-red-500',
    dot: 'bg-red-500'
  },
  info: {
    bg: 'bg-blue-500',
    text: 'text-blue-700',
    border: 'border-blue-500',
    dot: 'bg-blue-500'
  },
  default: {
    bg: 'bg-gray-500',
    text: 'text-gray-700',
    border: 'border-gray-500',
    dot: 'bg-gray-500'
  },
  processing: {
    bg: 'bg-blue-500',
    text: 'text-blue-700',
    border: 'border-blue-500',
    dot: 'bg-blue-500'
  },
  pending: {
    bg: 'bg-orange-500',
    text: 'text-orange-700',
    border: 'border-orange-500',
    dot: 'bg-orange-500'
  },
  active: {
    bg: 'bg-green-500',
    text: 'text-green-700',
    border: 'border-green-500',
    dot: 'bg-green-500'
  },
  inactive: {
    bg: 'bg-gray-400',
    text: 'text-gray-600',
    border: 'border-gray-400',
    dot: 'bg-gray-400'
  },
  disabled: {
    bg: 'bg-gray-300',
    text: 'text-gray-500',
    border: 'border-gray-300',
    dot: 'bg-gray-300'
  }
}

/**
 * 变体样式配置
 */
export const variantConfig: Record<BadgeVariant, (color: StatusType) => { bg: string; text: string; border: string }> = {
  solid: (color) => ({
    bg: statusColorConfig[color].bg,
    text: 'text-white',
    border: 'border-transparent'
  }),
  soft: (color) => ({
    bg: `${statusColorConfig[color].bg}/10`,
    text: statusColorConfig[color].text,
    border: 'border-transparent'
  }),
  outline: (color) => ({
    bg: 'bg-transparent',
    text: statusColorConfig[color].text,
    border: `border ${statusColorConfig[color].border}`
  }),
  dot: (color) => ({
    bg: 'bg-transparent',
    text: statusColorConfig[color].text,
    border: 'border-transparent'
  })
}

/**
 * 尺寸配置映射
 */
export const sizeConfig: Record<BadgeSize, { padding: string; textSize: string; dotSize: string; height: string }> = {
  sm: {
    padding: 'px-1.5 py-0.5',
    textSize: 'text-xs',
    dotSize: 'w-1.5 h-1.5',
    height: 'h-5'
  },
  default: {
    padding: 'px-2.5 py-0.5',
    textSize: 'text-sm',
    dotSize: 'w-2 h-2',
    height: 'h-6'
  },
  lg: {
    padding: 'px-3 py-1',
    textSize: 'text-base',
    dotSize: 'w-2.5 h-2.5',
    height: 'h-7'
  }
}

/**
 * 获取状态颜色配置
 * @param status - 状态类型
 * @returns 颜色配置对象
 */
export function getStatusColorConfig(status: StatusType = 'default') {
  return statusColorConfig[status]
}

/**
 * 获取变体样式配置
 * @param variant - 变体类型
 * @param color - 颜色类型
 * @returns 样式配置对象
 */
export function getVariantConfig(variant: BadgeVariant = 'soft', color: StatusType = 'default') {
  // 确保 color 是有效的，否则使用默认值
  const validColor = statusColorConfig[color] ? color : 'default'
  return variantConfig[variant](validColor)
}

/**
 * 获取尺寸配置
 * @param size - 尺寸
 * @returns 尺寸配置对象
 */
export function getSizeConfig(size: BadgeSize = 'default') {
  return sizeConfig[size]
}
