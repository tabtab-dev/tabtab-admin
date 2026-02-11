/**
 * 认证模块 Mock 数据
 * @description 登录、登出、用户信息等相关 Mock 数据
 */

import type { User } from '@/types';

/**
 * 扩展用户数据类型
 */
interface MockUser extends User {
  password?: string;
}

/**
 * Mock 用户数据
 */
export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: '管理员',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    status: 'active',
    permissions: ['*'],
    phone: '13800138000',
    address: '北京市朝阳区',
    department: '技术部',
    position: '技术总监',
    bio: '负责系统架构设计和技术团队管理',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '编辑者',
    email: 'editor@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
    role: 'editor',
    status: 'active',
    permissions: ['read', 'write'],
    phone: '13800138001',
    address: '上海市浦东新区',
    department: '内容部',
    position: '高级编辑',
    bio: '负责内容审核和编辑工作',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: '访客',
    email: 'viewer@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer',
    role: 'viewer',
    status: 'active',
    permissions: ['read'],
    phone: '13800138002',
    address: '广州市天河区',
    department: '市场部',
    position: '市场专员',
    bio: '负责市场调研和数据分析',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

/**
 * 根据邮箱查找用户
 * @param email - 用户邮箱
 * @returns 用户信息或 undefined
 */
export function findUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find(u => u.email === email);
}

/**
 * 根据 ID 查找用户
 * @param id - 用户 ID
 * @returns 用户信息或 undefined
 */
export function findUserById(id: string): MockUser | undefined {
  return mockUsers.find(u => u.id === id);
}

/**
 * 更新用户信息
 * @param id - 用户 ID
 * @param data - 更新数据
 * @returns 更新后的用户信息或 undefined
 */
export function updateUser(id: string, data: Partial<MockUser>): MockUser | undefined {
  const index = mockUsers.findIndex(u => u.id === id);
  if (index === -1) return undefined;

  mockUsers[index] = {
    ...mockUsers[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const { password, ...userWithoutPassword } = mockUsers[index];
  return userWithoutPassword;
}

/**
 * 生成 Token
 * @param user - 用户信息
 * @returns Token 字符串
 */
export function generateToken(user: MockUser): string {
  return `mock_token_${user.id}_${Date.now()}`;
}

/**
 * 从 Token 解析用户 ID
 * @param token - Token 字符串
 * @returns 用户 ID 或 null
 */
export function parseToken(token: string): string | null {
  if (!token || !token.startsWith('mock_token_')) {
    return null;
  }
  const parts = token.split('_');
  return parts[2] || null;
}
