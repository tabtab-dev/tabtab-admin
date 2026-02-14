/**
 * 认证模块 Mock 接口
 * @description 登录、登出、用户信息等接口
 */
import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

// 模拟用户数据
const mockUsers = [
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

// 生成 Token
function generateToken(userId: string): string {
  return `mock_token_${userId}_${Date.now()}`;
}

// 从 Token 解析用户 ID
function parseToken(token: string): string | null {
  if (!token || !token.startsWith('mock_token_')) return null;
  return token.split('_')[2] || null;
}

export default [
  // 用户登录
  {
    url: '/mock-api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { email } = body;
      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        return { code: 400, data: null, message: '用户不存在' };
      }

      return {
        code: 200,
        data: { token: generateToken(user.id), user },
        message: 'success',
      };
    },
  },
  // 用户登出
  {
    url: '/mock-api/auth/logout',
    method: 'post',
    response: () => ({ code: 200, data: null, message: 'success' }),
  },
  // 获取当前用户信息
  {
    url: '/mock-api/auth/me',
    method: 'get',
    response: ({ headers }) => {
      const authHeader = headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const userId = parseToken(token);

      if (!userId) {
        return { code: 401, data: null, message: '未授权' };
      }

      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return { code: 401, data: null, message: '用户不存在' };
      }

      return { code: 200, data: user, message: 'success' };
    },
  },
  // 更新个人资料
  {
    url: '/mock-api/auth/profile',
    method: 'put',
    response: ({ headers, body }) => {
      const authHeader = headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const userId = parseToken(token);

      if (!userId) {
        return { code: 401, data: null, message: '未授权' };
      }

      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return { code: 404, data: null, message: '用户不存在' };
      }

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...body,
        updatedAt: new Date().toISOString(),
      };

      return { code: 200, data: mockUsers[userIndex], message: 'success' };
    },
  },
  // 上传头像
  {
    url: '/mock-api/auth/avatar',
    method: 'post',
    response: ({ headers }) => {
      const authHeader = headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const userId = parseToken(token);

      if (!userId) {
        return { code: 401, data: null, message: '未授权' };
      }

      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].avatar = avatarUrl;
      }

      return { code: 200, data: { avatarUrl }, message: 'success' };
    },
  },
  // 刷新 Token
  {
    url: '/mock-api/auth/refresh',
    method: 'post',
    response: ({ headers }) => {
      const authHeader = headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const userId = parseToken(token);

      if (!userId) {
        return { code: 401, data: null, message: '未授权' };
      }

      return {
        code: 200,
        data: { token: generateToken(userId) },
        message: 'success',
      };
    },
  },
  // 修改密码
  {
    url: '/mock-api/auth/change-password',
    method: 'post',
    response: ({ headers, body }) => {
      const authHeader = headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const userId = parseToken(token);

      if (!userId) {
        return { code: 401, data: null, message: '未授权' };
      }

      const { oldPassword, newPassword } = body;
      if (!oldPassword || !newPassword) {
        return { code: 400, data: null, message: '请输入当前密码和新密码' };
      }

      if (newPassword.length < 6) {
        return { code: 400, data: null, message: '新密码长度至少为6位' };
      }

      return { code: 200, data: null, message: 'success' };
    },
  },
  // 发送验证码
  {
    url: '/mock-api/auth/send-code',
    method: 'post',
    response: () => ({ code: 200, data: null, message: '验证码已发送' }),
  },
  // 重置密码
  {
    url: '/mock-api/auth/reset-password',
    method: 'post',
    response: () => ({ code: 200, data: null, message: 'success' }),
  },
] as MockMethod[];
