/**
 * 表格数据管理 Composable
 * @description 封装数据获取、过滤、分页、统计等通用逻辑（仅支持后端分页）
 */
import { ref, computed } from 'vue';

/**
 * API 调用参数上下文
 */
export interface ApiCallParamsContext {
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: Record<string, any>;
}

/**
 * 表格数据配置选项
 */
export interface UseTableDataOptions<T> {
  /** API 调用函数，支持传入参数 */
  apiCall: (params?: Record<string, any>) => Promise<{ list: T[]; total: number; page: number; pageSize: number }>;
  /** 
   * 构建 API 调用参数的函数，用于后端分页/搜索
   * @param ctx - 当前分页和搜索状态
   */
  apiCallParams?: (ctx: ApiCallParamsContext) => Record<string, any>;
  /** 是否立即加载数据 */
  immediate?: boolean;
  /** 默认页码 */
  defaultPage?: number;
  /** 默认每页数量 */
  defaultPageSize?: number;
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
 * const { data, loading, searchQuery, currentPage, pageSize, total, fetchData } = useTableData({
 *   apiCall: (params) => usersApi.getUsers(params),
 *   apiCallParams: (ctx) => ({
 *     page: ctx.page,
 *     pageSize: ctx.pageSize,
 *     keyword: ctx.searchQuery
 *   }),
 *   immediate: true
 * });
 * ```
 */
export function useTableData<T = any>(options: UseTableDataOptions<T>) {
  const {
    apiCall,
    apiCallParams,
    immediate = true,
    defaultPage = 1,
    defaultPageSize = 10,
    statisticsFn,
  } = options;

  // ============ 状态 ============
  const rawData = ref<{ list: T[]; total: number; page: number; pageSize: number } | null>(null);
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
    return rawData.value?.list || [];
  });
  
  /**
   * 获取总记录数
   */
  const total = computed(() => {
    return rawData.value?.total || 0;
  });
  
  /**
   * 获取数据的方法
   * @description 支持后端分页，会根据配置自动构建请求参数
   */
  const fetchData = async () => {
    loading.value = true;
    error.value = null;

    // 构建请求参数
    const params = apiCallParams
      ? apiCallParams({
          page: currentPage.value,
          pageSize: pageSize.value,
          searchQuery: searchQuery.value,
          filters: filters.value,
        })
      : {
          page: currentPage.value,
          pageSize: pageSize.value,
        };

    try {
      const result = await apiCall(params);
      
      // 拦截器返回 null 表示失败
      if (result === null) {
        error.value = new Error('获取数据失败');
        return;
      }

      rawData.value = result;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('获取数据失败');
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
   * 总页数
   */
  const totalPages = computed(() => {
    return Math.ceil(total.value / pageSize.value);
  });

  /**
   * 统计数据
   */
  const statistics = computed(() => {
    const items = data.value;
    
    if (statisticsFn) {
      return statisticsFn(items) || {};
    }

    return {
      total: total.value,
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
    fetchData();
  };

  /**
   * 跳转到指定页
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      fetchData();
    }
  };

  /**
   * 下一页
   */
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      fetchData();
    }
  };

  /**
   * 上一页
   */
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchData();
    }
  };

  /**
   * 设置每页数量
   */
  const setPageSize = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    fetchData();
  };

  /**
   * 添加数据
   */
  const addData = (item: T) => {
    if (!rawData.value) return;
    rawData.value.list = [item, ...rawData.value.list];
    rawData.value.total = rawData.value.total + 1;
  };

  /**
   * 更新数据
   */
  const updateData = (id: string | number, updates: Partial<T>) => {
    if (!rawData.value) return;
    const index = rawData.value.list.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      rawData.value.list[index] = { ...rawData.value.list[index], ...updates } as T;
    }
  };

  /**
   * 删除数据
   */
  const removeData = (id: string | number) => {
    if (!rawData.value) return;
    rawData.value.list = rawData.value.list.filter((item: any) => item.id !== id);
    rawData.value.total = rawData.value.total - 1;
  };

  /**
   * 批量删除数据
   */
  const batchRemoveData = (ids: (string | number)[]) => {
    if (!rawData.value) return;
    const deletedCount = rawData.value.list.filter((item: any) => ids.includes(item.id)).length;
    rawData.value.list = rawData.value.list.filter((item: any) => !ids.includes(item.id));
    rawData.value.total = rawData.value.total - deletedCount;
  };

  return {
    data,
    loading,
    error,
    searchQuery,
    filters,
    currentPage,
    pageSize,
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
