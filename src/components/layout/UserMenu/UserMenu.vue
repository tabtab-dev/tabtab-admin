<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/global/auth';
import { useThemeStore } from '@/stores/global/theme';
import { useLocaleStore } from '@/stores/global/locale';
import { Icon } from '@/components/Icon';
import {
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  Palette,
  ChevronDown,
  Sparkles,
} from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const localeStore = useLocaleStore();

/**
 * 下拉菜单打开状态
 */
const isOpen = ref(false);

/**
 * 监听主题变化，关闭下拉菜单以避免 DOM 操作错误
 */
watch(() => themeStore.currentMode, () => {
  isOpen.value = false;
});

/**
 * 用户信息
 */
const userInfo = computed(() => ({
  name: authStore.user?.name || t('common.header.user'),
  email: authStore.user?.email || 'user@example.com',
  avatar: authStore.user?.avatar,
  role: authStore.user?.role || 'admin',
}));

/**
 * 当前主题模式
 */
const isDark = computed(() => themeStore.currentMode === 'dark');

/**
 * 当前语言
 */
const currentLocale = computed(() => localeStore.currentLocale);

/**
 * 菜单项配置
 */
const menuItems = computed(() => [
  {
    id: 'profile',
    title: t('common.header.profile'),
    description: t('common.header.profileDesc'),
    icon: 'User',
    visible: true,
    variant: 'primary' as const,
    onClick: () => router.push('/settings/profile'),
  },
  {
    id: 'settings',
    title: t('common.header.settings'),
    description: t('common.header.settingsDesc'),
    icon: 'Settings',
    visible: true,
    variant: 'default' as const,
    onClick: () => router.push('/settings'),
  },
  {
    id: 'theme',
    title: isDark.value ? t('common.header.switchToLight') : t('common.header.switchToDark'),
    description: t('common.header.themeDesc'),
    icon: isDark.value ? 'Sun' : 'Moon',
    visible: true,
    variant: 'default' as const,
    onClick: () => {
      isOpen.value = false;
      // 延迟执行主题切换，等待菜单关闭动画完成
      setTimeout(() => {
        themeStore.toggleMode();
      }, 150);
    },
  },
  {
    id: 'language',
    title: t('common.header.language'),
    description: currentLocale.value === 'zh-CN' ? '简体中文' : 'English',
    icon: 'Globe',
    visible: true,
    variant: 'default' as const,
    onClick: async () => {
      await localeStore.toggleLocale();
    },
  },
]);

/**
 * 可见的菜单项
 */
const visibleMenuItems = computed(() => menuItems.value.filter(item => item.visible !== false));

/**
 * 处理菜单项点击
 * @param item 菜单项
 */
const handleMenuItemClick = (item: typeof menuItems.value[0]) => {
  item.onClick();
};

/**
 * 处理登出
 */
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

/**
 * 获取图标组件
 * @param iconName 图标名称
 */
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, typeof User> = {
    User,
    Settings,
    Moon,
    Sun,
    Globe,
    Palette,
  };
  return iconMap[iconName] || User;
};

/**
 * 获取卡片样式
 * @param variant 主题变体
 */
const getCardClass = (variant: string): string => {
  const baseClass = 'group relative flex flex-col items-start gap-1.5 p-2.5 rounded-lg border transition-all duration-200 text-left overflow-hidden';

  switch (variant) {
    case 'primary':
      return `${baseClass} bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40`;
    case 'danger':
      return `${baseClass} bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300`;
    default:
      return `${baseClass} bg-muted/50 hover:bg-muted border-border/50 hover:border-border`;
  }
};

/**
 * 获取图标容器样式
 * @param variant 主题变体
 */
const getIconContainerClass = (variant: string): string => {
  const baseClass = 'relative h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm';

  switch (variant) {
    case 'primary':
      return `${baseClass} bg-primary/10 group-hover:bg-primary/20`;
    case 'danger':
      return `${baseClass} bg-red-100 group-hover:bg-red-200`;
    default:
      return `${baseClass} bg-background border border-border/60 group-hover:border-primary/40 group-hover:shadow-md`;
  }
};

/**
 * 获取图标样式
 * @param variant 主题变体
 */
const getIconClass = (variant: string): string => {
  switch (variant) {
    case 'primary':
      return 'h-4 w-4 text-primary group-hover:text-primary transition-colors duration-200';
    case 'danger':
      return 'h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors duration-200';
    default:
      return 'h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200';
  }
};
</script>

