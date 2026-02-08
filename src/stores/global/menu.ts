/**
 * 菜单状态管理
 * @description 使用 Pinia 管理菜单状态和动态路由
 */
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';
import { menuApi } from '@/api';
import type { MenuItem, RouteConfig } from '@/types/menu';
import router from '@/router';
import { convertToRouteRecords } from '@/router/routeMapping';
import { flattenMenus, findMenuByPath } from '@/layouts/composables/useMenuUtils';

export const useMenuStore = defineStore(
  'menu',
  () => {
    // State
    const menus = ref<MenuItem[]>([]);
    const routes = ref<RouteConfig[]>([]);
    const isLoading = ref(false);
    const isLoaded = ref(false);

    // 记录已添加的动态路由名称，用于清理
    const addedRouteNames = ref<string[]>([]);

    // Getters
    /**
     * 获取扁平化的菜单列表
     */
    const flatMenus = computed(() => flattenMenus(menus.value));

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

    // 用于防止重复请求的 Promise 锁
    let pendingPromise: Promise<boolean> | null = null;

    // Actions
    /**
     * 获取菜单和路由数据
     * @returns 是否获取成功
     */
    const fetchMenus = async (): Promise<boolean> => {
      // 如果已经加载完成，直接返回成功
      if (isLoaded.value) {
        console.log('[MenuStore] Menus already loaded');
        return true;
      }

      // 如果正在加载中，返回正在进行的 Promise
      if (pendingPromise) {
        console.log('[MenuStore] Menus are loading, returning pending promise...');
        return pendingPromise;
      }

      // 创建新的加载 Promise
      pendingPromise = (async () => {
        isLoading.value = true;
        try {
          console.log('[MenuStore] Fetching menus...');
          const response = await menuApi.getMenus();
          menus.value = response.menus;
          routes.value = response.routes;
          isLoaded.value = true;

          // 动态添加路由
          addDynamicRoutes(response.routes);
          console.log('[MenuStore] Menus loaded and routes added');

          return true;
        } catch (error) {
          console.error('[MenuStore] Failed to fetch menus:', error);
          return false;
        } finally {
          isLoading.value = false;
          pendingPromise = null;
        }
      })();

      return pendingPromise;
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

          // 记录已添加的路由名称
          if (route.name && !addedRouteNames.value.includes(route.name as string)) {
            addedRouteNames.value.push(route.name as string);
          }
        }
      });
    };

    /**
     * 移除动态路由
     * 登出时调用，清理动态添加的路由
     */
    const removeDynamicRoutes = () => {
      addedRouteNames.value.forEach((routeName) => {
        try {
          router.removeRoute(routeName);
        } catch (error) {
          console.warn(`[MenuStore] 移除路由失败: ${routeName}`, error);
        }
      });

      // 清空记录
      addedRouteNames.value = [];
    };

    /**
     * 根据路径获取菜单项
     * @param path - 路由路径
     * @returns 菜单项或 undefined
     */
    const getMenuByPath = (path: string): MenuItem | undefined => {
      return findMenuByPath(menus.value, path);
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
      // 先移除动态路由
      removeDynamicRoutes();

      // 重置状态
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
      addedRouteNames,
      // Getters
      flatMenus,
      routeTitleMap,
      // Actions
      fetchMenus,
      addDynamicRoutes,
      removeDynamicRoutes,
      getMenuByPath,
      getRouteTitleKey,
      reset,
    };
  },
  {
    persist: false, // 菜单数据不持久化，每次登录重新获取
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot));
}
