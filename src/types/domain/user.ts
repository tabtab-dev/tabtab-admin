/**
 * 用户领域类型定义
 */

/**
 * 用户角色
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * 用户状态
 */
export type UserStatus = 'active' | 'inactive' | 'suspended';

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
