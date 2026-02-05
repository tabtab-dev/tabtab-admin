import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api';
import { useMenuStore } from './menu';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  /**
   * 用户登录
   * @param email - 邮箱
   * @param password - 密码
   * @returns 是否登录成功
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true;
    try {
      // 使用 Alova 发送登录请求（根据配置自动选择正式或 Mock 接口）
      const response = await authApi.login({ email, password });

      // 保存用户信息和 Token
      user.value = response.user;
      token.value = response.token;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // 登录成功后获取菜单
      const menuStore = useMenuStore();
      await menuStore.fetchMenus();

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 用户登出
   */
  const logout = async (): Promise<void> => {
    try {
      // 调用登出 API（根据配置自动选择正式或 Mock 接口）
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // 清除本地状态
      user.value = null;
      token.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // 重置菜单状态
      const menuStore = useMenuStore();
      menuStore.reset();
    }
  };

  /**
   * 获取当前用户信息
   * @returns 是否获取成功
   */
  const fetchCurrentUser = async (): Promise<boolean> => {
    if (!token.value) return false;

    try {
      const userData = await authApi.getCurrentUser();
      user.value = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // Token 可能已过期，清除登录状态
      user.value = null;
      token.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  };

  /**
   * 检查用户是否有指定权限
   * @param permission - 权限标识
   * @returns 是否有权限
   */
  const hasPermission = (permission: string): boolean => {
    return user.value?.permissions.includes(permission) || false;
  };

  /**
   * 初始化认证状态
   * 从 localStorage 恢复用户状态，并验证 Token 有效性
   */
  const initialize = async (): Promise<void> => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        user.value = JSON.parse(storedUser);
        // 可选：验证 Token 是否仍然有效
        // await fetchCurrentUser();
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        // 清除无效的存储数据
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchCurrentUser,
    hasPermission,
    initialize,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
