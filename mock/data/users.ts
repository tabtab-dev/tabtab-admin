/**
 * 用户模块 Mock 数据
 * @description 用户列表、用户详情等相关 Mock 数据
 */

import type { User } from '@/stores/users';

/**
 * 扩展的用户数据类型（包含密码等敏感信息）
 */
interface MockUser extends User {
  password?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mock 用户列表数据
 */
export const mockUserList: MockUser[] = [
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

/**
 * 用户数据操作类
 */
export class UserDataStore {
  private users: MockUser[] = [...mockUserList];

  /**
   * 获取用户列表（支持分页和筛选）
   * @param page - 页码
   * @param pageSize - 每页数量
   * @param search - 搜索关键词
   * @param role - 角色筛选
   * @param status - 状态筛选
   * @returns 分页用户列表
   */
  getUsers(
    page = 1,
    pageSize = 10,
    search?: string,
    role?: User['role'],
    status?: User['status']
  ) {
    let filteredUsers = [...this.users];

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
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = filteredUsers.slice(start, end).map(({ password, ...user }) => user);

    return {
      list,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * 根据 ID 获取用户
   * @param id - 用户 ID
   * @returns 用户信息或 undefined
   */
  getUserById(id: string): Omit<MockUser, 'password'> | undefined {
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * 创建用户
   * @param data - 用户数据
   * @returns 创建的用户
   */
  createUser(data: Partial<MockUser>): Omit<MockUser, 'password'> {
    const newUser: MockUser = {
      id: String(Date.now()),
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      role: data.role || 'viewer',
      status: data.status || 'active',
      phone: data.phone,
      address: data.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * 更新用户
   * @param id - 用户 ID
   * @param data - 更新数据
   * @returns 更新后的用户或 undefined
   */
  updateUser(id: string, data: Partial<MockUser>): Omit<MockUser, 'password'> | undefined {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;

    this.users[index] = {
      ...this.users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const { password, ...userWithoutPassword } = this.users[index];
    return userWithoutPassword;
  }

  /**
   * 删除用户
   * @param id - 用户 ID
   * @returns 是否删除成功
   */
  deleteUser(id: string): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  /**
   * 批量删除用户
   * @param ids - 用户 ID 数组
   * @returns 删除的用户数量
   */
  batchDeleteUsers(ids: string[]): number {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => !ids.includes(u.id));
    return initialLength - this.users.length;
  }

  /**
   * 更新用户状态
   * @param id - 用户 ID
   * @param status - 新状态
   * @returns 更新后的用户或 undefined
   */
  updateUserStatus(id: string, status: User['status']): Omit<MockUser, 'password'> | undefined {
    return this.updateUser(id, { status });
  }
}

/**
 * 用户数据存储实例
 */
export const userDataStore = new UserDataStore();
