<script setup lang="ts">
import type { SplitterPanel } from 'reka-ui';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useThemeStore } from '@/stores/global/theme';
import { pxToPercent, useMenuUtils } from '@/layouts/composables/useMenuUtils';
import type { SidebarConfig, SidebarMenuItem } from '@/types/menu';
import SidebarItem from './SidebarItem.vue';
import SidebarSubMenu from './SidebarSubMenu.vue';
import { useAuthStore } from '@/stores/global/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  PanelLeft,
  PanelRight,
  Settings,
  LogOut,
  User,
  ChevronUp,
} from 'lucide-vue-next';
import Logo from '../Logo.vue';

const { t } = useI18n();

/**
 * 组件属性
 */
interface Props {
  /** 侧栏配置 */
  config: SidebarConfig;
  /** 是否折叠 */
  collapsed: boolean;
  /** 当前尺寸（百分比） */
  currentSize: number;
  /** 是否拖拽中 */
  isDragging: boolean;
  /** 展开的子菜单 keys */
  expandedKeys: Set<string>;
}

const props = defineProps<Props>();

/**
 * 组件事件
 */
interface Emits {
  /** 调整尺寸 */
  (e: 'resize', size: number): void;
  /** 拖拽状态变化 */
  (e: 'dragging', dragging: boolean): void;
  /** 切换子菜单 */
  (e: 'toggle-sub-menu', key: string): void;
  /** 导航 */
  (e: 'navigate', path: string): void;
  /** 切换折叠状态 */
  (e: 'toggle-collapse'): void;
}

const emit = defineEmits<Emits>();

const themeStore = useThemeStore();
const authStore = useAuthStore();

/**
 * 侧边栏面板 ref
 */
const sidebarPanelRef = ref<InstanceType<typeof SplitterPanel> | null>(null);

/**
 * 侧边栏宽度（像素）
 */
const sidebarWidth = computed(() => themeStore.layoutConfig.sidebarWidth);

/**
 * 折叠宽度
 */
const collapsedWidth = computed(() => themeStore.layoutConfig.sidebarCollapsedWidth);

/**
 * 面板大小（百分比）
 */
const panelSize = computed(() => pxToPercent(sidebarWidth.value, window.innerWidth));

/**
 * 最小尺寸（百分比）
 */
const minSizePercent = computed(() => pxToPercent(props.config.minWidth, window.innerWidth));

/**
 * 最大尺寸（百分比）
 */
const maxSizePercent = computed(() => pxToPercent(props.config.maxWidth, window.innerWidth));

/**
 * 使用菜单工具函数
 */
const { isActive, isExpanded: checkExpanded } = useMenuUtils({
  expandedKeys: computed(() => props.expandedKeys),
});

/**
 * 判断是否展开
 */
const isExpanded = (key: string): boolean => {
  return checkExpanded(key);
};

/**
 * 处理导航
 * @param path - 导航路径
 */
const handleNavigate = (path: string): void => {
  emit('navigate', path);
};

/**
 * 切换子菜单
 * @param key - 菜单 key
 */
const handleToggleSubMenu = (key: string): void => {
  emit('toggle-sub-menu', key);
};

/**
 * 判断是否有子菜单
 */
const hasChildren = (item: SidebarMenuItem): boolean => {
  return !!item.children && item.children.length > 0;
};

/**
 * 处理折叠切换
 */
const handleToggleCollapse = (): void => {
  emit('toggle-collapse');
};

/**
 * 用户姓名首字母
 */
const userInitials = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || 'U';
});

/**
 * 用户菜单打开状态
 */
const isUserMenuOpen = ref(false);

/**
 * 路由实例
 */
const router = useRouter();

/**
 * 处理导航到个人资料
 */
const handleGoToProfile = () => {
  router.push('/profile');
};

/**
 * 处理导航到设置
 */
const handleGoToSettings = () => {
  router.push('/settings');
};

/**
 * 处理退出登录
 */
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

/**
 * 监听主题配置宽度变化，使用 resize() 方法实时调整面板大小
 */
watch(() => themeStore.layoutConfig.sidebarWidth, (newWidth) => {
  document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
  // 使用 resize() 方法实时调整面板大小
  if (sidebarPanelRef.value && !props.collapsed) {
    const newPercent = pxToPercent(newWidth, window.innerWidth);
    sidebarPanelRef.value.resize(newPercent);
  }
});
</script>