<template>
  <DropdownMenu v-model:open="isOpen">
    <DropdownMenuTrigger as-child>
      <button
        class="group relative flex items-center gap-2 px-2 h-9 rounded-lg transition-all duration-200 overflow-hidden"
        :class="'hover:bg-primary/10 hover:text-primary'"
      >
        <!-- 悬停光效 -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <Avatar class="h-7 w-7 ring-2 ring-primary/20 relative z-10">
          <AvatarImage v-if="userInfo.avatar" :src="userInfo.avatar" />
          <AvatarFallback class="text-xs bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
            {{ userInfo.name.charAt(0) || 'U' }}
          </AvatarFallback>
        </Avatar>

        <div class="hidden md:flex flex-col items-start min-w-0 relative z-10">
          <span class="text-sm font-medium leading-tight truncate max-w-[100px]">
            {{ userInfo.name }}
          </span>
          <span class="text-[10px] text-muted-foreground leading-tight">{{ t('common.header.admin') }}</span>
        </div>

        <ChevronDown class="h-3.5 w-3.5 text-muted-foreground/70 hidden md:block relative z-10 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </button>
    </DropdownMenuTrigger>

    <!-- Bento 风格下拉面板 -->
    <DropdownMenuContent
      align="end"
      class="w-[280px] p-0 overflow-hidden bg-popover border border-border shadow-2xl rounded-2xl"
      :side-offset="8"
    >
      <!-- 面板头部 - 渐变背景 -->
      <div class="relative px-3 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-border/50">
        <!-- 装饰光点 -->
        <div class="absolute top-0 right-3 w-16 h-16 bg-primary/20 rounded-full blur-2xl" />

        <div class="relative flex items-center gap-2.5">
          <Avatar class="h-10 w-10 ring-2 ring-background shadow-md">
            <AvatarImage v-if="userInfo.avatar" :src="userInfo.avatar" />
            <AvatarFallback class="text-sm bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
              {{ userInfo.name.charAt(0) || 'U' }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-foreground truncate">{{ userInfo.name }}</p>
            <p class="text-[11px] text-muted-foreground truncate">{{ userInfo.email }}</p>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                {{ userInfo.role === 'admin' ? t('common.header.adminRole') : t('common.header.userRole') }}
              </span>
            </div>
          </div>
          <Sparkles class="h-4 w-4 text-primary/50" />
        </div>
      </div>

      <!-- Bento 网格卡片 -->
      <div class="p-2.5 bg-popover">
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="(item, index) in visibleMenuItems"
            :key="item.id"
            :class="getCardClass(item.variant)"
            :style="{ animationDelay: `${index * 50}ms` }"
            @click="handleMenuItemClick(item)"
          >
            <!-- 悬停背景渐变 -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <!-- 图标容器 -->
            <div :class="getIconContainerClass(item.variant)">
              <component
                :is="getIconComponent(item.icon)"
                :class="getIconClass(item.variant)"
              />
            </div>

            <!-- 文字内容 -->
            <div class="relative flex-1 min-w-0">
              <p class="text-xs font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                {{ item.title }}
              </p>
              <p class="text-[10px] text-muted-foreground/80 line-clamp-1 mt-0.5">
                {{ item.description }}
              </p>
            </div>

            <!-- 悬停指示器 -->
            <div class="absolute top-1.5 right-1.5 flex items-center gap-1">
              <div class="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-200" />
            </div>
          </button>
        </div>
      </div>

      <!-- 退出登录区域 -->
      <div class="px-2.5 pb-2.5 bg-popover">
        <button
          class="group relative w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all duration-200 text-left overflow-hidden"
          @click="handleLogout"
        >
          <!-- 悬停背景渐变 -->
          <div class="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          <!-- 图标容器 -->
          <div class="relative h-8 w-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-all duration-200 shadow-sm">
            <LogOut class="h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
          </div>

          <!-- 文字内容 -->
          <div class="relative flex-1 min-w-0">
            <p class="text-xs font-medium text-red-600 group-hover:text-red-700 transition-colors duration-200">
              {{ t('common.header.logout') }}
            </p>
            <p class="text-[10px] text-red-400/80 line-clamp-1 mt-0.5">
              {{ t('common.header.logoutDesc') }}
            </p>
          </div>

          <!-- 悬停指示器 -->
          <div class="absolute top-1.5 right-1.5 flex items-center gap-1">
            <div class="h-1 w-1 rounded-full bg-red-500/0 group-hover:bg-red-500 transition-all duration-200" />
          </div>
        </button>
      </div>

      <!-- 面板底部 -->
      <div class="px-3 py-1.5 bg-muted/50 border-t border-border/50">
        <p class="text-[10px] text-muted-foreground/70 text-center">
          {{ t('common.header.userMenuFooter') }}
        </p>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
