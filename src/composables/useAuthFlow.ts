/**
 * 认证流程组合式函数
 * @description 组合 authStore 和 menuStore，处理登录/登出完整流程
 * 避免 store 之间的直接耦合
 */
import { computed } from 'vue';
import { useAuthStore } from '@/stores/global/auth';
import { useMenuStore } from '@/stores/global/menu';
import { normalizeError } from '@/utils/errorHandler';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthFlowResult {
  success: boolean;
  error?: string;
}

/**
 * 认证流程管理
 * @returns 登录、登出方法和状态
 */
export function useAuthFlow() {
  const authStore = useAuthStore();
  const menuStore = useMenuStore();

  /**
   * 执行登录流程
   * 1. 调用登录 API
   * 2. 登录成功后获取菜单
   */
  const login = async (credentials: LoginCredentials): Promise<AuthFlowResult> => {
    try {
      const success = await authStore.login(credentials.email, credentials.password);

      if (!success) {
        return { success: false, error: '登录失败，请检查邮箱和密码' };
      }

      // 登录成功后获取菜单
      const menuSuccess = await menuStore.fetchMenus();
      if (!menuSuccess) {
        // 菜单获取失败，执行登出清理
        await authStore.logout();
        return { success: false, error: '获取菜单失败，请稍后重试' };
      }

      return { success: true };
    } catch (error) {
      const appError = normalizeError(error);
      return { success: false, error: appError.message };
    }
  };

  /**
   * 执行登出流程
   * 1. 调用登出 API
   * 2. 清理菜单状态
   * 3. 清理认证状态
   */
  const logout = async (): Promise<AuthFlowResult> => {
    try {
      // 先清理菜单（移除动态路由）
      menuStore.reset();

      // 再执行登出
      await authStore.logout();

      return { success: true };
    } catch (error) {
      const appError = normalizeError(error);
      return { success: false, error: appError.message };
    }
  };

  /**
   * 初始化认证状态
   * 从持久化存储恢复用户状态
   */
  const initialize = async (): Promise<AuthFlowResult> => {
    try {
      await authStore.initialize();

      // 如果已登录，获取菜单
      if (authStore.isAuthenticated) {
        const menuSuccess = await menuStore.fetchMenus();
        if (!menuSuccess) {
          return { success: false, error: '获取菜单失败' };
        }
      }

      return { success: true };
    } catch (error) {
      const appError = normalizeError(error);
      return { success: false, error: appError.message };
    }
  };

  return {
    // 状态（从 store 透传）
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    isLoading: computed(() => authStore.isLoading),

    // 方法
    login,
    logout,
    initialize,

    // 原始 store 方法（如需直接使用）
    fetchCurrentUser: authStore.fetchCurrentUser,
    hasPermission: authStore.hasPermission,
  };
}
