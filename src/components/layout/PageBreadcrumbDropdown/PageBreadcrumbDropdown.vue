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
import { ChevronDown, House, Sparkles } from 'lucide-vue-next';

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
  // 优先使用菜单自身的描述，否则返回默认提示
  return menu.description || t('breadcrumb.clickToEnter');
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
    <ol class="flex items-center gap-0.5">
      <template v-for="(item, index) in breadcrumbs" :key="item.path">
        <!-- 分隔符 - 更精致的设计 -->
        <li 
          v-if="index > 0" 
          class="flex items-center px-1"
        >
          <div class="h-4 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        </li>

        <li class="flex items-center">
          <!-- 有子菜单的项 - 使用 Bento 下拉面板 -->
          <DropdownMenu v-if="item.children && item.children.length > 0">
            <DropdownMenuTrigger as-child>
              <button
                class="group relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden"
                :class="[
                  item.isCurrent
                    ? 'bg-muted/80 text-foreground border border-border/60 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                ]"
              >
                <!-- 悬停光效 -->
                <div 
                  v-if="!item.isCurrent"
                  class="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                />
                
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
                  :class="item.isCurrent ? 'text-primary' : 'text-muted-foreground/70'"
                />
              </button>
            </DropdownMenuTrigger>
            
            <!-- Bento 网格下拉面板 -->
            <DropdownMenuContent
              align="start"
              class="min-w-[360px] w-auto max-w-[480px] p-0 overflow-hidden bg-popover border border-border shadow-2xl rounded-2xl"
              :side-offset="6"
            >
              <!-- 面板头部 - 渐变背景 -->
              <div class="relative px-4 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-border/50">
                <!-- 装饰光点 -->
                <div class="absolute top-0 right-4 w-16 h-16 bg-primary/20 rounded-full blur-2xl" />
                
                <div class="relative flex items-center gap-3">
                  <div class="h-9 w-9 rounded-xl bg-background shadow-sm border border-border/50 flex items-center justify-center">
                    <Icon
                      v-if="item.icon"
                      :name="item.icon"
                      class="h-4 w-4 text-primary"
                    />
                    <House v-else class="h-4 w-4 text-primary" />
                  </div>
                  <div class="flex-1 min-w-0 max-w-[200px]">
                    <p class="text-sm font-semibold text-foreground truncate" :title="item.title">{{ item.title }}</p>
                    <p class="text-xs text-muted-foreground">{{ t('breadcrumb.selectModule') }}</p>
                  </div>
                  <Sparkles class="h-4 w-4 text-primary/50" />
                </div>
              </div>

              <!-- Bento 网格卡片 -->
              <div class="p-3 bg-popover">
                <div 
                  class="grid gap-2"
                  :class="getGridCols(item.children?.length || 0)"
                >
                  <button
                    v-for="(child, childIndex) in item.children"
                    :key="child.path"
                    class="group relative flex flex-col items-start gap-2 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-200 text-left overflow-hidden"
                    :style="{ animationDelay: `${childIndex * 50}ms` }"
                    @click="handleBentoCardClick(child.path)"
                  >
                    <!-- 悬停背景渐变 -->
                    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    
                    <!-- 图标容器 -->
                    <div class="relative h-9 w-9 rounded-lg bg-background shadow-sm border border-border/60 flex items-center justify-center group-hover:border-primary/40 group-hover:shadow-md transition-all duration-200">
                      <Icon
                        v-if="child.icon"
                        :name="child.icon"
                        class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200"
                      />
                      <House v-else class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                    
                    <!-- 文字内容 -->
                    <div class="relative flex-1 min-w-0 w-full">
                      <p
                        class="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate"
                        :title="child.title"
                      >
                        {{ child.title }}
                      </p>
                      <p
                        class="text-[11px] text-muted-foreground/80 line-clamp-2 mt-0.5 leading-tight"
                        :title="child.description"
                      >
                        {{ child.description }}
                      </p>
                    </div>

                    <!-- 悬停指示器 -->
                    <div class="absolute top-2 right-2 flex items-center gap-1">
                      <div class="h-1.5 w-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-200" />
                    </div>
                  </button>
                </div>
              </div>

              <!-- 面板底部 -->
              <div class="px-4 py-2 bg-muted/50 border-t border-border/50">
                <p class="text-[11px] text-muted-foreground/70 text-center">
                  {{ t('breadcrumb.moduleCount', { count: item.children?.length || 0 }) }}
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- 当前页面（无下拉）- 使用柔和的背景色 -->
          <div
            v-else-if="item.isCurrent"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium bg-muted/80 text-foreground border border-border/60 shadow-sm max-w-[200px]"
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
            class="group relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 overflow-hidden max-w-[150px]"
            @click="handleBreadcrumbClick(item)"
          >
            <!-- 悬停光效 -->
            <div class="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="h-3.5 w-3.5 relative z-10 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0"
            />
            <House v-else-if="index === 0" class="h-3.5 w-3.5 relative z-10 flex-shrink-0" />
            <span class="relative z-10 truncate" :title="item.title">{{ item.title }}</span>
          </button>
        </li>
      </template>
    </ol>
  </nav>
</template>
