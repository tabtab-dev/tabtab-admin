<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import {
  Home,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  FileText,
  Tags,
  Warehouse,
  TrendingUp,
  DollarSign,
  UserCircle,
  FolderTree,
  Layers,
  Box,
  Truck,
  ClipboardList,
  MapPin,
  Building,
  LayoutDashboard,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-vue-next';
import { useMenuStore } from '@/stores/menu';

const { t } = useI18n();
const menuStore = useMenuStore();

/**
 * 面包屑项
 */
interface BreadcrumbItem {
  /** 标题 */
  title: string;
  /** 路径 */
  path: string;
  /** 是否可点击 */
  clickable: boolean;
  /** 图标组件 */
  icon: Component;
  /** 是否为省略号 */
  isEllipsis?: boolean;
}

/**
 * 路径图标映射
 */
const pathIconMap: Record<string, Component> = {
  '/': LayoutDashboard,
  '/users': Users,
  '/orders': ShoppingCart,
  '/products': Package,
  '/products/categories': Tags,
  '/products/categories/level1': FolderTree,
  '/products/categories/level2': Layers,
  '/products/categories/tags': Box,
  '/products/inventory': Warehouse,
  '/products/inventory/stock': ClipboardList,
  '/products/inventory/warehouse': Building,
  '/products/inventory/warehouse/beijing': MapPin,
  '/products/inventory/warehouse/shanghai': MapPin,
  '/products/inventory/logistics': Truck,
  '/analytics': BarChart3,
  '/analytics/traffic': TrendingUp,
  '/analytics/sales': DollarSign,
  '/analytics/users': UserCircle,
  '/settings': Settings,
};

const route = useRoute();
const router = useRouter();

/**
 * 获取路径对应的图标
 * @param path 路径
 * @returns 图标组件
 */
const getPathIcon = (path: string): Component => {
  // 精确匹配
  if (pathIconMap[path]) {
    return pathIconMap[path];
  }
  // 尝试匹配父路径
  const segments = path.split('/').filter(Boolean);
  for (let i = segments.length - 1; i >= 0; i--) {
    const parentPath = '/' + segments.slice(0, i + 1).join('/');
    if (pathIconMap[parentPath]) {
      return pathIconMap[parentPath];
    }
  }
  return FileText;
};

/**
 * 生成面包屑列表
 */
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const path = route.path;
  const items: BreadcrumbItem[] = [];

  // 判断是否为首页（支持 '/' 和 '/dashboard'）
  const isHomePage = path === '/' || path === '/dashboard';

  // 首页
  items.push({
    title: t('common.breadcrumb.home'),
    path: '/dashboard',
    clickable: false,
    icon: Home,
  });

  // 如果是首页，直接返回
  if (isHomePage) {
    return items;
  }

  // 解析其他路径
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const titleKey = menuStore.getRouteTitleKey(currentPath);
    const title = titleKey !== currentPath ? t(titleKey) : segment;

    items.push({
      title,
      path: currentPath,
      clickable: !isLast,
      icon: getPathIcon(currentPath),
    });
  });

  return items;
});

/**
 * 是否需要折叠（路径超过5项时）
 */
const shouldCollapse = computed(() => breadcrumbs.value.length > 5);

/**
 * 折叠后的面包屑列表
 */
const displayedBreadcrumbs = computed(() => {
  if (!shouldCollapse.value) {
    return breadcrumbs.value;
  }
  const items = breadcrumbs.value;
  return [
    items[0], // 首页
    { title: t('common.breadcrumb.ellipsis'), path: '', clickable: false, icon: MoreHorizontal, isEllipsis: true }, // 省略号
    ...items.slice(-3), // 最后三项
  ];
});

/**
 * 处理点击
 */
const handleClick = (item: BreadcrumbItem): void => {
  if (item.clickable && item.path) {
    router.push(item.path);
  }
};
</script>

<template>
  <nav class="flex items-center" aria-label="breadcrumb">
    <ol class="flex items-center gap-0.5">
      <template v-for="(item, index) in displayedBreadcrumbs" :key="item.path || index">
        <li class="flex items-center">
          <!-- 可点击项使用 ghost 按钮 -->
          <Button
            v-if="item.clickable"
            variant="ghost"
            size="sm"
            class="h-7 px-2 text-muted-foreground hover:text-foreground font-normal"
            @click="handleClick(item)"
          >
            <component
              :is="item.icon"
              class="h-3.5 w-3.5 mr-1.5"
            />
            <span class="text-sm">{{ item.title }}</span>
          </Button>

          <!-- 省略号 -->
          <span
            v-else-if="item.isEllipsis"
            class="flex items-center px-2 text-muted-foreground"
          >
            <MoreHorizontal class="h-4 w-4" />
          </span>

          <!-- 当前页（最后一项）使用普通文本 -->
          <span
            v-else
            class="flex items-center px-2 text-sm font-semibold text-foreground"
          >
            <component
              :is="item.icon"
              class="h-3.5 w-3.5 mr-1.5 text-primary"
            />
            {{ item.title }}
          </span>
        </li>

        <!-- 分隔符（除最后一项外） -->
        <li v-if="index < displayedBreadcrumbs.length - 1" class="flex items-center">
          <ChevronRight class="h-4 w-4 text-muted-foreground/40 mx-0.5" />
        </li>
      </template>
    </ol>
  </nav>
</template>
