/**
 * 用户模块 Mock 接口
 * @description 用户增删改查等接口
 */
import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

// 使用 mockjs 生成随机用户数据
const generateMockUsers = () => {
  const users = [
    {
      id: '1',
      name: '管理员',
      email: 'admin@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      role: 'admin',
      status: 'active',
      phone: '13800138000',
      address: '北京市朝阳区',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: '张三',
      email: 'zhangsan@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
      role: 'editor',
      status: 'active',
      phone: '13800138001',
      address: '上海市浦东新区',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '3',
      name: '李四',
      email: 'lisi@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
      role: 'viewer',
      status: 'inactive',
      phone: '13800138002',
      address: '广州市天河区',
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: '4',
      name: '王五',
      email: 'wangwu@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
      role: 'editor',
      status: 'active',
      phone: '13800138003',
      address: '深圳市南山区',
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z',
    },
    {
      id: '5',
      name: '赵六',
      email: 'zhaoliu@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
      role: 'viewer',
      status: 'active',
      phone: '13800138004',
      address: '杭州市西湖区',
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z',
    },
  ];

  // 使用 mockjs 生成更多用户
  for (let i = 6; i <= 50; i++) {
    users.push({
      id: String(i),
      name: Mock.mock('@cname'),
      email: Mock.mock('@email'),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
      role: Mock.mock('@pick(["admin", "editor", "viewer"])'),
      status: Mock.mock('@pick(["active", "inactive"])'),
      phone: Mock.mock('@string("number", 11)'),
      address: Mock.mock('@county(true)'),
      createdAt: Mock.mock('@datetime("yyyy-MM-ddTHH:mm:ssZ")'),
      updatedAt: Mock.mock('@datetime("yyyy-MM-ddTHH:mm:ssZ")'),
    });
  }

  return users;
};

// 用户数据存储
let usersData = generateMockUsers();

export default [
  // 获取用户列表
  {
    url: '/mock-api/users',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, search, role, status } = query;

      let filteredUsers = [...usersData];

      // 搜索筛选
      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          u =>
            u.name.toLowerCase().includes(lowerSearch) ||
            u.email.toLowerCase().includes(lowerSearch)
        );
      }

      // 角色筛选
      if (role) {
        filteredUsers = filteredUsers.filter(u => u.role === role);
      }

      // 状态筛选
      if (status) {
        filteredUsers = filteredUsers.filter(u => u.status === status);
      }

      const total = filteredUsers.length;
      const totalPages = Math.ceil(total / Number(pageSize));
      const start = (Number(page) - 1) * Number(pageSize);
      const list = filteredUsers.slice(start, start + Number(pageSize));

      return {
        code: 200,
        data: { list, total, page: Number(page), pageSize: Number(pageSize), totalPages },
        message: 'success',
      };
    },
  },
  // 获取用户详情
  {
    url: '/mock-api/users/:id',
    method: 'get',
    response: ({ query }) => {
      const user = usersData.find(u => u.id === query.id);
      if (!user) {
        return { code: 404, data: null, message: '用户不存在' };
      }
      return { code: 200, data: user, message: 'success' };
    },
  },
  // 创建用户
  {
    url: '/mock-api/users',
    method: 'post',
    response: ({ body }) => {
      if (!body.name || !body.email) {
        return { code: 400, data: null, message: '用户名和邮箱不能为空' };
      }

      const newUser = {
        id: String(Date.now()),
        name: body.name,
        email: body.email,
        avatar: body.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        role: body.role || 'viewer',
        status: body.status || 'active',
        phone: body.phone,
        address: body.address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      usersData.unshift(newUser);
      return { code: 201, data: newUser, message: 'success' };
    },
  },
  // 更新用户
  {
    url: '/mock-api/users/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = usersData.findIndex(u => u.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '用户不存在' };
      }

      usersData[index] = {
        ...usersData[index],
        ...body,
        updatedAt: new Date().toISOString(),
      };

      return { code: 200, data: usersData[index], message: 'success' };
    },
  },
  // 删除用户
  {
    url: '/mock-api/users/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = usersData.findIndex(u => u.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '用户不存在' };
      }

      usersData.splice(index, 1);
      return { code: 200, data: null, message: 'success' };
    },
  },
  // 批量删除用户
  {
    url: '/mock-api/users/batch-delete',
    method: 'post',
    response: ({ body }) => {
      const ids = body.ids || [];
      if (!Array.isArray(ids) || ids.length === 0) {
        return { code: 400, data: null, message: '请选择要删除的用户' };
      }

      const initialLength = usersData.length;
      usersData = usersData.filter(u => !ids.includes(u.id));

      return {
        code: 200,
        data: { deletedCount: initialLength - usersData.length },
        message: 'success',
      };
    },
  },
  // 更新用户状态
  {
    url: '/mock-api/users/:id/status',
    method: 'patch',
    response: ({ query, body }) => {
      const { status } = body;
      if (!status || !['active', 'inactive'].includes(status)) {
        return { code: 400, data: null, message: '无效的状态值' };
      }

      const index = usersData.findIndex(u => u.id === query.id);
      if (index === -1) {
        return { code: 404, data: null, message: '用户不存在' };
      }

      usersData[index].status = status;
      usersData[index].updatedAt = new Date().toISOString();

      return { code: 200, data: usersData[index], message: 'success' };
    },
  },
] as MockMethod[];
