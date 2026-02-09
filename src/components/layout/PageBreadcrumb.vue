<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Icon } from '@/components/Icon';
import { useMenuStore } from '@/stores/global/menu';
import type { MenuItem } from '@/types/menu';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();

/**
 * 面包屑项
 */
interface BreadcrumbItemData {
  /** 标题 */
  title: string;
  /** 路径 */
  path: string;
  /** 图标名称 */
  icon?: string;
  /** 是否可点击 */
  clickable: boolean;
}

/**
 * 在菜单树中查找路径
 * @param menus 菜单列表
 * @param targetPath 目标路径
 * @param currentPath 当前路径数组
 * @returns 路径数组或 null
 */
const findPathInMenuTree = (
  menus: MenuItem[],
  targetPath: string,
  currentPath: MenuItem[] = []
): MenuItem[] | null => {
  for (const menu of menus) {
    const newPath = [...currentPath, menu];

    // 完全匹配
    if (menu.path === targetPath) {
      return newPath;
    }

    // 检查是否是父路径（用于子路由匹配）
    if (targetPath.startsWith(menu.path + '/') && menu.children) {
      const result = findPathInMenuTree(menu.children, targetPath, newPath);
      if (result) return result;
    }

    // 继续搜索子菜单
    if (menu.children) {
      const result = findPathInMenuTree(menu.children, targetPath, newPath);
      if (result) return result;
    }
  }
  return null;
};

/**
 * 面包屑数据
 */
const breadcrumbs = computed<BreadcrumbItemData[]>(() => {
  const currentPath = route.path;
  const result: BreadcrumbItemData[] = [];

  // 1. 首页（始终显示）
  result.push({
    title: t('menu.dashboard'),
    path: '/dashboard',
    icon: 'House',
    clickable: currentPath !== '/dashboard',
  });

  // 如果当前就是首页，直接返回
  if (currentPath === '/dashboard') {
    return result;
  }

  // 2. 从菜单数据中查找路径
  const menuPath = findPathInMenuTree(menuStore.menus, currentPath);

  if (menuPath && menuPath.length > 0) {
    // 使用菜单路径生成面包屑
    menuPath.forEach((menu, index) => {
      const isLast = index === menuPath.length - 1;
      result.push({
        title: t(menu.i18nKey),
        path: menu.path,
        icon: menu.icon,
        clickable: !isLast,
      });
    });
  } else {
    // 3. 回退：使用路由匹配生成面包屑
    const matchedRoutes = route.matched.filter(r => r.path !== '');

    matchedRoutes.forEach((matched, index) => {
      // 跳过根路由和 dashboard
      if (matched.path === '/' || matched.path === '/dashboard') return;

      const isLast = index === matchedRoutes.length - 1;
      const title = menuStore.getRouteTitle(matched.path);

      result.push({
        title: t(title),
        path: matched.path,
        icon: undefined,
        clickable: !isLast && matched.path !== currentPath,
      });
    });
  }

  return result;
});

/**
 * 处理面包屑点击
 * @param item 面包屑项
 */
const handleBreadcrumbClick = (item: BreadcrumbItemData) => {
  if (item.clickable && item.path) {
    router.push(item.path);
  }
};
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in breadcrumbs" :key="item.path">
        <BreadcrumbItem>
          <!-- 可点击的链接 -->
          <BreadcrumbLink
            v-if="item.clickable"
            as="button"
            class="flex items-center gap-1.5 cursor-pointer"
            @click="handleBreadcrumbClick(item)"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="h-3.5 w-3.5"
            />
            {{ item.title }}
          </BreadcrumbLink>

          <!-- 当前页面（不可点击） -->
          <BreadcrumbPage
            v-else
            class="flex items-center gap-1.5"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="h-3.5 w-3.5"
            />
            {{ item.title }}
          </BreadcrumbPage>
        </BreadcrumbItem>

        <!-- 分隔符（最后一个不显示） -->
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
