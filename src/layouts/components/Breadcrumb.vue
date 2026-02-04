<script setup lang="ts">
import { computed, h, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
  Archive,
  MapPin,
  Building,
  LayoutDashboard,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-vue-next';
import { routeTitleMap } from './sidebar/config';

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

  // 首页
  items.push({
    title: '首页',
    path: '/',
    clickable: path !== '/',
    icon: Home,
  });

  // 解析路径
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const title = routeTitleMap[currentPath] || segment;

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
 * 是否需要折叠（路径超过4项时）
 */
const shouldCollapse = computed(() => breadcrumbs.value.length > 4);

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
    { title: '...', path: '', clickable: false, icon: MoreHorizontal }, // 省略号
    ...items.slice(-2), // 最后两项
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
    <!-- 箭头路径风格面包屑 -->
    <ol class="flex items-center">
      <template v-for="(item, index) in displayedBreadcrumbs" :key="item.path || index">
        <li class="flex items-center">
          <!-- 箭头形状容器 -->
          <div
            class="breadcrumb-item relative flex items-center h-8 transition-all duration-300 ease-out group"
            :class="[
              // 当前页样式（最后一项）
              index === displayedBreadcrumbs.length - 1
                ? 'breadcrumb-active z-10'
                : 'breadcrumb-inactive',
              // 可点击样式
              item.clickable ? 'cursor-pointer' : 'cursor-default',
              // 第一项（首页）特殊样式
              index === 0 ? 'breadcrumb-first' : '',
            ]"
            @click="handleClick(item)"
          >
            <!-- 背景形状 -->
            <div
              class="breadcrumb-bg absolute inset-0 transition-all duration-300"
              :class="[
                index === displayedBreadcrumbs.length - 1
                  ? 'bg-primary/15'
                  : 'bg-transparent group-hover:bg-muted/60',
              ]"
            />

            <!-- 内容区域 -->
            <div class="relative flex items-center gap-1.5 px-3 py-1.5">
              <!-- 图标 -->
              <component
                :is="item.icon"
                class="h-3.5 w-3.5 transition-colors duration-300"
                :class="[
                  index === displayedBreadcrumbs.length - 1
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground',
                ]"
              />

              <!-- 标题 -->
              <span
                class="text-sm font-medium transition-colors duration-300 whitespace-nowrap"
                :class="[
                  index === displayedBreadcrumbs.length - 1
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground',
                ]"
              >
                {{ item.title }}
              </span>
            </div>

            <!-- 箭头分隔符（除最后一项外） -->
            <div
              v-if="index < displayedBreadcrumbs.length - 1"
              class="breadcrumb-arrow absolute -right-3 w-3 h-full flex items-center justify-center z-10"
            >
              <ChevronRight
                class="h-3.5 w-3.5 text-muted-foreground/30 transition-all duration-300 group-hover:text-muted-foreground/50 group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </li>
      </template>
    </ol>
  </nav>
</template>

<style scoped>
/* 面包屑项基础样式 */
.breadcrumb-item {
  margin-right: 12px;
}

/* 背景圆角 - 使用主题设置的 --radius 变量（--radius 单位是 rem） */
.breadcrumb-bg {
  border-radius: calc(var(--radius) * 0.75);
}

/* 当前激活项样式 */
.breadcrumb-active .breadcrumb-bg {
  box-shadow:
    0 1px 2px 0 rgb(0 0 0 / 0.05),
    0 0 0 1px rgb(var(--primary) / 0.1);
}

/* 首页特殊样式 */
.breadcrumb-first .breadcrumb-bg {
  border-radius: calc(var(--radius) * 0.75);
}

/* 悬停效果 */
.breadcrumb-inactive:hover .breadcrumb-bg {
  transform: scale(1.02);
}

.breadcrumb-active {
  animation: breadcrumb-in 0.3s ease-out;
}

/* 进入动画 */
@keyframes breadcrumb-in {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 面包屑项依次进入动画 */
.breadcrumb-item {
  animation: breadcrumb-in 0.3s ease-out backwards;
}

.breadcrumb-item:nth-child(1) { animation-delay: 0ms; }
.breadcrumb-item:nth-child(2) { animation-delay: 50ms; }
.breadcrumb-item:nth-child(3) { animation-delay: 100ms; }
.breadcrumb-item:nth-child(4) { animation-delay: 150ms; }
.breadcrumb-item:nth-child(5) { animation-delay: 200ms; }
.breadcrumb-item:nth-child(6) { animation-delay: 250ms; }

/* 箭头分隔符微调 */
.breadcrumb-arrow {
  pointer-events: none;
}

/* 响应式：小屏幕隐藏文字，只显示图标 */
@media (max-width: 640px) {
  .breadcrumb-item:not(.breadcrumb-active) span {
    display: none;
  }

  .breadcrumb-item {
    margin-right: 8px;
  }
}
</style>
