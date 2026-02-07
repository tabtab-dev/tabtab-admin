/**
 * 表格数据管理 Composable
 * @description 封装数据获取、过滤、分页、统计等通用逻辑
 */
import { ref, computed } from 'vue';
import { useApi } from './useApi';

/**
 * 表格数据配置选项
 */
export interface UseTableDataOptions<T> {
  /** API 调用函数 */
  apiCall: () => Promise<T[] | { list: T[]; total: number; page: number; pageSize: number }>;
  /** 是否立即加载数据 */
  immediate?: boolean;
  /** 默认页码 */
  defaultPage?: number;
  /** 默认每页数量 */
  defaultPageSize?: number;
  /** 自定义过滤函数 */
  filterFn?: (items: T[], query: string, filters: Record<string, any>) => T[];
  /** 自定义统计函数 */
  statisticsFn?: (items: T[]) => Record<string, number>;
}

/**
 * 表格数据状态
 */
export interface TableDataState<T> {
  /** 数据列表 */
  data: T[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 搜索关键词 */
  searchQuery: string;
  /** 过滤条件 */
  filters: Record<string, any>;
  /** 当前页码 */
  currentPage: number;
  /** 每页数量 */
  pageSize: number;
  /** 过滤后的数据 */
  filteredData: T[];
  /** 分页后的数据 */
  paginatedData: T[];
  /** 总页数 */
  totalPages: number;
  /** 总记录数 */
  total: number;
  /** 统计数据 */
  statistics: Record<string, number>;
  /** 获取数据的方法 */
  fetchData: () => Promise<void>;
  /** 重置搜索和过滤 */
  resetFilters: () => void;
  /** 跳转到指定页 */
  goToPage: (page: number) => void;
  /** 下一页 */
  nextPage: () => void;
  /** 上一页 */
  prevPage: () => void;
  /** 设置每页数量 */
  setPageSize: (size: number) => void;
  /** 添加数据 */
  addData: (item: T) => void;
  /** 更新数据 */
  updateData: (id: string | number, updates: Partial<T>) => void;
  /** 删除数据 */
  removeData: (id: string | number) => void;
  /** 批量删除数据 */
  batchRemoveData: (ids: (string | number)[]) => void;
}

/**
 * 表格数据管理 Hook
 * @param options 配置选项
 * @returns 表格数据状态和操作方法
 *
 * @example
 * ```ts
 * const { data, loading, searchQuery, filteredData, paginatedData, fetchData } = useTableData({
 *   apiCall: () => usersApi.getUsers(),
 *   immediate: true,
 *   filterFn: (items, query) => {
 *     return items.filter(item => item.name.includes(query))
 *   }
 * });
 * ```
 */
export function useTableData<T = any>(options: UseTableDataOptions<T>) {
  const {
    apiCall,
    immediate = true,
    defaultPage = 1,
    defaultPageSize = 10,
    filterFn,
    statisticsFn,
  } = options;

  // ============ 状态 ============
  const rawData = ref<T[] | { list: T[]; total: number; page: number; pageSize: number } | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  
  const searchQuery = ref('');
  const filters = ref<Record<string, any>>({});
  const currentPage = ref(defaultPage);
  const pageSize = ref(defaultPageSize);
  
  /**
   * 获取数据列表
   */
  const data = computed(() => {
    if (!rawData.value) return [];
    if (Array.isArray(rawData.value)) {
      return rawData.value;
    }
    return rawData.value.list;
  });
  
  /**
   * 获取总记录数
   */
  const totalFromApi = computed(() => {
    if (!rawData.value) return 0;
    if (Array.isArray(rawData.value)) {
      return rawData.value.length;
    }
    return rawData.value.total;
  });
  
  /**
   * 获取数据的方法
   */
  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
      rawData.value = await apiCall();
    } catch (err) {
      error.value = err as Error;
      console.error('获取数据失败:', err);
    } finally {
      loading.value = false;
    }
  };
  
  // 立即加载数据
  if (immediate) {
    fetchData();
  }

  // ============ 计算属性 ============

  /**
   * 过滤后的数据
   */
  const filteredData = computed(() => {
    let result = data.value || [];

    if (!Array.isArray(result)) {
      result = [];
    }

    const query = searchQuery.value.toLowerCase();
    const hasQuery = searchQuery.value !== '';

    if (hasQuery && filterFn) {
      result = filterFn(result as T[], query, filters.value) || [];
    } else if (hasQuery) {
      result = result.filter((item: any) => {
        return Object.values(item).some(
          (value: any) =>
            String(value).toLowerCase().includes(query)
        );
      });
    } else if (filterFn) {
      result = filterFn(result, '', filters.value) || [];
    }

    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        result = result.filter((item: any) => item[key] === value);
      }
    });

    return result;
  });

  /**
   * 分页后的数据
   */
  const paginatedData = computed(() => {
    const data = filteredData.value;
    if (!Array.isArray(data)) {
      return [];
    }
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return data.slice(start, end);
  });

  /**
   * 总页数
   */
  const totalPages = computed(() => {
    const data = filteredData.value;
    if (!Array.isArray(data)) {
      return 0;
    }
    return Math.ceil(data.length / pageSize.value);
  });

  /**
   * 总记录数
   */
  const total = computed(() => {
    return totalFromApi.value;
  });

  /**
   * 统计数据
   */
  const statistics = computed(() => {
    const items = data.value || [];
    
    if (statisticsFn && Array.isArray(items)) {
      return statisticsFn(items) || {};
    }

    return {
      total: items.length || 0,
    };
  });

  // ============ 方法 ============

  /**
   * 重置搜索和过滤
   */
  const resetFilters = () => {
    searchQuery.value = '';
    filters.value = {};
    currentPage.value = defaultPage;
  };

  /**
   * 跳转到指定页
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  /**
   * 下一页
   */
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  /**
   * 上一页
   */
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  /**
   * 设置每页数量
   */
  const setPageSize = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
  };

  /**
   * 添加数据
   */
  const addData = (item: T) => {
    if (!rawData.value) return;
    if (Array.isArray(rawData.value)) {
      rawData.value = [item, ...rawData.value];
    } else {
      rawData.value.list = [item, ...rawData.value.list];
      rawData.value.total = rawData.value.total + 1;
    }
  };

  /**
   * 更新数据
   */
  const updateData = (id: string | number, updates: Partial<T>) => {
    if (!rawData.value) return;
    const list = Array.isArray(rawData.value) ? rawData.value : rawData.value.list;
    const index = list?.findIndex((item: any) => item.id === id);
    if (index !== undefined && index !== -1) {
      if (Array.isArray(rawData.value)) {
        rawData.value![index] = { ...rawData.value![index], ...updates } as T;
      } else {
        rawData.value.list[index] = { ...rawData.value.list[index], ...updates } as T;
      }
    }
  };

  /**
   * 删除数据
   */
  const removeData = (id: string | number) => {
    if (!rawData.value) return;
    if (Array.isArray(rawData.value)) {
      rawData.value = rawData.value?.filter((item: any) => item.id !== id) || [];
    } else {
      rawData.value.list = rawData.value.list?.filter((item: any) => item.id !== id) || [];
      rawData.value.total = rawData.value.total - 1;
    }
  };

  /**
   * 批量删除数据
   */
  const batchRemoveData = (ids: (string | number)[]) => {
    if (!rawData.value) return;
    if (Array.isArray(rawData.value)) {
      rawData.value = rawData.value?.filter((item: any) => !ids.includes(item.id)) || [];
    } else {
      const deletedCount = rawData.value.list.filter((item: any) => ids.includes(item.id)).length;
      rawData.value.list = rawData.value.list?.filter((item: any) => !ids.includes(item.id)) || [];
      rawData.value.total = rawData.value.total - deletedCount;
    }
  };

  return {
    data,
    loading,
    error,
    searchQuery,
    filters,
    currentPage,
    pageSize,
    filteredData,
    paginatedData,
    totalPages,
    total,
    statistics,
    fetchData,
    resetFilters,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    addData,
    updateData,
    removeData,
    batchRemoveData,
  };
}
