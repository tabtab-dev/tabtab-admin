<script setup lang="ts">
import { computed } from 'vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/Icon';
import { useMenuStore } from '@/stores/global/menu';
import type { MenuItem } from '@/types/menu';
import type { BreadcrumbItemData, BreadcrumbChildItem } from './types';
import { ChevronDown, House } from 'lucide-vue-next';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();

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
 * 获取菜单项的兄弟节点（同级菜单）
 * @param menus 菜单列表
 * @param targetPath 目标路径
 * @returns 兄弟节点数组
 */
const findSiblingsInMenuTree = (menus: MenuItem[], targetPath: string): MenuItem[] => {
  for (const menu of menus) {
    // 如果当前菜单就是要找的，返回所有兄弟
    if (menu.path === targetPath) {
      return menus;
    }

    // 在子菜单中查找
    if (menu.children) {
      const result = findSiblingsInMenuTree(menu.children, targetPath);
      if (result.length > 0) return result;
    }
  }
  return [];
};

/**
 * 获取菜单项的描述信息
 * @param menu 菜单项
 * @returns 描述文本
 */
const getMenuDescription = (menu: MenuItem): string => {
  // 返回默认提示文本
  return t('common.breadcrumb.clickToEnter');
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
    isCurrent: currentPath === '/dashboard',
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
      
      // 获取该层级的兄弟节点（用于下拉菜单）
      const siblings = findSiblingsInMenuTree(menuStore.menus, menu.path);
      const children: BreadcrumbChildItem[] = siblings
        .filter(sibling => sibling.path !== menu.path)
        .map(sibling => ({
          title: t(sibling.i18nKey),
          path: sibling.path,
          icon: sibling.icon,
          description: getMenuDescription(sibling),
          isActive: false,
        }));

      result.push({
        title: t(menu.i18nKey),
        path: menu.path,
        icon: menu.icon,
        clickable: !isLast,
        isCurrent: isLast,
        children: children.length > 0 ? children : undefined,
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
        isCurrent: isLast,
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

/**
 * 处理 Bento 卡片点击
 * @param path 路径
 */
const handleBentoCardClick = (path: string) => {
  router.push(path);
};

/**
 * 计算 Bento 网格的列数
 * @param childrenCount 子项数量
 * @returns 列数
 */
const getGridCols = (childrenCount: number): string => {
  if (childrenCount <= 2) return 'grid-cols-2';
  if (childrenCount <= 4) return 'grid-cols-2';
  return 'grid-cols-3';
};
</script>

<template>
  <nav aria-label="breadcrumb" class="flex items-center">
    <ol class="flex items-center gap-1">
      <template v-for="(item, index) in breadcrumbs" :key="item.path">
        <li class="flex items-center">
          <!-- 有子菜单的项 - 使用 Bento 下拉面板 -->
          <DropdownMenu v-if="item.children && item.children.length > 0">
            <DropdownMenuTrigger as-child>
              <button
                class="group relative inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[13px] font-medium transition-all duration-200 overflow-hidden"
                :class="[
                  item.isCurrent
                    ? 'bg-primary/8 text-foreground border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                ]"
              >
                <Icon
                  v-if="item.icon"
                  :name="item.icon"
                  class="h-3.5 w-3.5 relative z-10 flex-shrink-0"
                  :class="item.isCurrent ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'"
                />
                <House v-else-if="index === 0" class="h-3.5 w-3.5 relative z-10 flex-shrink-0" />
                <span class="relative z-10 max-w-[100px] truncate" :title="item.title">{{ item.title }}</span>
                <ChevronDown
                  class="h-3 w-3 relative z-10 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  :class="item.isCurrent ? 'text-primary/60' : 'text-muted-foreground/60'"
                />
              </button>
            </DropdownMenuTrigger>
            
            <!-- Bento 网格下拉面板 -->
            <DropdownMenuContent
              align="start"
              class="min-w-[340px] w-auto max-w-[440px] p-0 overflow-hidden bg-popover border border-border/80 shadow-xl rounded-xl"
              :side-offset="4"
            >
              <!-- 面板头部 -->
              <div class="relative px-3 py-2.5 bg-muted/30 border-b border-border/50">
                <!-- 左侧渐变色装饰 -->
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/20"></div>
                <div class="flex items-center gap-2.5">
                  <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon
                      v-if="item.icon"
                      :name="item.icon"
                      class="h-4 w-4 text-primary"
                    />
                    <House v-else class="h-4 w-4 text-primary" />
                  </div>
                  <div class="flex-1 min-w-0 max-w-[180px]">
                    <p class="text-[13px] font-medium text-foreground truncate" :title="item.title">{{ item.title }}</p>
                    <p class="text-[11px] text-muted-foreground">{{ t('common.breadcrumb.selectModule') }}</p>
                  </div>
                </div>
              </div>

              <!-- Bento 网格卡片 -->
              <div class="p-2.5 bg-popover">
                <div 
                  class="grid gap-1.5"
                  :class="getGridCols(item.children?.length || 0)"
                >
                  <button
                    v-for="(child, childIndex) in item.children"
                    :key="child.path"
                    class="group flex flex-col items-start gap-1.5 p-2.5 rounded-lg bg-muted/30 hover:bg-primary/8 border border-transparent hover:border-primary/20 transition-all duration-200 text-left"
                    :style="{ animationDelay: `${childIndex * 50}ms` }"
                    @click="handleBentoCardClick(child.path)"
                  >
                    <!-- 图标容器 -->
                    <div class="h-7 w-7 rounded-md bg-background border border-border/50 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-200">
                      <Icon
                        v-if="child.icon"
                        :name="child.icon"
                        class="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200"
                      />
                      <House v-else class="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                    
                    <!-- 文字内容 -->
                    <div class="flex-1 min-w-0 w-full">
                      <p
                        class="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate"
                        :title="child.title"
                      >
                        {{ child.title }}
                      </p>
                      <p
                        class="text-[11px] text-muted-foreground/70 line-clamp-1 mt-0.5 leading-tight"
                        :title="child.description"
                      >
                        {{ child.description }}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <!-- 面板底部 -->
              <div class="px-3 py-1.5 bg-muted/30 border-t border-border/50">
                <p class="text-[10px] text-muted-foreground/60 text-center">
                  {{ t('common.breadcrumb.moduleCount', { count: item.children?.length || 0 }) }}
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- 当前页面（无下拉）- 柔和的高亮 -->
          <div
            v-else-if="item.isCurrent"
            class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[13px] font-medium bg-primary/8 text-foreground border border-primary/20 max-w-[200px]"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="h-3.5 w-3.5 text-primary flex-shrink-0"
            />
            <House v-else-if="index === 0" class="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span class="truncate" :title="item.title">{{ item.title }}</span>
          </div>

          <!-- 普通可点击项 -->
          <button
            v-else
            class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 max-w-[150px]"
            @click="handleBreadcrumbClick(item)"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0"
            />
            <House v-else-if="index === 0" class="h-3.5 w-3.5 flex-shrink-0" />
            <span class="truncate" :title="item.title">{{ item.title }}</span>
          </button>
        </li>
      </template>
    </ol>
  </nav>
</template>
