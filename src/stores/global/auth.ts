import { defineStore, acceptHMRUpdate } from 'pinia';
import { authApi } from '@/api';
import { useMenuStore } from './menu';
import type { User } from '@/types';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
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
        return true;
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        // Token 可能已过期，清除登录状态
        user.value = null;
        token.value = null;
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
     * 从持久化存储恢复用户状态
     */
    const initialize = async (): Promise<void> => {
      // 状态已通过持久化插件自动恢复
      // 这里可以添加额外的初始化逻辑，如验证 token 有效性
      if (token.value && user.value) {
        // 可选：验证 token 是否仍然有效
        // await fetchCurrentUser();
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
  },
  {
    persist: {
      key: 'app-auth',
      paths: ['token', 'user'],
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
