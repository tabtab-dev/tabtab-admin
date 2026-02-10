/**
 * TStatusBadge 组件导出
 * @description 状态徽章组件
 */

export { default as TStatusBadge } from './TStatusBadge.vue'
export { getStatusColorConfig, getVariantConfig, getSizeConfig, statusColorConfig } from './theme'
export type {
  BadgeSize,
  BadgeVariant,
  StatusType,
  StatusConfig,
  StatusMap,
  TStatusBadgeProps,
  TStatusBadgeEmits,
  TStatusBadgeExpose
} from './types'
