import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';

export interface Category {
  id: string;
  name: string;
  code: string;
  level: 1 | 2;
  parentId?: string;
  parentName?: string;
  sort: number;
  status: 'active' | 'inactive';
  productCount: number;
  description?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  productCount: number;
  createdAt: string;
}

export const useCategoriesStore = defineStore('categories', () => {
  // 分类数据
  const categories = ref<Category[]>([
    {
      id: '1',
      name: '电子产品',
      code: 'electronics',
      level: 1,
      sort: 1,
      status: 'active',
      productCount: 156,
      description: '手机、电脑、平板等电子设备',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: '手机通讯',
      code: 'mobile',
      level: 2,
      parentId: '1',
      parentName: '电子产品',
      sort: 1,
      status: 'active',
      productCount: 89,
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      name: '电脑办公',
      code: 'computer',
      level: 2,
      parentId: '1',
      parentName: '电子产品',
      sort: 2,
      status: 'active',
      productCount: 67,
      createdAt: '2024-01-01'
    },
    {
      id: '4',
      name: '服装配饰',
      code: 'clothing',
      level: 1,
      sort: 2,
      status: 'active',
      productCount: 234,
      description: '男女服装、鞋帽配饰',
      createdAt: '2024-01-02'
    },
    {
      id: '5',
      name: '男装',
      code: 'menswear',
      level: 2,
      parentId: '4',
      parentName: '服装配饰',
      sort: 1,
      status: 'active',
      productCount: 120,
      createdAt: '2024-01-02'
    },
    {
      id: '6',
      name: '女装',
      code: 'womenswear',
      level: 2,
      parentId: '4',
      parentName: '服装配饰',
      sort: 2,
      status: 'active',
      productCount: 114,
      createdAt: '2024-01-02'
    },
    {
      id: '7',
      name: '家居生活',
      code: 'home',
      level: 1,
      sort: 3,
      status: 'active',
      productCount: 98,
      createdAt: '2024-01-03'
    },
    {
      id: '8',
      name: '食品饮料',
      code: 'food',
      level: 1,
      sort: 4,
      status: 'inactive',
      productCount: 45,
      createdAt: '2024-01-04'
    }
  ]);

  // 标签数据
  const tags = ref<Tag[]>([
    { id: '1', name: '热销', color: '#ff4d4f', productCount: 56, createdAt: '2024-01-01' },
    { id: '2', name: '新品', color: '#52c41a', productCount: 43, createdAt: '2024-01-01' },
    { id: '3', name: '限时特惠', color: '#faad14', productCount: 28, createdAt: '2024-01-02' },
    { id: '4', name: '清仓', color: '#722ed1', productCount: 15, createdAt: '2024-01-03' },
    { id: '5', name: '推荐', color: '#1890ff', productCount: 89, createdAt: '2024-01-03' }
  ]);

  const isLoading = ref(false);
  const searchQuery = ref('');
  const levelFilter = ref<number | ''>('');
  const statusFilter = ref('');

  // 统计
  const statistics = computed(() => {
    const total = categories.value.length;
    const level1 = categories.value.filter(c => c.level === 1).length;
    const level2 = categories.value.filter(c => c.level === 2).length;
    const active = categories.value.filter(c => c.status === 'active').length;
    const totalProducts = categories.value.reduce((sum, c) => sum + c.productCount, 0);

    return {
      total,
      level1,
      level2,
      active,
      totalProducts
    };
  });

  // 标签统计
  const tagStatistics = computed(() => {
    return {
      total: tags.value.length,
      totalProducts: tags.value.reduce((sum, t) => sum + t.productCount, 0)
    };
  });

  // 一级分类
  const level1Categories = computed(() => {
    return categories.value.filter(c => c.level === 1);
  });

  // 过滤后的分类
  const filteredCategories = computed(() => {
    let result = categories.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query)
      );
    }

    if (levelFilter.value !== '') {
      result = result.filter(c => c.level === levelFilter.value);
    }

    if (statusFilter.value) {
      result = result.filter(c => c.status === statusFilter.value);
    }

    return result.sort((a, b) => a.sort - b.sort);
  });

  // 过滤后的标签
  const filteredTags = computed(() => {
    if (!searchQuery.value) return tags.value;
    const query = searchQuery.value.toLowerCase();
    return tags.value.filter(t => t.name.toLowerCase().includes(query));
  });

  // 添加分类
  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    categories.value.push(newCategory);
  };

  // 更新分类
  const updateCategory = (id: string, updates: Partial<Category>) => {
    const index = categories.value.findIndex(c => c.id === id);
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates };
    }
  };

  // 删除分类
  const deleteCategory = (id: string) => {
    categories.value = categories.value.filter(c => c.id !== id);
  };

  // 批量删除
  const batchDeleteCategories = (ids: string[]) => {
    categories.value = categories.value.filter(c => !ids.includes(c.id));
  };

  // 添加标签
  const addTag = (tag: Omit<Tag, 'id' | 'createdAt'>) => {
    const newTag: Tag = {
      ...tag,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    tags.value.push(newTag);
  };

  // 更新标签
  const updateTag = (id: string, updates: Partial<Tag>) => {
    const index = tags.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tags.value[index] = { ...tags.value[index], ...updates };
    }
  };

  // 删除标签
  const deleteTag = (id: string) => {
    tags.value = tags.value.filter(t => t.id !== id);
  };

  return {
    categories,
    tags,
    isLoading,
    searchQuery,
    levelFilter,
    statusFilter,
    statistics,
    tagStatistics,
    level1Categories,
    filteredCategories,
    filteredTags,
    addCategory,
    updateCategory,
    deleteCategory,
    batchDeleteCategories,
    addTag,
    updateTag,
    deleteTag
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot));
}
