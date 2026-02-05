import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([
    {
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-02-01'
    },
    {
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      role: 'editor',
      status: 'active',
      createdAt: '2024-01-20',
      lastLogin: '2024-01-31'
    },
    {
      id: '3',
      name: '王五',
      email: 'wangwu@example.com',
      role: 'viewer',
      status: 'inactive',
      createdAt: '2024-02-01'
    }
  ]);

  const isLoading = ref(false);
  const searchQuery = ref('');
  const currentPage = ref(1);
  const pageSize = ref(10);

  const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    const query = searchQuery.value.toLowerCase();
    return users.value.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  });

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredUsers.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / pageSize.value);
  });

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0] || ''
    };
    users.value.unshift(newUser);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const index = users.value.findIndex(u => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index]!, ...updates } as User;
    }
  };

  const deleteUser = (id: string) => {
    users.value = users.value.filter(u => u.id !== id);
  };

  const getUserById = (id: string) => {
    return users.value.find(u => u.id === id);
  };

  return {
    users,
    isLoading,
    searchQuery,
    currentPage,
    pageSize,
    filteredUsers,
    paginatedUsers,
    totalPages,
    addUser,
    updateUser,
    deleteUser,
    getUserById
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
