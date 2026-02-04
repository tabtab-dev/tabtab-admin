import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';

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

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser: User = {
        id: '1',
        name: '管理员',
        email,
        avatar: '',
        role: 'admin',
        permissions: ['users:read', 'users:write', 'orders:read', 'orders:write', 'products:read', 'products:write', 'settings:read', 'settings:write']
      };
      
      user.value = mockUser;
      token.value = 'mock-token-' + Date.now();
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string) => {
    return user.value?.permissions.includes(permission) || false;
  };

  const initialize = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
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
    hasPermission,
    initialize
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
