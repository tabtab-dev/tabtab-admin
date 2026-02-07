/**
 * 表格逻辑封装
 * @description 封装表格常用的逻辑，如分页、排序、筛选等
 */
import { ref, computed } from 'vue';
import type { PaginationData } from '@/api';
import { PAGINATION_DEFAULT } from '@/constants';

/**
 * 表格配置选项
 */
export interface UseTableOptions<T> {
  /** 初始数据 */
  initialData?: T[];
  /** 初始页码 */
  initialPage?: number;
  /** 初始每页数量 */
  initialPageSize?: number;
  /** 是否自动加载数据 */
  autoLoad?: boolean;
  /** 加载数据的函数 */
  loadData?: (params: { page: number; pageSize: number }) => Promise<PaginationData<T>>;
}

/**
 * 表格 Hook
 * @param options - 配置选项
 * @returns 表格状态和操作方法
 *
 * @example
 * ```ts
 * const { data, loading, pagination, refresh } = useTable({
 *   loadData: async (params) => {
 *     const response = await usersApi.getUsers(params);
 *     return response;
 *   }
 * });
 * ```
 */
export function useTable<T = any>(options: UseTableOptions<T> = {}) {
  const {
    initialData = [],
    initialPage = PAGINATION_DEFAULT.page,
    initialPageSize = PAGINATION_DEFAULT.pageSize,
    autoLoad = true,
    loadData,
  } = options;

  // 状态
  const data = ref<T[]>(initialData);
  const loading = ref(false);
  const total = ref(0);
  const currentPage = ref(initialPage);
  const pageSize = ref(initialPageSize);
  const selectedRows = ref<T[]>([]);

  // 分页信息
  const pagination = computed(() => ({
    current: currentPage.value,
    pageSize: pageSize.value,
    total: total.value,
    showSizeChanger: true,
    pageSizeOptions: PAGINATION_DEFAULT.pageSizeOptions,
    showTotal: (total: number) => `共 ${total} 条`,
  }));

  // 加载数据
  const load = async () => {
    if (!loadData) return;

    loading.value = true;
    try {
      const response = await loadData({
        page: currentPage.value,
        pageSize: pageSize.value,
      });
      data.value = response.list;
      total.value = response.total;
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 刷新数据
  const refresh = () => {
    currentPage.value = 1;
    return load();
  };

  // 切换页码
  const changePage = (page: number) => {
    currentPage.value = page;
    return load();
  };

  // 切换每页数量
  const changePageSize = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    return load();
  };

  // 选择行
  const selectRow = (row: T, selected: boolean) => {
    if (selected) {
      if (!selectedRows.value.includes(row)) {
        selectedRows.value.push(row);
      }
    } else {
      const index = selectedRows.value.findIndex((r) => r === row);
      if (index > -1) {
        selectedRows.value.splice(index, 1);
      }
    }
  };

  // 全选/取消全选
  const selectAll = (rows: T[], selected: boolean) => {
    if (selected) {
      rows.forEach(row => {
        if (!selectedRows.value.includes(row)) {
          selectedRows.value.push(row);
        }
      });
    } else {
      selectedRows.value = selectedRows.value.filter((r) => !rows.includes(r));
    }
  };

  // 清空选择
  const clearSelection = () => {
    selectedRows.value = [];
  };

  // 自动加载
  if (autoLoad && loadData) {
    load();
  }

  return {
    // 状态
    data,
    loading,
    total,
    currentPage,
    pageSize,
    selectedRows,
    pagination,
    // 方法
    load,
    refresh,
    changePage,
    changePageSize,
    selectRow,
    selectAll,
    clearSelection,
  };
}
