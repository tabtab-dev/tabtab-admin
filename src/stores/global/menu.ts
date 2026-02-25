import type { MenuItem, RouteConfig } from '@/types/menu'
/**
 * 菜单状态管理
 * @description 使用 Pinia 管理菜单状态和动态路由
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import { menuApi } from '@/api'
import router from '@/router'
import { convertToRouteRecords } from '@/router/routeMapping'

/**
 * 从路由配置生成菜单数据
 * 提取需要展示在侧边栏的菜单项
 * @param routes - 路由配置数组
 * @returns 菜单项数组
 */
function generateMenusFromRoutes(routes: RouteConfig[]): MenuItem[] {
  return routes
    .filter(route => !route.meta?.hideInMenu)
    .map((route) => {
      const menu: MenuItem = {
        path: route.path,
        title: route.meta?.title || '',
        icon: route.meta?.icon,
        hideInMenu: route.meta?.hideInMenu,
        order: route.meta?.order,
        i18nKey: route.meta?.i18nKey,
        badge: route.meta?.badge,
        group: route.meta?.group,
      }

      if (route.children && route.children.length > 0) {
        menu.children = generateMenusFromRoutes(route.children)
      }

      return menu
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

export const useMenuStore = defineStore(
  'menu',
  () => {
    // State
    const menus = ref<MenuItem[]>([])
    const routes = ref<RouteConfig[]>([])
    const isLoading = ref(false)
    const isLoaded = ref(false)

    // 记录已添加的动态路由名称，用于清理
    const addedRouteNames = ref<string[]>([])

    // Getters
    /**
     * 获取扁平化的菜单列表
     */
    const flatMenus = computed(() => {
      const result: MenuItem[] = []
      const traverse = (items: MenuItem[]) => {
        items.forEach((item) => {
          result.push(item)
          if (item.children) {
            traverse(item.children)
          }
        })
      }
      traverse(menus.value)
      return result
    })

    /**
     * 获取路由标题映射（使用国际化 key）
     */
    const routeTitleMap = computed(() => {
      const map: Record<string, string> = {}
      const traverse = (items: RouteConfig[]) => {
        items.forEach((item) => {
          // 优先使用 i18nKey，如果没有则回退到 title
          map[item.path] = item.meta.i18nKey || item.meta.title
          if (item.children) {
            traverse(item.children)
          }
        })
      }
      traverse(routes.value)
      return map
    })

    // 用于防止重复请求的 Promise 锁
    let pendingPromise: Promise<boolean> | null = null

    /**
     * 添加动态路由
     * @param routeConfigs - 路由配置数组
     */
    const addDynamicRoutes = (routeConfigs: RouteConfig[]) => {
      const dynamicRoutes = convertToRouteRecords(routeConfigs)

      dynamicRoutes.forEach((route) => {
        const existingRoutes = router.getRoutes()
        const isExists = existingRoutes.some(r => r.name === route.name)

        if (!isExists) {
          router.addRoute('Root', route)

          if (route.name && !addedRouteNames.value.includes(route.name as string)) {
            addedRouteNames.value.push(route.name as string)
          }
        }
      })
    }

    // Actions
    /**
     * 获取菜单和路由数据
     * @returns 是否获取成功
     */
    const fetchMenus = async (): Promise<boolean> => {
      if (isLoaded.value) {
        console.warn('[MenuStore] Menus already loaded')
        return true
      }

      if (pendingPromise) {
        console.warn('[MenuStore] Menus are loading, returning pending promise...')
        return pendingPromise
      }

      pendingPromise = (async () => {
        isLoading.value = true
        try {
          console.warn('[MenuStore] Fetching menus...')
          const routeConfigs = await menuApi.getUserMenus() as RouteConfig[]
          console.warn('[MenuStore] Response:', routeConfigs)

          routes.value = routeConfigs
          menus.value = generateMenusFromRoutes(routeConfigs)
          isLoaded.value = true

          addDynamicRoutes(routeConfigs)
          console.warn('[MenuStore] Menus loaded and routes added')

          return true
        }
        catch (error) {
          console.error('[MenuStore] Failed to fetch menus:', error)
          return false
        }
        finally {
          isLoading.value = false
          pendingPromise = null
        }
      })()

      return pendingPromise
    }

    /**
     * 移除动态路由
     * 登出时调用，清理动态添加的路由
     */
    const removeDynamicRoutes = () => {
      addedRouteNames.value.forEach((routeName) => {
        try {
          router.removeRoute(routeName)
        }
        catch (error) {
          console.warn(`[MenuStore] 移除路由失败: ${routeName}`, error)
        }
      })

      // 清空记录
      addedRouteNames.value = []
    }

    /**
     * 根据路径获取菜单项
     * @param path - 路由路径
     * @returns 菜单项或 undefined
     */
    const getMenuByPath = (path: string): MenuItem | undefined => {
      const find = (items: MenuItem[]): MenuItem | undefined => {
        for (const item of items) {
          if (item.path === path) {
            return item
          }
          if (item.children) {
            const found = find(item.children)
            if (found)
              return found
          }
        }
        return undefined
      }
      return find(menus.value)
    }

    /**
     * 根据路径获取路由标题
     * @param path - 路由路径
     * @returns 标题
     */
    const getRouteTitle = (path: string): string => {
      return routeTitleMap.value[path] || path
    }

    /**
     * 重置菜单状态
     */
    const reset = () => {
      // 先移除动态路由
      removeDynamicRoutes()

      // 重置状态
      menus.value = []
      routes.value = []
      isLoaded.value = false
    }

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
      getRouteTitle,
      reset,
    }
  },
  {
    persist: false, // 菜单数据不持久化，每次登录重新获取
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
}
