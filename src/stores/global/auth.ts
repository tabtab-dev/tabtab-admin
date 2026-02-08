import { defineStore, acceptHMRUpdate } from 'pinia';
import { authApi } from '@/api';
import type { User } from '@/types';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const isLoading = ref(false);

    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const isAdmin = computed(() => user.value?.role === 'admin');

    const login = async (email: string, password: string): Promise<boolean> => {
      isLoading.value = true;
      try {
        const response = await authApi.login({ email, password });
        user.value = response.user;
        token.value = response.token;
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      } finally {
        isLoading.value = false;
      }
    };

    const logout = async (): Promise<void> => {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout API error:', error);
      } finally {
        user.value = null;
        token.value = null;
      }
    };

    const fetchCurrentUser = async (): Promise<boolean> => {
      if (!token.value) return false;

      try {
        const userData = await authApi.getCurrentUser();
        user.value = userData;
        return true;
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        user.value = null;
        token.value = null;
        return false;
      }
    };

    const hasPermission = (permission: string): boolean => {
      return user.value?.permissions.includes(permission) || false;
    };

    const initialize = async (): Promise<void> => {
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
      pick: ['token', 'user'],
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
