/**
 * 认证模块 MSW handlers
 * @description 登录、登出、用户信息等接口
 */
import { http, HttpResponse, delay } from 'msw';

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

function generateToken(userId: string): string {
  return `mock_token_${userId}_${Date.now()}`;
}

function parseToken(token: string): string | null {
  if (!token || !token.startsWith('mock_token_')) return null;
  return token.split('_')[2] || null;
}

export const authHandlers = [
  http.post('/mock-api/auth/login', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email: string };
    const user = mockUsers.find(u => u.email === body.email);

    if (!user) {
      return HttpResponse.json({ code: 400, data: null, message: '用户不存在' });
    }

    return HttpResponse.json({
      code: 200,
      data: { token: generateToken(user.id), user },
      message: 'success',
    });
  }),

  http.post('/mock-api/auth/logout', async () => {
    await delay(200);
    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),

  http.get('/mock-api/auth/me', async ({ request }) => {
    await delay(200);
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const userId = parseToken(token);

    if (!userId) {
      return HttpResponse.json({ code: 401, data: null, message: '未授权' });
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return HttpResponse.json({ code: 401, data: null, message: '用户不存在' });
    }

    return HttpResponse.json({ code: 200, data: user, message: 'success' });
  }),

  http.put('/mock-api/auth/profile', async ({ request }) => {
    await delay(300);
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const userId = parseToken(token);

    if (!userId) {
      return HttpResponse.json({ code: 401, data: null, message: '未授权' });
    }

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return HttpResponse.json({ code: 404, data: null, message: '用户不存在' });
    }

    const body = (await request.json()) as Record<string, unknown>;
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    } as typeof mockUsers[0];

    return HttpResponse.json({ code: 200, data: mockUsers[userIndex], message: 'success' });
  }),

  http.post('/mock-api/auth/avatar', async ({ request }) => {
    await delay(500);
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const userId = parseToken(token);

    if (!userId) {
      return HttpResponse.json({ code: 401, data: null, message: '未授权' });
    }

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].avatar = avatarUrl;
    }

    return HttpResponse.json({ code: 200, data: { avatarUrl }, message: 'success' });
  }),

  http.post('/mock-api/auth/refresh', async ({ request }) => {
    await delay(200);
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const userId = parseToken(token);

    if (!userId) {
      return HttpResponse.json({ code: 401, data: null, message: '未授权' });
    }

    return HttpResponse.json({
      code: 200,
      data: { token: generateToken(userId) },
      message: 'success',
    });
  }),

  http.post('/mock-api/auth/change-password', async ({ request }) => {
    await delay(300);
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const userId = parseToken(token);

    if (!userId) {
      return HttpResponse.json({ code: 401, data: null, message: '未授权' });
    }

    const body = (await request.json()) as { oldPassword?: string; newPassword?: string };
    if (!body.oldPassword || !body.newPassword) {
      return HttpResponse.json({ code: 400, data: null, message: '请输入当前密码和新密码' });
    }

    if (body.newPassword.length < 6) {
      return HttpResponse.json({ code: 400, data: null, message: '新密码长度至少为6位' });
    }

    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),

  http.post('/mock-api/auth/send-code', async () => {
    await delay(300);
    return HttpResponse.json({ code: 200, data: null, message: '验证码已发送' });
  }),

  http.post('/mock-api/auth/reset-password', async () => {
    await delay(300);
    return HttpResponse.json({ code: 200, data: null, message: 'success' });
  }),
];