<template>
  <ResizablePanelGroup
    direction="horizontal"
    class="h-full hidden lg:flex"
  >
    <!-- 侧栏面板 -->
    <ResizablePanel
      ref="sidebarPanelRef"
      :min-size="minSizePercent"
      :max-size="maxSizePercent"
      :default-size="panelSize"
      @resize="(size: number) => $emit('resize', size)"
      class="flex flex-col border-r border-border/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 relative"
      :class="{ 'transition-none': isDragging }"
      :style="collapsed ? { flex: `0 0 ${collapsedWidth}px` } : {}"
    >
      <!-- 菜单区域背景装饰 -->
      <div
        v-if="!collapsed"
        class="absolute inset-0 pointer-events-none"
      >
        <div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/3 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-muted/20 to-transparent" />
      </div>

      <!-- Logo 区域 -->
      <div 
        class="relative z-10 border-b border-border/30"
        :class="collapsed ? 'p-2' : 'p-3'"
      >
        <div 
          class="flex items-center transition-all duration-200"
          :class="collapsed ? 'justify-center' : 'gap-3'"
        >
          <Logo :size="collapsed ? 36 : 40" :collapsed="collapsed" />
          <div v-if="!collapsed" class="flex flex-col min-w-0">
            <span class="text-sm font-bold tracking-tight truncate">TabTab Admin</span>
            <span class="text-[10px] text-muted-foreground truncate">管理系统</span>
          </div>
        </div>
        <!-- 折叠按钮 - Logo 下方 -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                @click="handleToggleCollapse"
                class="mt-2 w-full h-8 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted hover:text-primary transition-all duration-200"
                :class="collapsed ? 'px-0' : 'gap-2'"
              >
                <PanelLeft v-if="!collapsed" class="h-4 w-4" />
                <PanelRight v-else class="h-4 w-4" />
                <span v-if="!collapsed" class="text-xs text-muted-foreground">{{ t('common.sidebar.collapse') }}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent v-if="collapsed" side="right">
              <span>{{ t('common.sidebar.expand') }}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <!-- 菜单列表 -->
      <ScrollArea class="flex-1 h-0 relative z-10">
        <nav class="p-3 space-y-1 relative z-10">
          <!-- 渲染菜单 -->
          <template v-for="item in config.menus" :key="item.key">
            <!-- 展开状态 -->
            <template v-if="!collapsed">
              <!-- 有子菜单 -->
              <SidebarSubMenu
                v-if="hasChildren(item)"
                :item="item"
                :collapsed="collapsed"
                :active="isActive(item.path)"
                :expanded="isExpanded(item.key)"
                @toggle="handleToggleSubMenu(item.key)"
                @navigate="handleNavigate"
              />

              <!-- 无子菜单 -->
              <SidebarItem
                v-else
                :item="item"
                :collapsed="collapsed"
                :active="isActive(item.path)"
                @navigate="handleNavigate"
              />
            </template>

            <!-- 折叠状态 -->
            <template v-else>
              <SidebarSubMenu
                v-if="hasChildren(item)"
                :item="item"
                :collapsed="collapsed"
                :active="isActive(item.path)"
                :expanded="isExpanded(item.key)"
                @toggle="handleToggleSubMenu(item.key)"
                @navigate="handleNavigate"
              />
              <SidebarItem
                v-else
                :item="item"
                :collapsed="collapsed"
                :active="isActive(item.path)"
                @navigate="handleNavigate"
              />
            </template>
          </template>
        </nav>
      </ScrollArea>

      <!-- 底部区域 - 优化后的设计 -->
      <TooltipProvider>
        <div class="relative">
          <!-- 渐变分隔线 -->
          <div class="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div class="border-t border-border/30 bg-muted/40 backdrop-blur-md pt-1">
            <slot name="footer">
              <!-- 展开状态 -->
              <div
                v-if="!collapsed"
                class="px-3 py-2"
              >
                <!-- 用户信息下拉菜单 -->
                <DropdownMenu v-model:open="isUserMenuOpen">
                  <DropdownMenuTrigger as-child>
                    <button
                      class="group flex items-center gap-2.5 min-w-0 w-full rounded-xl p-2 hover:bg-muted/60 transition-all duration-200"
                    >
                      <!-- 用户头像 -->
                      <div class="relative flex-shrink-0">
                        <Avatar class="h-9 w-9 ring-2 ring-primary/20 transition-all duration-200 group-hover:ring-primary/40 group-hover:shadow-md">
                          <AvatarFallback class="text-sm font-semibold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                            {{ userInitials }}
                          </AvatarFallback>
                        </Avatar>
                        <!-- 在线状态指示点 -->
                        <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
                      </div>
                      <!-- 用户信息 -->
                      <div class="flex flex-col min-w-0 flex-1 text-left">
                        <span class="text-sm font-medium truncate group-hover:text-primary transition-colors duration-200">
                          {{ authStore.user?.name || '用户' }}
                        </span>
                        <span class="text-[11px] text-muted-foreground truncate">
                          {{ authStore.user?.email || 'user@example.com' }}
                        </span>
                      </div>
                      <!-- 下拉指示器 -->
                      <ChevronUp class="h-4 w-4 text-muted-foreground/50 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" class="w-56" :side-offset="8">
                    <div class="px-2 py-1.5">
                      <p class="text-xs font-medium text-muted-foreground">{{ t('common.sidebar.signedInAs') }}</p>
                      <p class="text-sm font-semibold truncate">{{ authStore.user?.email || 'user@example.com' }}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="handleGoToProfile" class="gap-2 cursor-pointer">
                      <User class="h-4 w-4" />
                      <span>{{ t('common.sidebar.profile') }}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="handleGoToSettings" class="gap-2 cursor-pointer">
                      <Settings class="h-4 w-4" />
                      <span>{{ t('common.sidebar.settings') }}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="handleLogout" class="gap-2 cursor-pointer text-destructive focus:text-destructive">
                      <LogOut class="h-4 w-4" />
                      <span>{{ t('common.sidebar.logout') }}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <!-- 折叠状态：用户头像 -->
              <div
                v-else
                class="py-3 px-2 flex flex-col items-center"
              >
                <!-- 用户头像下拉菜单 -->
                <DropdownMenu v-model:open="isUserMenuOpen">
                  <DropdownMenuTrigger as-child>
                    <button
                      class="group relative"
                    >
                      <Avatar class="h-10 w-10 ring-2 ring-primary/20 transition-all duration-200 group-hover:ring-primary/50 group-hover:shadow-lg">
                        <AvatarFallback class="text-sm font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                          {{ userInitials }}
                        </AvatarFallback>
                      </Avatar>
                      <!-- 在线状态指示点 -->
                      <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="right" class="w-56" :side-offset="8">
                    <div class="px-2 py-1.5">
                      <p class="text-xs font-medium text-muted-foreground">{{ t('common.sidebar.signedInAs') }}</p>
                      <p class="text-sm font-semibold truncate">{{ authStore.user?.email || 'user@example.com' }}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="handleGoToProfile" class="gap-2 cursor-pointer">
                      <User class="h-4 w-4" />
                      <span>{{ t('common.sidebar.profile') }}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="handleGoToSettings" class="gap-2 cursor-pointer">
                      <Settings class="h-4 w-4" />
                      <span>{{ t('common.sidebar.settings') }}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="handleLogout" class="gap-2 cursor-pointer text-destructive focus:text-destructive">
                      <LogOut class="h-4 w-4" />
                      <span>{{ t('common.sidebar.logout') }}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </slot>
          </div>
        </div>
      </TooltipProvider>
    </ResizablePanel>

    <!-- 拖拽手柄 -->
    <ResizableHandle
      v-if="!collapsed"
      with-handle
      class="w-1.5 bg-transparent hover:bg-primary/20 transition-colors relative after:absolute after:inset-y-4 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-8 after:rounded-full after:bg-border/60 hover:after:bg-primary/50"
      @dragging="(dragging: boolean) => $emit('dragging', dragging)"
    />

    <!-- 内容面板 - 自动填充剩余空间 -->
    <ResizablePanel :min-size="50">
      <main class="h-full min-w-0 bg-background">
        <slot />
      </main>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
