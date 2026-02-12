/**
 * 用户领域类型定义
 */

import type { USER_ROLES, USER_STATUS } from '@/constants';

/** 用户角色类型 */
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/** 用户状态类型 */
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

/**
 * 用户基础信息
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  /** 电话 */
  phone?: string;
  /** 地址 */
  address?: string;
  /** 部门 */
  department?: string;
  /** 职位 */
  position?: string;
  /** 个人简介 */
  bio?: string;
  /** 最后登录时间 */
  lastLogin?: string;
}

/**
 * 更新个人资料参数
 */
export interface UpdateProfileParams {
  name?: string;
  phone?: string;
  address?: string;
  department?: string;
  position?: string;
  bio?: string;
  avatar?: string;
}

/**
 * 用户列表查询参数
 */
export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
}

/**
 * 创建用户参数
 */
export interface CreateUserParams {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
  avatar?: string;
}

/**
 * 更新用户参数
 */
export interface UpdateUserParams {
  name?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
}

/**
 * 修改密码参数
 */
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}
