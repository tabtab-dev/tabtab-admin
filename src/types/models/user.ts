/**
 * 用户相关类型定义
 */

import type { BaseModel } from './base';
import type { USER_ROLES, USER_STATUS } from '@/constants';

/** 用户角色类型 */
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/** 用户状态类型 */
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

/** 用户模型 */
export interface User extends BaseModel {
  /** 用户名 */
  name: string;
  /** 邮箱 */
  email: string;
  /** 头像 */
  avatar?: string;
  /** 角色 */
  role: UserRole;
  /** 状态 */
  status: UserStatus;
  /** 权限列表 */
  permissions: string[];
  /** 最后登录时间 */
  lastLogin?: string;
}
