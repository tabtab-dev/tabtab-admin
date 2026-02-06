/**
 * 菜单状态管理
 * @description 使用 Pinia 管理菜单状态和动态路由
 */
import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { menuApi, menuApiMock } from '@/api';
import type { MenuItem, RouteConfig } from '@/types/menu';
import router from '@/router';
import { convertToRouteRecords } from '@/router/routeMapping';

/**
 * 是否使用 Mock 接口
 * 通过环境变量 VITE_USE_MOCK 控制
 */
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * 获取当前使用的 menu API
 * 根据环境变量自动切换正式接口和 Mock 接口
 */
const currentMenuApi = useMock ? menuApiMock : menuApi;

export const useMenuStore = defineStore('menu', () => {
  // State
  const menus = ref<MenuItem[]>([]);
  const routes = ref<RouteConfig[]>([]);
  const isLoading = ref(false);
  const isLoaded = ref(false);

  // Getters
  /**
   * 获取扁平化的菜单列表
   */
  const flatMenus = computed(() => {
    const flatten = (items: MenuItem[]): MenuItem[] => {
      return items.reduce((acc: MenuItem[], item) => {
        acc.push(item);
        if (item.children) {
          acc.push(...flatten(item.children));
        }
        return acc;
      }, []);
    };
    return flatten(menus.value);
  });

  /**
   * 获取路由标题映射
   */
  const routeTitleMap = computed(() => {
    const map: Record<string, string> = {};
    const traverse = (items: MenuItem[]) => {
      items.forEach((item) => {
        map[item.path] = item.i18nKey;
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(menus.value);
    return map;
  });

  // Actions
  /**
   * 获取菜单和路由数据
   * @returns 是否获取成功
   */
  const fetchMenus = async (): Promise<boolean> => {
    if (isLoading.value) return false;

    isLoading.value = true;
    try {
      const response = await currentMenuApi.getMenus();
      menus.value = response.menus;
      routes.value = response.routes;
      isLoaded.value = true;

      // 动态添加路由
      addDynamicRoutes(response.routes);

      return true;
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 添加动态路由
   * @param routeConfigs - 路由配置数组
   */
  const addDynamicRoutes = (routeConfigs: RouteConfig[]) => {
    // 转换并添加路由
    const dynamicRoutes = convertToRouteRecords(routeConfigs);

    dynamicRoutes.forEach((route) => {
      // 检查路由是否已存在（通过 name 检查）
      const existingRoutes = router.getRoutes();
      const isExists = existingRoutes.some((r) => r.name === route.name);

      if (!isExists) {
        // 路由不存在，添加到布局路由的子路由中
        router.addRoute('Root', route);
      }
    });
  };

  /**
   * 根据路径获取菜单项
   * @param path - 路由路径
   * @returns 菜单项或 undefined
   */
  const getMenuByPath = (path: string): MenuItem | undefined => {
    return flatMenus.value.find((menu) => menu.path === path);
  };

  /**
   * 根据路径获取路由标题的 i18n key
   * @param path - 路由路径
   * @returns i18n key
   */
  const getRouteTitleKey = (path: string): string => {
    return routeTitleMap.value[path] || path;
  };

  /**
   * 重置菜单状态
   */
  const reset = () => {
    menus.value = [];
    routes.value = [];
    isLoaded.value = false;
  };

  return {
    // State
    menus,
    routes,
    isLoading,
    isLoaded,
    // Getters
    flatMenus,
    routeTitleMap,
    // Actions
    fetchMenus,
    addDynamicRoutes,
    getMenuByPath,
    getRouteTitleKey,
    reset,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot));
}
