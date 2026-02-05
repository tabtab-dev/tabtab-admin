/**
 * 认证模块 Mock 数据
 * @description 登录、登出、用户信息等相关 Mock 数据
 */

import type { User } from '@/stores/global/auth';

/**
 * Mock 用户数据
 */
export const mockUsers: User[] = [
  {
    id: '1',
    name: '管理员',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    permissions: ['*'],
  },
  {
    id: '2',
    name: '编辑者',
    email: 'editor@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
    role: 'editor',
    permissions: ['read', 'write'],
  },
  {
    id: '3',
    name: '访客',
    email: 'viewer@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer',
    role: 'viewer',
    permissions: ['read'],
  },
];

/**
 * 根据邮箱查找用户
 * @param email - 用户邮箱
 * @returns 用户信息或 undefined
 */
export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find(u => u.email === email);
}

/**
 * 根据 ID 查找用户
 * @param id - 用户 ID
 * @returns 用户信息或 undefined
 */
export function findUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

/**
 * 生成 Token
 * @param user - 用户信息
 * @returns Token 字符串
 */
export function generateToken(user: User): string {
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
